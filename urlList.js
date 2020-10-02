const createListElement = (element) => {
  const listItem = document.createElement("li");
  listItem.textContent = element.url;
  listItem.innerHTML = `${element.url}`;
  listItem.id = element.id;

  const deleteButton = document.createElement("button");
  deleteButton.id = element.id;
  deleteButton.className = "deleteButton";
  deleteButton.textContent = "delete";
  deleteButton.onclick = () => deleteUrl(element.id);
  listItem.appendChild(deleteButton);
  document.getElementById("list").appendChild(listItem);
};

const syncList = () => {
  chrome.storage.sync.get(["urlList"], function (result) {
    if (result && result.urlList) {
      document.getElementById("list").innerHTML = "";
      result.urlList.forEach((element) => createListElement(element));
    }
  });
};

const deleteUrl = (id) => {
  chrome.storage.sync.get(["urlList"], function (result) {
    if (result && result.urlList) {
      const urlList = [...result.urlList];

      const index = urlList.findIndex((element) => element.id + "" === id + "");

      if (index > -1) {
        urlList.splice(index, 1);
      }

      urlList.forEach((element, index) => (element.id = index));

      chrome.storage.sync.set({ urlList: urlList }, function () {
        syncList();
      });
    } else {
      resetStorage();
    }
  });
};

syncList();

const resetStorage = () => {
  chrome.storage.sync.set({ urlList: [] });
  syncList();
};

const urlInput = document.getElementById("urlInput");
const inputForm = document.getElementById("urlForm");

inputForm.onsubmit = (event) => {
  event.preventDefault();
  chrome.storage.sync.get(["urlList"], function (result) {
    if (result && result.urlList) {
      const newUrl = urlInput.value;
      result.urlList.push({ url: newUrl, id: result.urlList.length });
      urlInput.value = "";
      chrome.storage.sync.set({ urlList: result.urlList }, function (result) {
        syncList();
      });
    } else {
      resetStorage();
    }
  });
};
