import React, { createContext, useContext, useState, useEffect } from 'react';
import { Modal, Button } from 'semantic-ui-react';
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

      <Modal open={isLanguageModalOpen} onClose={closeLanguageModal}>
        <Modal.Header>Select Language</Modal.Header>
        <Modal.Content>
          <div className="lang-modal-container">
            <Button
              className={`lang-button long ${language === 'original' ? 'active-lang' : ''}`}
              onClick={() => {
                changeLanguage('original');
                closeLanguageModal();
              }}
            >
              Original
            </Button>
            <div className="other-langs-grid">
              <Button
                className={`lang-button fat ${language === 'en' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('en');
                  closeLanguageModal();
                }}
              >
                Enhanced English
              </Button>
              <Button
                className={`lang-button fat ${language === 'de' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('de');
                  closeLanguageModal();
                }}
              >
                German
              </Button>
              <Button
                className={`lang-button fat ${language === 'fa' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('fa');
                  closeLanguageModal();
                }}
              >
                Persian
              </Button>
              <Button
                className={`lang-button fat ${language === 'es' ? 'active-lang' : ''}`}
                onClick={() => {
                  changeLanguage('es');
                  closeLanguageModal();
                }}
              >
                Spanish
              </Button>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button className="yellow-button" onClick={closeLanguageModal}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </LanguageContext.Provider>
  );
};
