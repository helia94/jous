// Blog.jsx

import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Icon } from "semantic-ui-react";
import "./Blog.css";

export default function Blog() {
  const articleRefs = useRef([]);

  // Intersection Observer to update the URL hash as you scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const { id } = entry.target;
            window.history.replaceState(null, "", `#${id}`);
          }
        });
      },
      { threshold: 0.6 }
    );

    articleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Copy current URL to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  return (
    <div className="blog-page">
      <Helmet>
        <title>Jous Blog - Magazine Style</title>
      </Helmet>

      {/* Table of Contents (moves to left on desktop, on top on phone) */}
      <nav className="toc-block">
        <h2 className="toc-heading">Contents</h2>
        <ul>
          <li>
            <a href="#why-use-jous">Why Use <i>Jous</i></a>
          </li>
          <li>
            <a href="#how-to-use-jous">How to Use <i>Jous</i></a>
          </li>
          <li>
            <a href="#alternatives-jous">Alternatives</a>
          </li>
          <li>
            <a href="#support-jous">How to Support <i>Jous</i></a>
          </li>
          <li>
            <a href="#work-with-jous">Work with <i>Jous</i></a>
          </li>
          <li>
            <a href="#podcasters">Jous for Podcasters</a>
          </li>
          <li>
            <a href="#events">Jous for Event Organisers</a>
          </li>
          <li>
            <a href="#other-apps">Use Jous in other Apps</a>
          </li>
          <li>
            <a href="#families">Jous for Families</a>
          </li>
          <li>
            <a href="#small-talk-kills">Small Talk Kills / Change Culture</a>
          </li>
        </ul>
      </nav>

      {/* Articles Area */}
      <div className="articles-block">
        {/* Single share button (fixed at top-right of articles area) */}
        <div className="share-button" onClick={copyLink}>
          <Icon name="share alternate" size="large" />
        </div>

        <article
          id="why-use-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[0] = el)}
        >
          <h1 className="mag-title">Why Use <strong>Jous</strong></h1>
          <p className="mag-paragraph">
            I have to be <em>honest</em>, there are not many people that I know who use Jous regularly...
          </p>
          <p className="mag-paragraph">
            My mom is a big fan, so is my 10-year-old sister, but they don’t use Jous when I’m not around...
          </p>
          <p className="mag-paragraph">
            Everyday surface conversations often make me feel time is wasted, while Jous creates deeper, more authentic connections...
          </p>
        </article>

        <article
          id="how-to-use-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[1] = el)}
        >
          <h1 className="mag-title">How to Use <strong>Jous</strong></h1>
          <p className="mag-paragraph">
            <strong>Step One</strong>: Admit you often feel lonely and want to connect more deeply...
          </p>
          <p className="mag-paragraph">
            <strong>Step Two</strong>: Be brave. People might reject or laugh. It’s not personal...
          </p>
          <p className="mag-paragraph">
            <strong>Step Three</strong>: Pick your audience, assess openness, then suggest using prompts...
          </p>
        </article>

        <article
          id="alternatives-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[2] = el)}
        >
          <h1 className="mag-title">Alternatives to <strong>Jous</strong></h1>
          <p className="mag-paragraph">
            <em>Coming Soon...</em>
          </p>
        </article>

        <article
          id="support-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[3] = el)}
        >
          <h1 className="mag-title">How to Support <strong>Jous</strong></h1>
          <p className="mag-paragraph">
            The best and most direct support is using it with people you care about...
          </p>
          <p className="mag-paragraph">
            Any feedback helps me understand what works and what doesn’t...
          </p>
        </article>

        <article
          id="work-with-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[4] = el)}
        >
          <h1 className="mag-title">Work with <strong>Jous</strong></h1>
          <p className="mag-paragraph">
            Jous needs a social media manager. We also welcome creative drawings to make it visually pleasing...
          </p>
          <p className="mag-paragraph">
            Jous is nonprofit; I look for partners in crime, not employees...
          </p>
        </article>

        <article
          id="podcasters"
          className="blog-article"
          ref={(el) => (articleRefs.current[5] = el)}
        >
          <h1 className="mag-title"><strong>Jous</strong> for Podcasters</h1>
          <p className="mag-paragraph">
            I'm on a mission to change the culture around conversation. You, the podcaster, are part of that mission...
          </p>
          <p className="mag-paragraph">
            Many prompts can add twists to your flow, making episodes personal and engaging...
          </p>
        </article>

        <article
          id="events"
          className="blog-article"
          ref={(el) => (articleRefs.current[6] = el)}
        >
          <h1 className="mag-title"><strong>Jous</strong> for Event Organisers</h1>
          <p className="mag-paragraph">
            Polite intros and safe questions can get stale. Jous invites participants to share more than
            surface-level anecdotes...
          </p>
        </article>

        <article
          id="other-apps"
          className="blog-article"
          ref={(el) => (articleRefs.current[7] = el)}
        >
          <h1 className="mag-title">Use <strong>Jous</strong> in other Apps</h1>
          <p className="mag-paragraph">
            So many apps aim to bring people together but often lack deeper conversation. 
            The Jous API can integrate and shuffle conversations...
          </p>
        </article>

        <article
          id="families"
          className="blog-article"
          ref={(el) => (articleRefs.current[8] = el)}
        >
          <h1 className="mag-title"><strong>Jous</strong> for Families</h1>
          <p className="mag-paragraph">
            If I could pick only one place for Jous, it'd be family. We spend so much time together,
            yet remain in loops...
          </p>
        </article>

        <article
          id="small-talk-kills"
          className="blog-article"
          ref={(el) => (articleRefs.current[9] = el)}
        >
          <h1 className="mag-title">Small Talk Kills / Change the Culture</h1>
          <p className="mag-paragraph">
            <strong>Small Talk</strong> can be a warm-up, but years of it leads to isolation. We need more depth...
          </p>
          <p className="mag-paragraph">
            Be Guy #3: the person who joins and makes it safe for others to follow, changing the norm...
          </p>
        </article>
      </div>
    </div>
  );
}
