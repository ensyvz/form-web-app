const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
         {
          test: /\.css$/,
          use: [
            "style-loader","css-loader", "postcss-loader",
            ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
      template: "./formsite/frontend/templates/frontend/index.html",
      filename: "./index.html"
    }),
  ]
};