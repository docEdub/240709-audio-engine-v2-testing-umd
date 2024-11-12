const fs = require("fs");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/test-tools/evaluatedAudioTestUtils.ts"),
    output: {
        path: path.resolve(appDirectory, "dist"),
        filename: "js/evaluatedAudioTestUtils.js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        headers: {
            // These are needed to get SharedArrayBuffer working, which is required for Whisper speech-to-text.
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
        },
        host: "0.0.0.0",
        hot: false,
        port: 443,
        server: "https",
        static: path.resolve(appDirectory, "public"),
    },
    devtool: "inline-source-map",
    externals: {
        babylonjs: "BABYLON",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "node_modules/babylon*/babylon*.js", to: "js/[name].js" },
                { from: "node_modules/babylon*/babylon*.map", to: "js/[name].map" },
                path.resolve("public/favicon.png"),
            ],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html"),
        }),
        new CleanWebpackPlugin(),
    ],
    mode: "development",
};
