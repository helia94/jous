export const isPersian =(text) => /[\u0600-\u06FF]/.test(text);
  
export const getFontClassForCards = (text) => isPersian(text) ? "vazirmatn" : "poiret-one";  