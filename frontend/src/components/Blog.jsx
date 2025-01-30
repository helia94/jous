// Blog.jsx

import React, { useEffect, useRef, useState } from "react";

import { Helmet } from "react-helmet";
import { Icon } from "semantic-ui-react";

import { Cloudinary } from '@cloudinary/url-gen';
import {AdvancedImage, responsive, placeholder} from '@cloudinary/react';
import { autoEco } from "@cloudinary/url-gen/qualifiers/quality";
import { webp } from "@cloudinary/url-gen/qualifiers/format";


import "./Blog.css";

const cld = new Cloudinary({ cloud: { cloudName: 'dl9xg597r' } });

const imgPublicId = 'printed-cards-trans_klnc6j.png'

const img = cld
      .image(imgPublicId)
      .format(webp())
      .quality(autoEco())

const backgroundStyle = {
  width: '95%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};


const cldImage = <AdvancedImage cldImg={img} plugins={[responsive({steps: 200}), placeholder({mode: 'blur'})]} style = {backgroundStyle}/>

export default function Blog() {

  const [isMobile, setIsMobile] = useState(false);

  const articleRefs = useRef([]);

  const [currentSection, setCurrentSection] = useState("");


  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', checkIsMobile);
    checkIsMobile();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
            window.history.replaceState(null, "", `#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.6 }
    );

    articleRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      observer.disconnect();
    };
  }, []);

  const copyLink = () => {
    const urlWithSection = `${window.location.origin}${window.location.pathname}#${currentSection}`;
    navigator.clipboard.writeText(urlWithSection);
    alert("Link copied!");
  };

  useEffect(() => {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="blog-page">
      <Helmet>
        <title>Jous Blogs – Reasons for Better Conversations</title>
        <meta
          name="description"
          content="Why Use Jous, How to Use Jous, Alternatives, Support, Collaboration, and bridging gaps through authentic talks."
        />
        <meta
          name="keywords"
          content="Jous, why use jous, how to use jous, small talk, events, families, deeper discussions, conversation prompts, culture shift"
        />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Jous Blog – Full Guide",
            keywords: [
              "Jous",
              "conversation prompts",
              "why use jous",
              "how to use jous",
              "families",
              "podcasters",
              "events",
              "culture",
              "small talk kills"
            ],
            description:
              "Comprehensive coverage of Jous, from usage tips to family bonding, event organization, cultural change, and more.",
            url: "https://jous.app/blog",
            author: {
              "@type": "Person",
              name: "Helia Jamshidi"
            }
          })}
        </script>
      </Helmet>


      {/* Table of Contents (moves to left on desktop, on top on phone) */}
      <nav className="toc-block" id="toc-block">
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
            <a href="#podcasters"><i>Jous</i> for Podcasters</a>
          </li>
          <li>
            <a href="#events"><i>Jous</i> for Event Organisers</a>
          </li>
          <li>
            <a href="#other-apps">Use <i>Jous</i> in other Apps</a>
          </li>
          <li>
            <a href="#families"><i>Jous</i> for Families</a>
          </li>
          <li>
            <a href="#small-talk-kills">Small Talk Kills</a>
          </li>
          <li>
            <a href="#change-culture">Change the Culture</a>
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
          <h1 className="mag-title">Why Use Jous</h1>

          <p className="mag-paragraph">
            I have to be <em>honest</em>, there are not many people that I know of except for me who use <i>Jous</i> regularly. I use it any chance I get, which means anytime I feel people will likely not reject my proposal of asking them weird questions.
          </p>

          <p className="mag-paragraph">
            My mom is a big fan, she cannot have enough of me asking her questions, and so is my 10-year-old sister, whose answers are really to the point, even to the questions that I suspect are too abstract for her age. But even these people do not use <i>Jous</i> when I am not with them. What I have heard ten times is: “We enjoy it only with you!”.
          </p>

          <p className="mag-paragraph">
            How come they get so much out of this, have a unique experience, have a sparkle in their eye, and feel much closer to each other, and yet not want to repeat it until 6 months later when I am back? I cannot know for sure, but I remember four years ago when I started <i>Jous</i>, I was also more shy to propose it. Even now I linger enough for someone else to mention it first, but inside I would be waiting for it all along.
          </p>

          <p className="mag-paragraph">
            So let me try to describe what I get out of having conversations with <i>Jous</i> or any other Conversation Cards for that matter. Everyday surface conversations, at work or with family most of all give me a feeling of time being wasted drop by drop. I like the social picture, eating, and drinking together, but the sheer lack of interest in the conversation going on pushed me to eat alone, with a podcast or a movie. After a year of having the same conversations with slightly different flavors, it was almost always ignorable how much this pile of invested time contributed to me getting to know anyone better.
          </p>

          <p className="mag-paragraph">
            Instead, I was ready for more intimacy, for more juice, and for showing how imperfect I really was, and in return receive the other people, as detailed, as unique, and as vulnerable as they really were. Not the well-packaged, labeled, I have no needs versions of them. After just one hour of talking with the help of such prompts compared to one (or ten) hours of the standard program, I felt without exception, that my connection with the other persons deepened at an astonishing speed. My view of them changed in unexpected ways; the people predictable to me were now surprising me. I was also acting and feeling different myself; I was not repeating myself as usual, I was not feeling lonely, but connected. The part of my brain responsible for judging others was shutting up, and instead, curiosity was at its peak. I no longer would find anyone boring, even people near me whom I had not paid real attention to for the past ten years. Hearing how everyone struggles with their inner desire and voice made me go soft on my inner conflicts. I felt okay not being okay when I saw no one else really was either.
          </p>

          <p className="mag-paragraph">
            <i>Jous</i> offers prompts that ask us to share what we normally hesitate to mention. Each question is a subtle invitation to see one another anew and find relief in discovering the individuality in each other. It should not be storming the walls of someone’s privacy, but helping us knock gently on the door. It aspires to open a space for authenticity without demanding it.
          </p>
          <div className="empty-block"></div>
        </article>



        <article
          id="how-to-use-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[1] = el)}
        >
          <h1 className="mag-title">
            How to Use Jous
          </h1>

          <p className="mag-paragraph">
            <strong>Step One</strong>: Let the small talk flow and help everyone relax.
          </p>

          <p className="mag-paragraph">
            <strong>Step Two</strong>: Be brave. Once you suggest these questions, others might laugh at it. It takes a bit of energy and friction to step outside the usual conversation. But it has gotten somewhat easier for me in the past four years.
          </p>

          <p className="mag-paragraph">
            <strong>Step Three</strong>: Pick your audience, assess if they might be open to it, and then suggest using some prompts for a different conversation. I have done it by starting with just two people and up to eight. However, with eight people I take more the role of a host than a participant, to help the conversation flow, and give everyone time. My favorite moments have been, at night while traveling with a group, as pillow talk with my partner, and at dinner with family.
          </p>

          <p className="mag-paragraph">
            <strong>Step Four</strong>: Use the random page first, and try the questions without any filters—you can adjust them later. Read the question out loud; if it fits well with the group, each person can take turns adding their answer. If the question does not fit, skip it without any fuss. It’s not about forcing confessions; it’s about creating a safe atmosphere where people feel free to speak or remain silent.
          </p>

          <section className="mag-tips">
            <p className="mag-subtitle"><strong>Tips</strong></p>
            <ul className="mag-list">
              <li>
                If the question takes you to a completely different topic, let it happen. The questions are just to help in a moment of silence, not to set any rules.
              </li>
              <li>
                Do not press anyone into answering, unless you know their boundaries well and you can do it with humor.
              </li>
              <li>
                Know when to stop. In my experience, that is varied—anything from half an hour to more than three hours.
              </li>
              <li>
                Offer some tea.
              </li>
            </ul>
          </section>
          {isMobile && (
            <div className="toc-mobile-button">
              <a href="#toc-block">Back to Contents</a>
            </div>
          )}
          <div className="ascii-art-item">
            {"( -_-)旦~"}
          </div>
        </article>


        <article
          id="alternatives-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[2] = el)}
        >
          <h1 className="mag-title">Alternatives to Jous</h1>
          <p className="mag-paragraph">
            <em>Coming Soon...</em>
          </p>
          {cldImage}
        </article>

        <article
          id="support-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[3] = el)}
        >
          <h1 className="mag-title">
            How to Support Jous
          </h1>
          <p className="mag-paragraph">
            The best and most direct support for <i>Jous</i> is simply using it with people you care about. If <i>Jous</i> isn’t your thing, maybe that introspective friend of yours might enjoy it. Other than that, you can share your honest feedback; even a small note about what worked (or didn’t) can help me understand better what you need and improve <i>Jous</i> in this way.
          </p>
          <p className="mag-paragraph">
            If you feel comfortable, you can introduce <i>Jous</i> to a wider circle by posting about it on social media or linking it in your website. Backlinks help <i>Jous</i> come up in Google Search. You can mention it to that friend who organizes group gatherings, has their own cafe or is the creator of a casual conversation podcast. If you need pictures for a social media post, contact me.
          </p>
          <p className="mag-paragraph">
            I’m grateful for all forms of support. From message telling me you had a memorable evening or you creating an artistic work inspired by <i>Jous</i> for <i>Jous</i>, every step contributes to making <i>Jous</i> the community it aspires to be.
          </p>
          {isMobile && (
            <div className="toc-mobile-button">
              <a href="#toc-block">Back to Contents</a>
            </div>
          )}


          <div className="ascii-art-item">
            {"\\(^-^)/"}
          </div>
        </article>

        <article
          id="work-with-jous"
          className="blog-article"
          ref={(el) => (articleRefs.current[4] = el)}
        >
          <h1 className="mag-title">
            Work with Jous
          </h1>
          <p className="mag-paragraph">
            <i>Jous</i> desperately needs a social media manager to reach more people. We aim to establish accounts on Instagram, Twitter, and TikTok. If you love Jous and have a passion for social media, maybe we can work together.
          </p>
          <p className="mag-paragraph">
          </p>
          <p className="mag-paragraph">
            As you have seen, <i>Jous</i> is quite plain. I would love to make it more visually pleasing with simple creative drawings. If you enjoy pouring your creativity into <i>Jous</i>, you are most welcome to contribute.
          </p>
          <p className="mag-paragraph">
            Please understand that <i>Jous</i> is a hobby and nonprofit project. I’m looking for partners in crime who will work on this with me, not for me.
          </p>
          <div className="empty-block"></div>
        </article>


        <article
          id="podcasters"
          className="blog-article"
          ref={(el) => (articleRefs.current[5] = el)}
        >
          <h1 className="mag-title">
            Jous for Podcasters
          </h1>
          <p className="mag-paragraph">
            I am on a mission to change the culture around conversations because what we have is not good enough. For that, I need to create enough tension in the system. The tension comes from establishing that we need more, we need to get more out of the time we spend socializing. The tension is that we are lonely. Once tension is established, we can move forward to solutions to show that better conversations are possible and within reach.
          </p>
          <p className="mag-paragraph">
            So I need you. You, who are hosting a casual conversation podcast,
            because you are already in the business of changing the culture around talking. <i>Jous</i> on its own is like a couple of seeds, it doesn't yet smell or look particularly good, hard to imagine what is it for.
            The conversations that come from it are the real flowers, only then does it become something remarkable.
            Many of my own friends ignored <i>Jous</i> for years, up until we used it to talk together.
            So my ask for you is to be the soil and water for these seeds, so the newcomers have something to see and to smell.

          </p>
          <p className="mag-paragraph">
            You, on the other hand, probably do not “need” <i>Jous</i>, but odds are you might benefit from it anyway, and this might end up in a win-win. Many questions in <i>Jous</i> can easily add juicy twists to your flow and make your episodes more engaging, urgent, and personal for the audience. You can handpick questions beforehand or bravely use random questions live.
          </p>
          <p className="mag-paragraph">
            If you decide to use <i>Jous</i>, then you can give a shout-out to it and include the link in the description. Alternatively, you can give an introduction to the whole category without mentioning <i>Jous</i> explicitly. The category includes all tools that help conversations flow into more meaningful directions, such as conversation cards, printed versions, and questions on blogs or apps. Basically, anything but small talk.
          </p>
          <p className="mag-paragraph">
            Reach out at <a href="mailto:info@jous.app">info@jous.app</a>.
          </p>
          {isMobile && (
            <div className="toc-mobile-button">
              <a href="#toc-block">Back to Contents</a>
            </div>
          )}
          <div className="empty-block"></div>
        </article>


        <article
          id="events"
          className="blog-article"
          ref={(el) => (articleRefs.current[6] = el)}
        >
          <h1 className="mag-title">
            Jous for Event Organisers
          </h1>
          <p className="mag-paragraph">
            Be it work gatherings, hiking meetups, or speed dating—a recurring pattern persists: the group resorts to polite introductions and safe, standard questions.
          </p>
          <p className="mag-paragraph">
            <i>Jous</i> can offer something fresh. But the caveat is you have to ask your audience to be daring and risk more than they are usually comfortable with. Thoughtful questions invite participants to share a sea of details that they ignore about themselves rather than just what they did last weekend. It’s not about prying; it’s about creating a space where curiosity can breathe.
          </p>
          <p className="mag-paragraph">
            If you coordinate events, consider weaving a short <i>Jous</i> segment into the schedule. It can be as simple as saying, “Pick a random question, and discuss it with someone new.” It’s a subtle shift, but one that might leave participants feeling genuinely more connected when they head home.
          </p>
          <div className="ascii-art-item">
            {"ヽ༼ ʘ̚ل͜ʘ̚༼◕_◕༽◉_◔ ༽ﾉ"}
          </div>
        </article>


        <article
          id="other-apps"
          className="blog-article"
          ref={(el) => (articleRefs.current[7] = el)}
        >
          <h1 className="mag-title">
            Jous for Other Apps
          </h1>
          <p className="mag-paragraph">
            So many apps out there aim to bring people together—dating, wellness, and even language learning. The conversations however can drain your energy instead of giving you some. Similar to <i>Jous</i>’s bot on Telegram, the <i>Jous</i> API could be integrated into these apps, to shuffle the conversations.
          </p>
          <p className="mag-paragraph">
            Imagine a language-learning app, where you don’t talk about your home country, but talk about your life in ways that you have never thought about before. Or a well-being app that gently tricks you into considering how you truly feel, with a fresh question, you never heard before.
          </p>
          <p className="mag-paragraph">
            If you develop or run an app, let us talk to see what collaboration might look like. Perhaps you’d tailor a set of questions for your community, or pick existing categories that align with your culture.
          </p>
          <p className="mag-paragraph">
            Reach out at <a href="mailto:info@jous.app">info@jous.app</a>.
          </p>
          {isMobile && (
            <div className="toc-mobile-button">
              <a href="#toc-block">Back to Contents</a>
            </div>
          )}
          <div className="empty-block"></div>
        </article>


        <article
          id="families"
          className="blog-article"
          ref={(el) => (articleRefs.current[8] = el)}
        >
          <h1 className="mag-title">
            Jous for Families
          </h1>
          <p className="mag-paragraph">
            If I could choose only one place where you try <i>Jous</i>, it is in your family. For you, this might be the spouse you think you already know everything about and expect no surprises there. Or it might mean the kid with whom you talk about food and school, but you have little clue of how much solid preferences they have developed, how seriously they take themselves and their feelings, and how much they are capable of reflecting. Or, family could mean your parents, in a lot of situations they are parties applying constraints to your life and have no remarkable individuality of their own.
          </p>
          <p className="mag-paragraph">
            We spend a lot of time with our families and a lot of that time is spent in loops. The loop is sometimes from routineness, and sometimes from seeing something from opposing views. To use <i>Jous</i> in your family means to put your routine down and put your guard down, go on a date with a family member, and only take your curiosity with you.
          </p>
          <div className="empty-block"></div>
        </article>

        <article
          id="small-talk-kills"
          className="blog-article"
          ref={(el) => (articleRefs.current[9] = el)}
        >
          <h1 className="mag-title">Small Talk Kills</h1>

          <p className="mag-paragraph">
            Do not get me wrong—I am not against <strong>small talk</strong>. Small talk precedes big talk in the normal course of human affairs. The need to get comfortable with one another before jumping into a serious conversation is a sign of sanity and health. It is when we are stuck in small talk after four years of working together and twenty years of living together that it becomes alarming. But no one is activating the sirens, although it might be time we did so.
          </p>

          <p className="mag-paragraph">
            <em>Loneliness is detrimental to our health</em>, and isolation is known to shorten lives. Repeating facts about yesterday’s news and showing off weekend plans, hour after hour, is not making us any less lonely. We have built such narrow expectations of what to ask, what to answer, what to feel, what to be happy and sad for, and what to think. We go on believing everyone else is as normal as they sound at work, and then we start judging ourselves for having thoughts and feelings outside these norms.
          </p>

          <p className="mag-paragraph">
            Constant small talk makes me <strong>numb</strong>, makes me not care about the person talking to me, and makes me be somewhere else while I am eating here. There is no intimacy here, and there is no magic in the now—it is totally forgettable.
          </p>
          {isMobile && (
            <div className="toc-mobile-button">
              <a href="#toc-block">Back to Contents</a>
            </div>
          )}
          <div className="ascii-art-item">
            {" ̿ ̿' ̿'\\̵͇̿̿\\з=(•̪●)=ε/̵͇̿̿/'̿''̿ ̿"}
          </div>

        </article>

        <article
          id="change-culture"
          className="blog-article"
          ref={(el) => (articleRefs.current[10] = el)}
        >
          <h1 className="mag-title">10- Change the Culture with Me</h1>

          <p className="mag-paragraph">
            Have you heard the story about <strong>Guy #3</strong>? If not, here is how it goes:
          </p>

          <section className="story-section">
            <p className="mag-story-paragraph">
              <strong>Guy #1</strong> is the crazy dude who starts dancing alone at the outdoor concert. He’s on the hillside, doing his thing.
            </p>
            <p className="mag-story-paragraph">
              <strong>Guy #2</strong> is brave and supportive. He joins in and starts dancing.
            </p>
            <p className="mag-story-paragraph">
              But it’s <strong>Guy #3</strong> that changes the dynamic. His presence makes it safe for people <strong>4, 5, 6, and 7</strong> to join in.
            </p>
            <p className="mag-story-paragraph">
              And now, sitting still is more socially risky than getting up.
            </p>
            <p className="mag-story-paragraph">
              So people <strong>8 through 20</strong> arrive.
            </p>
            <p className="mag-story-paragraph">
              And now it’s a movement.
            </p>
          </section>

          <p className="mag-paragraph">
            We spend a lot of time glorifying <strong>Guy #1</strong>. But the real work is to see time and to acknowledge that nothing happens all at once. My appeal to you is to be <strong>Guy #3</strong>.
          </p>

          <p className="mag-paragraph">
            <i>Jous</i> is not everyone’s cup of tea. But you might just be <strong>Guy #3</strong> if you
            had an extraordinary experience with it once, and if you felt a sudden powerful connection to someone by using it.
            If you would miss it if it were gone. If you felt the urge to tell the others.
          </p>


          <p className="mag-paragraph">
            If you felt spoken to, then you might appreciate the mission to make talk with friction the default type of conversation. <strong>Small talk</strong> is smooth, acceptable, and expected everywhere, but it is no longer serving our needs. And creating tomorrow by repeating yesterday is not a useful way forward.
          </p>

          <p className="mag-paragraph">
            Let’s take the weight of expectations off, one guy at a time, and reduce the resistance to conversations that demand showing our deeper selves. Let’s make it normal to use any tool, offline or online, to have better talks.
          </p>

          <div className="ascii-art-item">
            {"(╯°□°）╯︵ ┻━┻"}
          </div>

        </article>
      </div>
    </div>
  );
}
