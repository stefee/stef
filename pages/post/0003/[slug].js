import Head from 'next/head'
import Content from '../../../content/0003-understanding-react-1.md';

export default function Post() {
  return (
    <div className="container">
      <Head>
        <title>Understanding React as a system - Part 1 - Stef's Website</title>
        <meta name="description" content="I want to write about React to try and help people to understand what it is, how it works, why it is good, and what it is good for. This is the first post of a two part series. In this introductory post I want to lay down a baseline understanding of React and what it does for us. The second part will go into more detail about how a React application works at runtime so we can try to build a mental model of React as a system." />
      </Head>

      <a href="/">Home</a>

      <main>
        <Content />
      </main>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        html {
          background-color: #ffe5eb;
          font-size: 1.1rem;
        }

        body {
          background-color: white;

          padding: 1rem 1rem 4rem;
          margin: 0 auto;
          max-width: 42rem;
        }

        a,
        a:link,
        a:visited {
          color: inherit;
          text-decoration: none;
        }

        a {
          background-color: #ffb6c7;
          box-shadow: 0 -0.1rem #ffb6c7, 0 0.2rem #000;

          word-break: break-word;
        }

        a:focus {
          outline-width: 4px;
          outline-style: solid;
          background-color: #ffdd00;
          box-shadow: 0 -0.2rem #ffdd00, 0 0.2rem #ffdd00;
        }

        p,
        li {
          line-height: 1.6;
        }

        li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        h2 {
          margin-top: 2em;
          margin-bottom: 1em;
        }

        h3 {
          margin-top: 2em;
          margin-bottom: 1em;
        }

        hr {
          border: 1px solid black;

          margin-top: 4em;
          margin-bottom: 4em;

          margin-right: 2em;
          margin-left: 2em;
        }

        pre {
          background-color: #ffe5eb;

          padding-top: 1em;
          padding-bottom: 1em;

          overflow-x: scroll;
        }

        p code {
          background-color: #ffe5eb;
        }
      `}</style>
    </div>
  )
}
