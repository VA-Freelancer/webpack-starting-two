const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpack = require("webpack");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const optimization = () =>{
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd){
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }
    return config
}

console.log("IS DEV", isDev)

module.exports = {
    context: path.resolve(__dirname, 'src'),
    // указываем тип сборки
    mode: 'development',
    // подключем файлы
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    // создаем карту в режиме разработки
    devtool: isDev ? 'source-map' : false,
    // указываем динамичное имя js и путь до папки
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    // убираем у некоторых файлов расширение, добавляем пути
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    // оптимицачия кода, меняем только то что изменено
    optimization: optimization(),
    // запускаем и настраиваем сервер команда: npm start
    devServer: {
        // historyApiFallback: true,
        liveReload: true,
        // compress: true,
        // open: true,
        hot: isDev,
        port: 8080,
        contentBase: ENTRY_DIR,
        client: {

            logging: 'info',
            reconnect: true,
        },
        bonjour: {
            type: 'http',
            protocol: 'udp',
        },
        allowedHosts: ['.host.com', 'host2.com'],
        // watchContentBase: true
    },
    plugins: [
        //  собираем html
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        // собираем css
        new MiniCssExtractPlugin({
            linkType: "text/css",
            filename: filename("css"),
            experimentalUseImportModule: true,
        }),
        // копируем статические файлы
        new CopyPlugin(
            {
                patterns: [
                    {from: "assets/img/icons/*.svg", to: "assets/img/icons/"},
                    {from: "favicon.ico", to: "favicon.ico"},
                ],
            }),
        // минимизируем картинки
        new ImageMinimizerPlugin({
            severityError: "warning", // Ignore errors on corrupted images
            minimizerOptions: {
                plugins: ["gifsicle"],
            },
            // Disable `loader`
            loader: false,
        }),
        // очищаем папку
        new CleanWebpackPlugin(),
        // isDev ? new webpack.HotModuleReplacementPlugin() : false,
    ],
    module: {
        rules: [
            // добавляем тип css
            {
                test: /\.css$/i,
                use: [isDev ? "style-loader" : {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                    },
                },   "css-loader",
                ]
            },
            // добавляем тип картинок
            {
                test: /\.(png|jpe?g|svg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[hash][ext][query]'
                }
            },
            // добавляем тип шрифты
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            // добавляем тип xml
            {
                test: /\.xml$/i,
                use: ['xml-loader']
            },
            // добавляем тип xml
            {
                test: /\.csv$/i,
                use: ['csv-loader']
            },
            {
                test: /\.less$/i,
                use: [isDev ? "style-loader" : {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                    },
                },   "css-loader",
                    'less-loader'
                ]
            },
        ]
    }
}