const path = require('path');
const useProxy = require('./plugins/use-proxy');
const useAlias = require('./plugins/use-alias');
const useResourcesLoader = require("./plugins/use-resources-loader");
const useSvgSpriteLoader = require("./plugins/use-svg-sprite-loader");

const production = process.env.NODE_ENV === 'production';

module.exports = {
  publicPath: production ? "/static/mt_plugin/" : "/",
  outputDir: "../../static/mt_plugin/",
  indexPath: production ? '../../Views/MTSService/Index.cshtml' : 'index.html',
  configureWebpack: config => {
	useProxy(config);
	useResourcesLoader(config);
  },
  chainWebpack: config => {
	useSvgSpriteLoader(config);
	useAlias(config);
  }
};
