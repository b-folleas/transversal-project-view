module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              data: "$primary: #0d6efd;$secondary: #6c757d;"
            }
          }
        ]
      }
    ]
  }
};
