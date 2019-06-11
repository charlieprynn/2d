module.exports = {
  entry: "./src/ts/index.ts",
  output: {
      path: __dirname + '/build/',
      filename: "build.js"
  },
  resolve: {
      extensions: [".ts", ".js", ".json"]
  },
  module: {
      rules: [
          { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
      ]
  }
}
