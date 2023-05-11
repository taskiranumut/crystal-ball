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


window.addEventListener("load", () => {

});
