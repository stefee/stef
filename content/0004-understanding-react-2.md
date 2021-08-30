# Understanding React as a system - Part 2

_TODO: intro_

## Building a mental model for React

I want to move on now from the previous introductory examples and try to strip away a lot of the layers of understanding that we have built up in learning about React.

Instead, I'd like to talk specifically about how exactly a React component is able to persist state information between renders.

I'm going to avoid talking about specific places where we might use React like websites and mobile apps because I think this will confuse things. With this in mind, we will start with a slightly more abstract idea for a user interface.

In this example ...

_TODO: provide some preface to what we are trying to achieve for our "user" and how we will go about this, before showing the code example_

_NOTE: The example code here is confusing, because what is being returned from the function could be seen as being a stream of information, but the React tree actually has "state" - the string returned from a component is the new state of the UI. This is hard to represent properly using what initially appears to be a dialogue/conversation between the user and their computer. This should be easy to remedy by changing the nature of the dialogue to make it clearer that the UI is not literally speaking back to the user._

```js
import * as React from "react";

function MyUserInterface(props) {
    const user = props.user;

    const userName = React.useRef(null);

    function listenForUserSpeaking() {
        function setUserName(name) {
            userName.current = name;
        }

        const listener = user.addListener("speaking", setUserName);

        return function stopListening() {
            user.removeListener(listener);
        };
    }

    React.useEffect(listenForUserSpeaking, [user]);

    if (userName.current === null) {
        return "Hello, what is your name?";
    } else {
        return "Nice to meet you, " + userName.current + "!";
    }
}
```

I've defined a component here called MyUserInterface which ...

_TODO: explain the code_

A React component is just a code module which defines a part of our user interface. A component can be any vanilla JavaScript function which returns something that can be shown to the user, such as a string of text or other more complex elements (for example, [DOM Elements](https://reactjs.org/docs/dom-elements.html)).

_NOTE: the next section needs to be re-worked._

To use our MyUserInterface component, we need a **React renderer**. For this example, I'm going to use [React Test Renderer](https://reactjs.org/docs/test-renderer.html) which is designed to work in a pure JavaScript environment (it doesn't need to run in a browser like [ReactDOM](https://reactjs.org/docs/react-dom.html)).

I'm also going to use the [events](https://nodejs.org/dist/latest-v16.x/docs/api/events.html) module from Node.js to simulate our user, and the [assert](https://nodejs.org/dist/latest-v16.x/docs/api/assert.html) module to make assertions about the output rendered by our component.

We start off by creating a "user" - which is actually just an event bus. 🚌 The idea here is just to have some way of simulating user actions that occur outside the lifecycle of our React component. You can think of it as an analogy for a keyboard input on a web page, or some sort of advanced speech recognition interface - it doesn't matter for the sake of this example.

```js
const myUser = new EventEmitter();
```

The important thing to note about this `EventEmitter` is that we are creating it outside of our React component, and so the component will have no control over when or what kind of events might be emitted, it can only listen for events and act on them when they happen. This is a pretty good representation of how we interface with a real user.

In this next part, we declare a function called `createRenderer` which does a few things, in this order:

- Defines a props object which contains the event bus we created before to represent our user.
- Creates a **React element** which has the **type** of MyUserInterface - the type defines how the element should be rendered and it is normally a React component (i.e. a JavaScript function). The props object is also passed in here, and this defines the arguments that the component will recieve when the element is rendered.
- Creates an instance of `TestRenderer`. The renderer will render the element passed in immediately. The render output is called the **tree** and it is stored inside the renderer instance, which is returned from `TestRenderer.create`.

```js
let testRenderer;

function createRenderer() {
    const props = {
        user: myUser,
    };
    const element = React.createElement(MyUserInterface, props);
    testRenderer = TestRenderer.create(element);
}

function updateRenderer() {
    const props = {
        user: myUser,
    };
    const element = React.createElement(MyUserInterface, props);
    testRenderer.update(element);
}
```

We’ve also defined a function called `updateRenderer` which is almost identical to `createRenderer` except it re-uses the same renderer instance and calls `.update` on it.

Next, we call `createRenderer` and check that we got the expected output in the rendered tree. This part is actually quite simple.

```js
TestRenderer.act(createRenderer);
assert.equal(testRenderer.toTree().rendered, "Hello, what is your name?");
```

---

Sidenote: We needed to write `TestRenderer.act(createRenderer)` here instead of `createRenderer()`. This is because React takes advantage of the JavaScript event-loop to complete tasks asynchronously. We want to be able to make assertions on the renderered output straight away, and so calling `TestRenderer.act` will essentially force React to complete all of its outstanding work synchronously before returning.

I'm not going to explain how `.act` works in detail here, because it doesn't have any practical applications outside of developing your own testing framework. There's a detailed explanation of it [here](https://github.com/threepointone/react-act-examples/blob/master/sync.md).

---

Now this is where it gets interesting.

```js
myUser.emit("speaking", "Michael Cera");
assert.equal(testRenderer.toTree().rendered, "Hello, what is your name?");

TestRenderer.act(updateRenderer);
assert.equal(testRenderer.toTree().rendered, "Nice to meet you, Michael Cera!");
```

If we look at our `updateRenderer` function again, you can see that it's not rendering the same _element_ as before. It creates a new element, and then asks the renderer to update the tree using that.

```js
function updateRenderer() {
    const props = {
        user: myUser,
    };
    const element = React.createElement(MyUserInterface, props);
    testRenderer.update(element);
}
```

And yet the tree has clearly reacted to the user "speaking".

```js
myUser.emit("speaking", "Michael Cera");
// ...
TestRenderer.act(updateRenderer);
assert.equal(testRenderer.toTree().rendered, "Nice to meet you, Michael Cera!");
```

When we look at our MyUserInterface component again, this behaviour might seem like magic.

```js
function MyUserInterface(props) {
    const user = props.user;

    const userName = React.useRef(null);

    function listenForUserSpeaking() {
        // ...
    }

    React.useEffect(listenForUserSpeaking, [user]);

    if (userName.current === null) {
        return "Hello, what is your name?";
    } else {
        return "Nice to meet you, " + userName.current + "!";
    }
}
```

What React has done here is not too hard to understand, but it requires some explanation.

When the tree is rendered, the renderer renders the element we've given it and wraps the output in a **React node**. A node has a unique identifier and a type, which is the type of the element that it was derived from (i.e. the element we passed into `TestRenderer.create` or `testRenderer.update`).

On subsequent renders of the tree, the renderer checks to see if the new element we've given it has the same type as the node in the existing tree, and if it does, it will amend the existing node instead of creating a new one.

What this means is that if we were to store some extra data on a React node, it will be persisted between renders as long as the node has the same type - this is exactly what [`React.useRef`](https://reactjs.org/docs/hooks-reference.html#useref) does.

The `React.useRef` function is one example of a **React hook**. Hooks are functions provided by the React library that can be called whilst rendering a component, and they can store information on the React tree or "hook into" the lifecycle of nodes on the tree.

The `useRef` hook can only be called from within a component's function body - this is one of the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) - and since React is able to guarantee that any element produced by a given component will be of the same type, the `useRef` hook is therefore able to provide a mechanism for a component to persist some information between renders.

---

Sidenote: the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) can be enforced at buildtime using a code linter such as [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks).

It's a good idea to do this, because otherwise you will have to check your code manually to make sure that you're not breaking the rules.

If your React components don't follow these rules, then unexpected things can happen.

Whilst we are on this subject, I also recommend taking advantage of React's [Strict Mode checks](https://reactjs.org/docs/strict-mode.html) - these are not related to hooks in particular, but they can help you by flagging potential issues with your React code during development.

---

When the `useRef` hook is called the first time, the React renderer ... and returns a **reference** to this object.

_TODO: continue explaining `useRef` ...

_Work in progress ..._

TODO:
- explain `React.useState` vs `React.useRef` - how is `useState` able to trigger re-renders?
- explain `React.useEffect`
