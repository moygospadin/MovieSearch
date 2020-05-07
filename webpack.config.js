const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './movie/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(png|svg|jpg|gif|)$/, use: ['file-loader'] },
            { test: /\.(woff|woff2|eot|ttf|otf|ico)$/, use: ['file-loader'] },
            {
                test: /\.js/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ["@babel/preset-env"] }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './movie/index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
        }), new CleanWebpackPlugin()
    ]
};