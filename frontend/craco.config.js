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
    // Add LESS support
    modules: {
      sass: {
        loaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Add a rule for handling .less files
      webpackConfig.module.rules.push({
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      });
      return webpackConfig;
    },
  },
};
