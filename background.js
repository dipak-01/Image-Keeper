chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveImage",
    title: "Keep Image",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "saveImage") {
    var imageUrl = info.srcUrl;

    saveImageToStorage(imageUrl);
  }
});

function saveImageToStorage(imageUrl) {
  chrome.storage.local.get("images", function (data) {
    var images = data.images || [];

    if (!images.includes(imageUrl)) {
      images.push(imageUrl);

      chrome.storage.local.set({ images: images }, function () {
        console.log("Image saved:", imageUrl);
      });
    } else {
      console.log("Image already exists:", imageUrl);
    }
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getImages") {
    chrome.storage.local.get("images", function (data) {
      var images = data.images || [];
      sendResponse(images);
    });

    return true;
  }
});
