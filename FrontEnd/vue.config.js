const path = require('path');

if (process.env.NODE_ENV === "development") {
  process.env.TAILWIND_MODE = "watch";
}

const {
  UniAppWeappTailwindcssWebpackPluginV4,
} = require("weapp-tailwindcss-webpack-plugin");

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const config = {
  //....
  configureWebpack: {
    plugins: [new UniAppWeappTailwindcssWebpackPluginV4()],
  },
  //....
};

module.exports = {
    devServer: {
      headers: {
        // 如果需要用到ffmpeg合并视频，需要将COEP和COOP打开，来确保ShareArrayBuffer能够正常使用
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      }
    },
	configureWebpack: {
	resolve: {
	  alias: {
		'@ffmpeg/ffmpeg': path.resolve(__dirname, 'node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js'),
	  },
	},
	},
};