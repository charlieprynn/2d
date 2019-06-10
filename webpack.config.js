module.exports = {
  entry: "./src/index.ts",
  output: {
      path: '/build/',
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
