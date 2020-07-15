// RollUp을 이용한 번들링 (블라우져가 이해하는 형태로 변경)
import resolve from "rollup-plugin-node-resolve";

export default {
  entry: "src/app.js",
  dest: "src/bundle.js",
  format: "umd",
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      module: true,
    }),
  ],
  moduleName: "app",
};
