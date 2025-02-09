import React, { useState, useEffect } from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import { useLanguage } from './LanguageContext';
import ProductHuntBadge from './ProductHuntBadge';
import InstagramBadge from './InstagramBadge';

function AboutModal({ open, onClose }) {
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
          <section style={{ padding: '1em' }}>
            <h3 style={{ marginTop: '1.5em' }}>Welcome to Jous!</h3>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
              Have you ever found yourself stuck in yet another conversation
              about the weather, desperately seeking an exit strategy? Fear
              not; <strong>Jous</strong> is here to elevate your dialogues
              from the mundane to the meaningful.
            </p>

            <h3 style={{ marginTop: '1.5em' }}>Transform Small Talk into Genuine Interactions</h3>
            <p style={{ lineHeight: '1.6' }}>
              Jous isn't just an app; it's your invitation to deeper, more engaging
              discussions. Consider it a gentle nudge away from awkward silences
              and toward discussions that matter. No sign-ups or passwords needed.
              Just jump in. As of 2025, the questions are also available in Persian,
              German, Spanish, and AI enhanced English.
            </p>

            <h3 style={{ marginTop: '1.5em' }}>Choose Your Path</h3>
            <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
              <strong>All Questions</strong>: Scroll and Explore through the
              collection of queries.
              <br />
              <strong>Random Question</strong>: Let chance guide you to your next
              topic.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
              <Button
                color="yellow"
                onClick={() => (window.location = `/home?lang=${language}`)}
                style={{ marginRight: '1em' }}
              >
                All Questions
              </Button>
              <Button
                color="yellow"
                onClick={() => (window.location = `/random?lang=${language}`)}
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
                onClick={() => (window.location = 'https://t.me/jous_app_bot')}
              >
                On Telegram
                <Icon name="telegram plane" style={{ marginLeft: '0.5em' }} />
              </Button>
            </div>

            <h3 style={{ marginTop: '1.5em' }}>Contribute Your Curiosity</h3>
            <p style={{ lineHeight: '1.6' }}>
              Why not add your own questions to the mix? Share your insights
              and watch as they spark discussions around the globe.
            </p>

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
          </section>

          <section style={{ padding: '1em', 
            textAlign: 'center', 
            marginTop: '2em' , }}>
            <h3 style={{ marginBottom: '0.5em' }}>Jous is a slow growing community</h3>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6'  }}>
              In <strong style={{ color:"#fbbd08"}}>{stats.oldestQuestionAge}</strong> days, we've shared <strong >{stats.questions}</strong> questions and
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
