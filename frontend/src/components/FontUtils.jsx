function isPersian(text) {
    return /[\u0600-\u06FF]/.test(text);
  }
  
  export const getFontForCards = (text) => isPersian(text) ? "Vazirmatn RD" : "Montserrat";
  