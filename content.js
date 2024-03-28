window.onload = function () {
  let backgroundPort = chrome.runtime.connect({ name: "contentScript" });

  backgroundPort.onMessage.addListener(function (message) {
    if (message.action === "fetchImage") {
      fetchImage(message.imageUrl);
    }
  });
};
 
function fetchImage(imageUrl) {
  console.log("inside fetchImage");
  console.log(imageUrl);
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const imageDataUrl = reader.result;
       
        chrome.storage.local.set({ savedImage: imageDataUrl }, function () {
          console.log("Image saved to local storage:", imageDataUrl);
           
          console.log(imageDataUrl);
          const imgView = document.getElementById("imageViewer");
          const imageElement = document.createElement("img");
          imageElement.src = imageDataUrl;
          imgView.appendChild(imageElement);
        });
      };
      reader.readAsDataURL(blob);
    });
}
