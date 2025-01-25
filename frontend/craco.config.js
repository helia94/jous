// frontend/craco.config.js
const purgecss = require('@fullhuman/postcss-purgecss').default({
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        purgecss,
      ],
    },
  },
};
