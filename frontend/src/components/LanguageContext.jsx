import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from './analytics';
import { Modal } from './ui';
import './LanguageContext.css';

export const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const availableLanguages = [
  { display_name: 'Original', backend_code: null, frontend_code: 'original' },
  { display_name: 'Enhanced English', backend_code: 'en', frontend_code: 'en' },
  { display_name: 'German', backend_code: 'de', frontend_code: 'de' },
  { display_name: 'Persian', backend_code: 'fa', frontend_code: 'fa' },
  { display_name: 'Spanish', backend_code: 'es', frontend_code: 'es' },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check URL param first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) {
      localStorage.setItem('lang', urlLang);
      return urlLang;
    }
    // Fallback to localStorage or default
    return localStorage.getItem('lang') || 'original';
  });

  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);

  const openLanguageModal = () => setLanguageModalOpen(true);
  const closeLanguageModal = () => setLanguageModalOpen(false);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('lang', newLang);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);

    trackEvent({
      category: 'settings',
      action: 'language',
      label: newLang, 
    });

    window.location.reload();
  };


  // Keep localStorage in sync if user changes language from the modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') || 'original';
    if (urlLang !== language) {
      setLanguage(urlLang);
      localStorage.setItem('lang', urlLang);
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        availableLanguages,
        openLanguageModal,
      }}
    >
      {children}

      <Modal
        open={isLanguageModalOpen}
        onClose={closeLanguageModal}
        size="tiny"
        closeIcon
        className="lang-modal"
      >
        <Modal.Header>
          <h2 id="language-modal-title" className="lang-modal-title">Select Language</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="lang-modal-container">
            <button
              className={`lang-button long ${language === 'original' ? 'active-lang' : ''}`}
              onClick={() => {
                changeLanguage('original');
                closeLanguageModal();
              }}
            >
              Original
            </button>
            <div className="other-langs-grid">
              <button
                className={`lang-button fat ${language === 'en' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('en');
                  closeLanguageModal();
                }}
              >
                Enhanced English
              </button>
              <button
                className={`lang-button fat ${language === 'de' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('de');
                  closeLanguageModal();
                }}
              >
                German
              </button>
              <button
                className={`lang-button fat ${language === 'fa' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('fa');
                  closeLanguageModal();
                }}
              >
                Persian
              </button>
              <button
                className={`lang-button fat ${language === 'es' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('es');
                  closeLanguageModal();
                }}
              >
                Spanish
              </button>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions className="lang-modal-actions">
          <button className="yellow-button" onClick={closeLanguageModal}>
            Close
          </button>
        </Modal.Actions>
      </Modal>
    </LanguageContext.Provider>
  );
};
