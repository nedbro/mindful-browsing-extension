chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { text: "checkWebsite", url: tab.url },
        function (response) {
          if (response.allowedUrl) {
            chrome.storage.sync.set({ allowedUrl: response.allowedUrl }, () => {
              if (response.allowedUrl !== "") {
                chrome.tabs.update(tabId, { url: response.allowedUrl });
              }
            });
          }
        }
      );
    });
  }
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostContains: "." },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    },
  ]);
});
