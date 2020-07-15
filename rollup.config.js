// RollUp을 이용한 번들링 (블라우져가 이해하는 형태로 변경)
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "./src/app.js",
  output: {
    file: "./src/bundle.js",
    format: "umd",
    name: "app",
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      module: true,
    }),
  ],
};
