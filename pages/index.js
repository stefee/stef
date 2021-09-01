import Head from 'next/head';
import Index from '../content/index.md';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Stef's Website</title>
      </Head>

      <main>
        <Index />
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
      `}</style>
    </div>
  );
}
