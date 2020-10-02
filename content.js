const body = document.getElementsByTagName("body")[0];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.text == "checkWebsite" && request.url) {
    chrome.storage.sync.get(["urlList", "allowedUrl"], async function (result) {
      if (result.urlList) {
        if (request.url === result.allowedUrl) {
          sendResponse({ allowedUrl: "" });
        } else {
          let includes = false;

          result.urlList.forEach((element) => {
            if (
              request.url.includes(element.url) &&
              request.url !== result.allowedUrl
            ) {
              console.log("benne van");
              includes = true;
            }
          });

          if (includes) {
            createRelaxPage();
            await sleep(30000);
            sendResponse({ allowedUrl: request.url });
          }
        }
      }
    });
    return true;
  }
});

const createRelaxPage = () => {
  body.innerHTML = "";
  const header = document.createElement("h1");
  header.textContent = "Take a deep breath";
  body.appendChild(header);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
