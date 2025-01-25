// frontend/postcss.config.js
module.exports = {
    plugins: {
      autoprefixer: {},
      '@fullhuman/postcss-purgecss': {
        content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      },
    },
  };
  