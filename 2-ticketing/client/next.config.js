module.exports = {
  webpackDEvMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
