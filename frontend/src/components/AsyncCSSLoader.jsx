import React, { useEffect } from 'react';
import loadCSS from 'loadcss';


function getMainCssFilename() {
     const links = document.querySelectorAll('link[rel="stylesheet"]');
     for (const link of links) {
       if (link.href.includes('/static/css/main.')) {
         return link.href.split('/').pop(); 
       }
     }
     return null; 
   }

   function AsyncCSSLoader() {
     useEffect(() => {
       const filename = getMainCssFilename();
       if (filename) {
        loadCSS('/static/css/' + filename, {
          onLoad: () => console.log(`${filename} loaded successfully`),
          onError: () => console.error(`Failed to load ${filename}`)
        });
               }
     }, []);

     return null;
   }

export default AsyncCSSLoader;