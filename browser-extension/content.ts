export {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const info = message.info;
  const provider = message.provider;
  window.dispatchEvent(
    new CustomEvent("eip6963:announceProvider", {
      detail: Object.freeze({ info, provider }),
    })
  );
});