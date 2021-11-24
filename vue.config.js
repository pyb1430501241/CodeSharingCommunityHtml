module.exports = {
    // 公共路径(必须有的)
    publicPath: "./",
    // 输出文件目录
    outputDir: "dist",
    // 静态资源存放的文件夹(相对于ouputDir)
    assetsDir: "assets",
    // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
    lintOnSave: false,
    // 我用的only，打包后小些
    // compiler: false,//有
    productionSourceMap: true, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
    // css相关配置(我暂时没用到)
    // css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    // sourceMap: false,
    // css预设器配置项
    // loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
    // },
    // webpack-dev-server 相关配置
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            },
            '/user': {
                target: 'http://localhost/user/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/user': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            },
            '/blob': {
                target: 'http://localhost/blob/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/blob': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            },
            '/file': {
                target: 'http:/localhost/file/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/file': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            },
            '/search': {
                target: 'http://121.199.27.93/search/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/search': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            },

        }
        //open: true,  // npm run serve后自动打开页面
        // host: '0.0.0.0',  // 匹配本机IP地址(默认是0.0.0.0)
        // port: 8080, // 开发服务器运行端口号
        // proxy: null,
        // 注：目前本项目暂时没有写后台接口，没有跨域问题，暂时不配置proxy
    },
}

