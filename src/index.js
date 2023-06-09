import "flatpickr";
import "flatpickr/dist/themes/dark.css";
import "choices.js/public/assets/styles/choices.css";
import "./assets/css/styles.css";
import "animate.css";
import initApp from "./app";

const root = document.getElementById("app-root");
window.addEventListener("load", () => {
  initApp(root);
});
