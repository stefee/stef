# Understanding React as a system - Part 1

31 August 2021 • 10 min read

---

Note: since writing this, the React team has published a new docs website. The new [React Docs](https://beta.reactjs.org/learn/describing-the-ui) have put to bed pretty much all of the things which motivated me to write this, and they've done a much better job of explaining React for beginners than I've done here, so I recommend reading those docs instead.

---

I want to write about React to try and enable developers from various backgrounds to understand how it works, why it is good, and what it is good for.

This is perhaps a rather lofty ambition. A lot of people have written about React already, so why do I feel the need to write this now?

What I've found is that most of the writing about React is aimed specifically at front-end developers who are experienced in developing websites and other kinds of user interface code. I think maybe this is because the adoption of React in many teams has hinged on convincing the front-end developers in the team that it's something that they should be using.

React is very popular now in teams of various sizes, which is great! What this means though is that developers from various different schools of thought are now developing products with React, many of whom might not have chosen to use it otherwise.

My aim in writing this now is to try and help you to make the most of React even if, like me, you don't necessarily see yourself as a front-end developer.

I am also hoping that in the process of writing this I might be able to clarify my own mental model of React. So if you are experienced with React then hopefully this will still be interesting to read and you will learn something.

This is the first post of a two part series. In this introductory post I want to lay down a baseline understanding of React and what it does for us. The second part will go into more detail about how a React application works at runtime so we can try to build a mental model of React as a system.

---

## “Building user interfaces”

The [official React website](https://reactjs.org/) says this: “React is a JavaScript library for **building user interfaces**”.

I think this is a good sentence. 👍

Let's just talk about user interfaces for a moment.

User interfaces are how human beings interact with our computer code.

We have some choices when we are creating an interface for humans to use: we can try to create an interface that is intuitive and easy to use straight away, but this will require us to account for a lot of potential outcomes because we did not tell the user what we expect them to do ahead of time.

Alternatively, we can create a very streamlined interface that works in a very specific way, but this will require the user to learn exactly how to use it before they can achieve anything.

These are both valid choices and it depends who we have in mind as our user.

Humans can be quite messy and unpredictable, so if we do decide to make an intuitive user interface - one that does not require learning ahead of time - then it's often necessary for us to grapple with a large amount of complexity; an intuitive user interface will need to be able to react appropriately _on the fly_ to our users doing things we did not expect or want them to do.

And perhaps, as we learn more about our users, we will need to find new ways in which to accomodate them and so the complexity of interface will increase over time.

In short, user interfaces are often **necessarily complex**. Our goal then is not to make them simple, but to find ways to manage that complexity.

---

## React helps us to manage complexity

When we're writing code, it is generally hard to manage large amounts of complexity.

We may not be able to avoid complexity when we're building a user interface, but we can try to break it down and make it more manageable.

I think one of the core aims of React is to allow developers to build a complex user interface system without needing to think about it all at once.

I like this article called [Why Rust's Unsafe Works](https://jam1.re/blog/why-rusts-unsafe-works) by [@jam1garner](https://twitter.com/jam1garner) and it talks about the idea of **locality** and **encapsulation**. The article is unrelated to what we're talking about, but it says this about the _Rust_ programming language which I think is relevant:

> One of the greatest features of Rust is its increased design focus on locality, which is to say, it's easier to reason about a function without looking outside the function.

The Rust language is designed in such a way that functions are able to maintain locality; you can normally understand what a function does, and confidently make changes to it, without needing to read other parts of the code as well. You can also know with certainty whether or not a change you make to a function might break other parts of the code based purely on its return type and the type of its parameters.

React does something similar for us, by allowing us to write our user interface code in such a way that the component parts can maintain locality - i.e. we should be able to make changes to one specific part of our user interface in the confidence that it will either not affect other parts at all, or that we can fully understand how it might affect other parts.

React allows us to define a **React component** as a single JavaScript function or class (we will focus on the function kind here). A component encapsulates all of the appearance and behaviour that makes up some part of a user interface. By using React components, we can reason about the behaviour of some part of a user interface by looking only within the scope of a single JavaScript function.

Here's an example of a React function component:

```jsx
function MyUserInterface () {
    function handleButtonClick () {
        window.alert("Howdy ma'am");
    }
    return (
        <button onClick={handleButtonClick}>
            Hello dear
        </button>
    );
}
```

This code defines a component which I've decided to call MyUserInterface.

The component will render an HTML `<button>` tag which contains the text "Hello dear".

When the user clicks on the button, an alert will be shown in their browser window which says "Howdy ma'am".

---

Sidenote: You might have noticed in the above code example that the syntax `<button>` is not valid JavaScript syntax.

React uses a JavaScript language extension called JSX which compiles to vanilla JavaScript. Anywhere you see some JSX code like `<a href="/">Home</a>` this can be transformed into normal JavaScript code like `React.createElement('a', {href: '/'}, 'Home')` by a compiler such as [babel](https://babeljs.io/), [esbuild](https://esbuild.github.io/) or [swc](https://swc.rs/).

Since JSX compiles to normal JavaScript, we can use our React components, for example, to make up part of a web page. Here's a code example that shows how to do this in a single `.html` file which you can download and open in your favourite web browser: https://raw.githubusercontent.com/stefee/reactjs.org/main/static/html/single-file-example.html (this code is taken from the [official React website](https://reactjs.org/docs/getting-started.html#online-playgrounds)).

You can also use React [without JSX](https://reactjs.org/docs/react-without-jsx.html) if you like!

---

Here's a second example which has two components - but the rendered output will be the same as in the previous example:

```jsx
function AlertButton (props) {
    function handleButtonClick () {
        window.alert(props.alertText);
    }
    return (
        <button onClick={handleButtonClick}>
            {props.children}
        </button>
    );
}

function MyUserInterface () {
    return (
        <AlertButton alertText="Howdy ma'am">
            Hello dear
        </AlertButton>
    );
}
```

Here I have defined a new component and called it AlertButton.

This component looks similar to the previous example, but the text values are passed in as parameters. The parameters passed into a React component are called properties, or **props** for short.

Now our MyUserInterface component will render the AlertButton component and pass the text values as props.

The end result is identical to the previous example.

However, by changing the text values to be passed in as parameters, we have created an abstraction which will allow us to re-use this part of our user interface.

Here's an example where we render two different instances of AlertButton in our user interface:

```jsx
function AlertButton (props) {
    function handleButtonClick () {
        window.alert(props.alertText);
    }
    return (
        <button onClick={handleButtonClick}>
            {props.children}
        </button>
    );
}

function MyUserInterface () {
    return (
        <div>
            <AlertButton alertText="Howdy ma'am">
                Hello dear
            </AlertButton>
            <AlertButton alertText="Okeydokey">
                Goodbye
            </AlertButton>
        </div>
    );
}
```

With this interface, the "Hello dear" button works the same as before, but now if the user clicks the "Goodbye" button instead, they will see a different alert which says "Okeydokey".

This example shows how we are able to abstract some user interface behaviour into a component, and re-use components to do different things.

This is good stuff! 👌

---

Sidenote: I should explain the **children** prop which we used in AlertButton before continuing.

The children prop is a special prop which takes on the value of whatever appears between the open and close tags in our JSX code (`<AlertButton>` and `</AlertButton>`) and it is used to describe a **component hierarchy**.

The component hierarchy is what makes React components **composable**; components can be assembled in different combinations to satisfy different needs.

---

We've got one more key concept to cover which is **state**.

So far what we have seen is that a React component is able to describe how some part of a user interface should appear to the user.

As well as describing how some part of our user interface is rendered, a React components is also able to manage the state of that part of the interface, that is to say it can describe how it will **change** over time in response to events that may happen outside of its control.

Here's an example of a component that manages some state:

```jsx
function MyCounterButton () {
    const [counter, setCounter] = React.useState(0);
    function handleButtonClick() {
        setCounter(counter + 1);
    }
    return (
        <button onClick={handleButtonClick}>
            counter is {counter}
        </button>
    );
}
```

In this code example I've defined a new component which renders a button.

At first this button will say "counter is 0".

When the user clicks on the button, an event is triggered and the text will change to say "counter is 1". If the user clicks again it will say "counter is 2" and so on, and so forth.

What this example demonstrates is that a React component is able to persist some state in memory (in this case, the value of `counter`) between renders; when our component is rendered, React must store the value of `counter` somewhere so that it can be modified by our event handler and the value will be remembered for subsequent renders.

If you've not used React before then you might have a lot of questions at this point. This seems a bit magical, doesn't it?

I want to try and explain this fully, so we're going to talk a lot more in detail about exactly how state works in part 2 of this series.

First though, let's imagine we were to create a similar user interface to our previous example using just JavaScript.

Without React, we have to describe imperatively (step-by-step) how the elements are to be constructed and related to one another when our code gets executed - e.g. first we _create_ a div node and then we _create_ a button node and then we _attach_ an event handler to the button and then we _append_ the button to the div and so on, and so forth.

In contrast to this, React components are **declarative**; our div element _has_ children which _has_ the type of “button” and _has_ a click event handler.

Our components do not need to describe _how_ to construct our user interface, they only need to describe _what_ is to be shown to the user at any given point in time.

What this means is, since the elements that make up our user interface do not come into existence until we render the component hierarchy, we can know for sure that, unless it is passed explicitly via props, it is impossible for one component to access an element which is created by another component and modify it's behaviour in some way - this is how React components enable us to fully encapsulate the behaviour of some part of our user interface and isolate it from the rest.

This is also what enables us to maintain locality in our user interface code.

When we look at the code in the MyCounterButton example, I can say with confidence that this component will always render a button which says "counter", clicking the button will always increment the number shown on the button, and there will _never_ be any other hidden behaviours attached to the button by other components that we need to be concerned about when editing this code.

We can make these assertions simply because the MyCounterButton function does not have parameters, and so we know that running the function will always produce the same result, and the result will be defined only by the code inside the scope of the function.

In general, we can say that the appearance and behaviour of some user interface element rendered by a React component will only change if the props received from its parent change, or as a result of some state defined internally, and that the way in which some part of our user interface changes over time will only be decided by its associated React component, and not any other parts of the system.

This is how React enables us to break down a complex problem and reduce coupling between the component parts of our interface.

It ultimately means that we can continue to introduce more complexity into our user interface over time, and as long as we are able to understand how each individual component works in isolation, we can have confidence in the system as a whole.

---

## End of part 1

I think we've touched on all of the things I want to cover in this introduction.

This was originally going to be a post about how `React.useRef` works - which I haven't even mentioned once. I still think it's a good idea to talk about this as a way of building a robust mental model of React as a runtime system, so that will be the primary focus of part 2.

---

Thanks for taking the time to read this! <3

Please let me know what you think of it. You can contact me by email at stef@sril.email.

Also, thank you Sam Greenhalgh for reading my first draft. What a nice man.

References:

- _Is React Functional Programming?_ - Eric Normand<br />https://lispcast.com/is-react-functional-programming/
- _Composition: Every Layout_ - Heydon Pickering & Andy Bell<br />https://every-layout.dev/rudiments/composition/
- _Why Rust's Unsafe Works_ - jam1garner<br />https://jam1.re/blog/why-rusts-unsafe-works
