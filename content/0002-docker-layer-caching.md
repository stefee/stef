# Speedy builds with Docker Layer Caching

12 January 2020 · 7 min read

---

I found Docker to be one of the most intimidating and confusing things about my work. Hopefully I can share some of what I’ve learned in a way that is accessible and somewhat less intimidating.

---

## What is Docker?

Docker is an application for “containerising” software in an [(almost) virtual machine](https://en.wikipedia.org/wiki/Docker_(software)). Docker containers can be used to:

* Isolate your application code from the rest of your computer.
* Allow you to control what resources an application has access to (e.g. networking).
* Run your code on a virtual operating system, allowing you to run it on different computers and have greater confidence that it will behave the same way (e.g. during development and in production).

## How it works

Here’s how a Docker container gets made:

1. You write a _Dockerfile_ and add it alongside your source code.
2. You give your _Dockerfile_ to the Docker _build_ command.
3. Docker builds up an _image_ of a container by running the instructions from your _Dockerfile_.
4. You give that image to the Docker _create_ command.
5. Docker creates a container from the image.

So first off, Docker builds an image based on the instructions in your _Dockerfile_.

Here’s what that might look like:

```dockerfile
FROM node:12.14.1-slim
USER node
COPY package.json /home/node/
WORKDIR /home/node
RUN npm install
RUN npm run build
```

Each line in the _Dockerfile_ is an [instruction](https://docs.docker.com/engine/reference/builder/#from) for how Docker should build the image.

For example, the _copy_ instruction copies a file from the Docker context (e.g. your source code) into the container. (A container has its own file system!)

Docker executes your instructions one after the other, then creates a snapshot of the result and stores this as an _image_.

You can then _create_ a container from the image, _start_ the container, and _execute_ commands inside it.

Here’s how I would build and run my Node.js app using the above _Dockerfile_:

```bash
docker build --tag my_app .
docker run my_app npm start
```

(Docker _run_ is like a combination of _create_, _start_ and _execute_ in a single command).

But wait, that’s not the full picture of what’s happening. Let’s talk about layers.

## How layers work

Docker doesn’t just create a snapshot at the end of building an image. In fact, Docker creates a snapshot from the result of every instruction during a build.

These snapshots are called _layers_, and each layer is a recording of **what changed** as a result of executing an instruction.

Because a layer only stores what changed since running the previous instruction, each layer is dependant on the previous layer (aka. its _parent_ layer). A layer without its parent is invalid, because it only makes sense in the context of its parent layers.

So, a layer consists of:

* An instruction
* A recording of what changed during the instruction
* A unique ID
* The ID of its parent

(Sidenote: Docker layers look a lot like Git commits!)

Docker stores all of the layers during a build in the outputted image.

When you ask Docker to create a container from an image, Docker re-plays the changes from each of the layers, one on top of the other (that’s why they’re called layers).

## How layer caching works

When you run `docker build` you can give Docker an image to use as its layer cache by adding the `--cache-from` command-line argument.

Before running each instruction, Docker will check if there’s a layer in its cache which matches the instruction it’s going to run, and if it finds one, it will use that layer rather than building a new one. Nice one, Docker!

Importantly though, Docker also checks that the previous layer’s ID matches the cached layer’s parent ID. If the previous layer doesn’t match, then the cached layer can’t be used.

The effect of this is that as soon as Docker fails to find a match in its layer cache for one instruction, the layer for that instruction and all of the child layers will have to be re-built – invalidating one cached layer effectively invalidates all of its children as well.

To demonstrate how this works in practice, let’s go back to our example _Dockerfile_, which looks like this:

```dockerfile
FROM node:12.14.1-slim
USER node
COPY package.json /home/node/
WORKDIR /home/node
RUN npm install
RUN npm run build
```

Let’s run `docker build`, and add the `--cache-from` argument like so:

```bash
docker build --tag “my_app” --cache-from=”my_app” .
```

Here’s our log output:

```log
Step 1/6 : FROM node:12.14.1-slim
 ---> 918c7b4d1cc5
Step 2/6 : USER node
 ---> Using cache
 ---> d897eea3d14a
Step 3/6 : COPY package.json /home/node/
 ---> Using cache
 ---> 6211fc2535b1
Step 4/6 : WORKDIR /home/node
 ---> Using cache
 ---> 8b7fbfbc367f
Step 5/6 : RUN npm install
 ---> Using cache
 ---> 530d5f1f8e6d
Step 6/6 : RUN npm run build
 ---> Using cache
 ---> ae5267476d3d
Successfully built ae5267476d3d
Successfully tagged my_app
```

After each instruction, Docker logs `Using cache`, followed by the ID of the layer it’s caching from.

Now, if I change my _Dockerfile_ to say `RUN npm install --only=prod` instead of `RUN npm install` and re-run the build, here’s what we get:

```log
Step 1/6 : FROM node:12.14.1-slim
 ---> 918c7b4d1cc5
Step 2/6 : USER node
 ---> Using cache
 ---> d897eea3d14a
Step 3/6 : COPY package.json /home/node/
 ---> Using cache
 ---> 6211fc2535b1
Step 4/6 : WORKDIR /home/node
 ---> Using cache
 ---> 8b7fbfbc367f
Step 5/6 : RUN npm install --only=prod
 ---> Running in a168555b7db9
Removing intermediate container a168555b7db9
 ---> 44ab41899c52
Step 6/6 : RUN npm run build
 ---> Running in 1230a3e778aa
Removing intermediate container 1230a3e778aa
 ---> 8d3dca829a17
Successfully built 8d3dca829a17
Successfully tagged my_app
```

You can’t tell from the log output, but this build ran a lot slower than the last one! Let’s figure out why.

The first few lines here are the same as before, but now when we get to the instruction we changed, instead of:

```log
Step 5/6 : RUN npm install
 ---> Using cache
 ---> 530d5f1f8e6d
```

Now we get:

```log
Step 5/6 : RUN npm install --only=prod
 ---> Running in a168555b7db9
Removing intermediate container a168555b7db9
 ---> 44ab41899c52
```

Aha, so rather than using cache for this step, it has executed the instruction because the instruction has changed! This is a good thing of course, because we changed the instruction so we want Docker to do something different. If Docker used the cached layer, it would have the wrong result.

But the key thing here is that the ID of the layer has changed as well (from `530d5f1f8e6d` to `44ab41899c52`). This means from this point on, when Docker looks in its layer cache, it won’t find a layer that matches, because the IDs of the layers are all different to before — and remember, it caches layers based on the ID of the parent layer as well as the instruction.

All of the layers will have to be re-built for the instructions following the one we changed. And you can see in the log output that this is exactly what happened. There are no more `Using cache` lines once the cache gets invalidated.

So the reason why our build took longer was because we had to re-run both the `npm install` and `npm run build` steps in full.

It’s worth noting here that this is not a problem with Docker, it’s an important feature! The result of `npm run build` could change depending on whether we ran `npm install` or `npm install --only=prod` before-hand. Changing the `npm install` line in our _Dockerfile_ means we will almost certainly want Docker to re-run our `npm run build` as well. This is _cache invalidation_ working just as intended.

And of course, if we were to re-run this command again without making any changes, we would now get a fully cached build, since we are overwriting the same image tag each time.

## Why this matters

It’s important to understand how Docker layer caching works when writing your _Dockerfile_.

Let’s use this _Dockerfile_ snippet as an example:

```dockerfile
COPY src /home/node/src
COPY package.json /home/node/
WORKDIR /home/node
RUN npm install
RUN npm run build
```

Here we have placed our `COPY src` instruction _before_ our `npm install` instruction. This means `npm install` will have to execute again every time we make a change to the files in the `src` directory, because a change to the `src` files will invalidate the layer cache during the `COPY src` line. (Note: during a `COPY`, Docker will treat file changes as if the instruction has changed and this will invalidate the cache).

In the case of my Node.js app, I’m confident that the result of `npm install` will not be affected by what’s in my `src` folder, so I‘d like to be able to make changes to `src` without having to wait for `npm install` every time.

So let’s change the order of our _Dockerfile_ and move `COPY src` to happen after `npm install`:

```dockerfile
COPY package.json /home/node/
WORKDIR /home/node
RUN npm install
COPY src /home/node/src
RUN npm run build
```

Now if I change the contents of `src` but I haven’t touched `package.json`, Docker can take the first few layers straight from the cache, and it only has to re-run `npm run build`. And that’s exactly what we want, since the output from `npm install` doesn’t change depending on the content of `src`, but the output from `npm run build` _does_.

This will speed up my build when I’m not changing `package.json`, because it means Docker doesn’t re-run `npm install`. 🎉

## In conclusion…

It’s important to be aware of dependencies between instructions in your _Dockerfile_ to maximise the benefits from Docker layer caching. Try to group dependent instructions together.

You can also think about which things you change often and which things you don’t, and try to put the things which you think will change most often towards the bottom of your _Dockerfile_.

---

Thanks for taking the time to read this! <3

Please let me know what you think of it. You can contact me by email at stef@srilq.email.

Also, thank you Tom Gallacher for reading my first draft. Lovely chap!
