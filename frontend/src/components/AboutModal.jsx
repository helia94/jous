import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Modal, Button, Icon } from 'semantic-ui-react';
import { useLanguage } from './LanguageContext';
import ProductHuntBadge from './ProductHuntBadge';
import InstagramBadge from './InstagramBadge';
import QuizModal from "./QuizModal";

function AboutModal({ open, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    questions: 0,
    answers: 0,
    users: 0,
    oldestQuestionAge: 0,
  });

  useEffect(() => {
    fetch('/api/stat')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          questions: data.number_of_questions,
          answers: data.number_of_answers,
          users: data.number_of_users,
          oldestQuestionAge: data.age_of_oldest_question_days,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIcon
      centered={false}
      className="animated-modal"
    >
      <Modal.Header>About Jous</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <section style={{ padding: '1em', fontSize: '1.1em' }}>
            <h3 style={{ marginTop: '1.5em' }}>Welcome to Jous!</h3>
            <p style={{ lineHeight: '1.6' }}>
              <strong>Jous</strong> is a collection of thousands of personal questions to ask your friends and family. It is a fun excuse to share what we normally <strong>hesitate to mention</strong>.

              Each question is a subtle invitation to see one another anew and find relief in <strong>discovering the individuality in each other</strong>. It should not be storming the walls of someone’s privacy, but helping us knock gently on the door.
            </p>
            <p style={{ lineHeight: '1.6' }}>
              Do not get me wrong—I am not against small talk. The need to get comfortable before jumping into a serious conversation is a sign of sanity and health. It is <strong>when we are stuck in small talk </strong>after four years of working together and twenty years of living together that it becomes alarming.
            </p>
            <p style={{ lineHeight: '1.6' }}>
              Constant small talk makes me numb, makes me not care about the person talking to me, and makes me be somewhere else while I am eating here. <strong>There is no intimacy here, and there is no magic in the now—it is totally forgettable.</strong>
            </p>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <Button
                  color="black"
                  onClick={() => setIsModalOpen(true)}
                >
                  Take the Small Talk Personality Quiz
                </Button>
                <QuizModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
              </div>

            <h3 style={{ marginTop: '1.5em' }}>How to Use Jous</h3>
            <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
              <strong>Step One: </strong>Pick your audience, my favorite moments have been, at night while traveling with a group, as pillow talk with my partner, and at dinner with family.
            </p>
            <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
              <strong>Step Two: </strong>Be brave. It takes a bit of energy and friction to step outside the usual conversation. Suggest to your friends that you have a new idea to make conversations easy and juicy.
            </p>
            <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
              <strong>Step Three: </strong>Use the <strong>random page</strong> and then pick a language that fits. Read the question out loud; if it fits well with the group, each person can take turns adding their answer. If the question does not fit, skip it without any fuss. If you want to avoid some questions use the filters.
            </p>

            <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
              <Button
                color="yellow"
                onClick={() => {

                  ReactGA.event({
                    category: 'navigate',
                    action: 'button',
                    label: 'about-random',
                  });
                  (window.location = `/random?lang=${language}`)
                }}
              >
                Random Question
              </Button>
            </div>
            <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
              Or add the Telegram Bot to your groups and chat with your friends there.
            </p>
            <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
              <Button
                color="black"
                onClick={() => {

                  ReactGA.event({
                    category: 'navigate',
                    action: 'button',
                    label: 'about-telegram',
                  });
                  (window.location = 'https://t.me/jous_app_bot')
                }
                }
              >
                On Telegram
                <Icon name="telegram plane" style={{ marginLeft: '0.5em' }} />
              </Button>
            </div>

          </section>

          <p style={{ lineHeight: '1.6' }}>
          </p>
          <div style={{ display: 'flex', margin: '1.5em 0' }}>
          </div>

          <h3 style={{ marginTop: '1.5em' }}>Contribute Your Curiosity</h3>
          <p style={{ lineHeight: '1.6' }}>
            Why not add your own questions to the mix? Share your insights
            and watch as they spark discussions around the globe. or learn more about the project and the marginal revolution to replace small talk with juicy conversations on the blog.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
            <Button
              color="black"
              onClick={() => {

                ReactGA.event({
                  category: 'navigate',
                  action: 'button',
                  label: 'about-all-questions',
                });
                (window.location = `/home?lang=${language}`)
              }
              }
            >
              All Question
            </Button>

            <Button
              color="black"
              onClick={() => {

                ReactGA.event({
                  category: 'navigate',
                  action: 'button',
                  label: 'about-blog',
                });
                (window.location = `/blog?lang=${language}`)
              }
              }
            >
              Blog
            </Button>
          </div>

          <h3 style={{ marginTop: '1.5em' }}>Let's Stay Connected</h3>
          <p style={{ lineHeight: '1.6' }}>
            Got feedback, a question, or whatever? Feel free to reach out at{' '}
            <a
              href="mailto:info@jous.app"
              style={{ color: 'black', textDecoration: 'none' }}
            >
              <strong>info@jous.app</strong>
            </a>. I promise I'm friendly!
          </p>


          <section style={{
            padding: '1em',
            textAlign: 'center',
            marginTop: '2em',
          }}>
            <h3 style={{ marginBottom: '0.5em' }}>Jous is a slow growing community</h3>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
              In <strong style={{ color: "#fbbd08" }}>{stats.oldestQuestionAge}</strong> days, we've shared <strong >{stats.questions}</strong> questions and
              <strong> {stats.answers}</strong> answers,
              <br />
              from <strong>{stats.users}</strong> curious souls, be our <strong>#{stats.users + 1}</strong>.
            </p>
          </section>
        </Modal.Description>
      </Modal.Content>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <ProductHuntBadge />
        <InstagramBadge />
      </div>

      <br />
    </Modal>
  );
}

export default AboutModal;
