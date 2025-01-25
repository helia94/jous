// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./src/**/*.jsx', './public/index.html'],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  });
  
  module.exports = {
    plugins: [
      require('autoprefixer'),
      purgecss,
    ],
  };
  