import Head from 'next/head';
import Content from '../../../content/0005-typebox-unsafe-cast.md';

export default function Post() {
  return (
    <div className="container">
      <Head>
        <title>Using unsafe cast in TypeBox to convert strings to template string literals - Stef's Website</title>
        <meta name="description" content="You can use Type.Unsafe to change the output type of a schema such as to cast a formatted string to a template literal type in a validation schema. I wanted to share this explanation for anyone trying to figure out how to do this, because it took me a while to figure it out!" />
        <link rel="canonical" href="https://stef.sh/post/0005/typebox-unsafe-cast" />
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
  );
}
