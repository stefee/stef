import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Stef's Website</title>
      </Head>

      <h1>Stef's Website 🦖</h1>

      <main>
        <input type="search" name="q" />
        <p>Welcome!</p>
        <p>You can email me at <a href="mailto:stef@srilq.email">stef@srilq.email</a>.</p>
        <h2 id="writing">Writing ✍️</h2>
        <p><a href="https://dev.to/stefee/speedy-builds-with-docker-layer-caching-4fae">Speedy builds with Docker Layer Caching</a></p>
        <h2 id="talks">Talks 🗣</h2>
        <p><a href="https://www.youtube.com/watch?v=AwfXypdYcv0">5 Things I Learned About Software Engineering From Watching Art Restoration Videos</a></p>
        <h2 id="software-projects">Software Projects 🌱</h2>
        <h3 id="letter-press"><em>react-promise-state-hook</em></h3>
        <p>A simple React hook that provides state for async actions.</p>
        <p><a href="https://www.npmjs.com/package/react-promise-state-hook">Package</a></p>
        <p><a href="https://github.com/stefee/react-promise-state-hook">Source</a></p>
        <h3 id="renditions"><em>renditions</em></h3>
        <p>JavaScript modules for implementing W3C-standard responsive images.</p>
        <p>Packages:</p>
        <ul>
          <li><a href="https://github.com/renditions/get-sizes">@renditions/get-sizes</a></li>
          <li><a href="https://github.com/renditions/get-srcset">@renditions/get-srcset</a></li>
          <li><a href="https://github.com/renditions/react-img">@renditions/react-img</a></li>
          <li><a href="https://github.com/renditions/react-picture-source">@renditions/react-picture-source</a></li>
        </ul>
        <p><a href="https://renditions.dev/project">Project board</a></p>
        <h3 id="letter-press"><em>letter-press</em></h3>
        <p>Print GitHub Markdown to PDF using headless Chrome. 💌</p>
        <p><a href="https://www.npmjs.com/package/letter-press">Package</a></p>
        <p><a href="https://github.com/stefee/letter-press">Source</a></p>
        <h3 id="outerspace"><em>outerspace</em></h3>
        <p>Preserve whitespace surrounding expressions in a template string.</p>
        <p><a href="https://github.com/stefee/outerspace">JavaScript Source</a></p>
        <p><a href="https://github.com/stefee/outerspace-rs">Rust Source</a></p>
        <h3 id="content-migrations-at-conde-nast">content migrations at Condé Nast</h3>
        <p><em>Flyway</em> is a system for migrating content from an existing CMS into Condé Nast's CMS. Content can be defined as articles, authors, categories, galleries, videos and images.</p>
        <p>We implemented a "self-service" model to allow engineers to migrate content into our CMS without any intervention from the core team.</p>
        <p>This system was used to migrate <em>Vogue</em> and <em>GQ</em> websites managed by 10 different market teams onto our web platform managed in London.</p>
        <p><a href="https://web.archive.org/web/20200919173414/https://conde-nast-international.gitbook.io/flyway-docs/">Flyway Manual (archive)</a></p>
        <h3 id="design-systems-at-conde-nast">design systems at Condé Nast</h3>
        <p>&ldquo;A unified, scalable, digital design language for Condé Nast brands.&rdquo;</p>
        <p><em>Atelier</em> is a React <a href="https://github.com/styled-components/styled-components">styled-components</a> library created for Condé Nast's brand sites. The library supports multiple brand identities and is used by a handful of different web applications.</p>
        <p><a href="http://atelier.prod.cni.digital/">Atelier Storybook</a></p>
        <p><a href="https://www.gq-magazine.co.uk/">British GQ</a></p>
        <p><a href="https://www.vogue.fr/defiles">Vogue Paris Défilés</a></p>
        <h3 id="real-time-shock-wave-simulation">real-time shock wave simulation 💥</h3>
        <p>My research project in the final year of my degree was around simulating shock waves in real time using the Unity game engine. This project was largely considered to be a failure. You can read more about it in the <a href="https://drive.google.com/file/d/1dPqoEMLLgfVp1GoaMR64fziYLpqxvOWr/view?usp=sharing">Technical Report doc</a>.</p>
        <h3 id="web-marketing-sites-at-feral-interactive">web marketing sites at Feral Interactive</h3>
        <ul>
          <li><a href="https://www.feralinteractive.com/en/games/lifeisstrange/">Life Is Strange for Mac and Linux</a></li>
          <li><a href="https://www.feralinteractive.com/en/games/alienisolation/">Alien: Isolation for Mac and Linux</a></li>
          <li><a href="https://www.feralinteractive.com/en/linux-games/f12015/">F1 2015 for Linux</a></li>
          <li><a href="https://www.feralinteractive.com/en/games/dirtrally/">DiRT Rally for Mac and Linux</a></li>
          <li><a href="https://www.feralinteractive.com/en/games/companyofheroes2/">Company of Heroes 2 for Mac and Linux</a></li>
          <li><a href="https://www.feralinteractive.com/en/mac-games/medieval2/">Medieval II: Total War for Mac</a></li>
        </ul>
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
  )
}
