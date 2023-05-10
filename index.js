async function fakeNetworkLatency() {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

window.addEventListener("load", () => {

});
