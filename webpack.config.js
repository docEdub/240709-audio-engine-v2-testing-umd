const fs = require("fs");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: {
        evaluatedAudioTestUtils: path.resolve(appDirectory, "src/test-tools/evaluatedAudioTestUtils.ts"),
        debug: path.resolve(appDirectory, "src/debug.ts"),
    },
    output: {
        path: path.resolve(appDirectory, "dist"),
        filename: "js/[name].js",
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
            patterns: [path.resolve("public/favicon.png")],
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: path.resolve(appDirectory, "public/index.html"),
        }),
        new HtmlWebpackPlugin({
            inject: false,
            filename: "debug/index.html",
            template: path.resolve(appDirectory, "public/debug/index.html"),
        }),
        new CleanWebpackPlugin(),
    ],
    mode: "development",
};
