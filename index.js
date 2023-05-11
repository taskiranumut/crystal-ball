const fakeNetworkLatency = async () => {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
};

const getElement = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Element not found: ${selector}`);
    return null;
}
  return element;
};

const showElement = (el) => {
  if (!(el instanceof HTMLElement)) {
    throw "Invalid argument: showElement expects an HTMLElement";
  }
  el.classList.remove("hide");
};

const hideElement = (el) => {
  if (!(el instanceof HTMLElement)) {
    throw "Invalid argument: hideElement expects an HTMLElement";
  }
  el.classList.add("hide");
};


window.addEventListener("load", () => {

});
