module.exports = {
  // 暂时关闭eslint
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : "/",
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV === 'development',
  devServer: {
    port: 8080,
    open: true,
    disableHostCheck: true,
    proxy: {
      '/apis': {
        // target: 'http://192.168.120.150:40000',
        // target: "https://devnet2scan.platon.network",
        target: 'http://192.168.9.222:32868',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/apis': '/browser-server'
        }
      }
    }
  },
  transpileDependencies: [ 'vue-particles' ]
}
