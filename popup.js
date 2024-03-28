document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage({ action: "getImages" }, function (images) {
    let imageGallery = document.getElementById("imageGallery");

    let image = images;

    image.forEach((imageUrl) => {
      let container = document.createElement("div");
      container.innerHTML = `
        <div class="oneImage">
        <div class="imagesOnly">
          <img src="${imageUrl}" alt="Image"></div>
          <div class="icons">
            <div>
              <button class="copy"><i class="fas fa-copy"></i></button>
            </div>
            <div>
              <button class="download"><i class="fas fa-download"></i></button>
            </div>
            <div>
              <button class="trash"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          </div>
        `;
      imageGallery.appendChild(container);

      container.querySelector(".copy").addEventListener("click", function () {
        console.log("Copy button clicked");

        navigator.clipboard.writeText(imageUrl).then(
          function () {
            console.log("Copying to clipboard was successful!");
          },
          function (err) {
            console.error("Could not copy text: ", err);
          }
        );
      });

      container
        .querySelector(".download")
        .addEventListener("click", function () {
          console.log("Download button clicked");
          let a = document.createElement("a");
          a.href = imageUrl;
          a.download = "download.jpg";
          document.body.appendChild(a);
          a.click();
        });
      container.querySelector(".trash").addEventListener("click", function () {
        console.log("Trash button clicked");
       
        chrome.storage.local.get("images", function (result) {
          if (chrome.runtime.lastError) {
            console.error(
              "Error getting images from local storage:",
              chrome.runtime.lastError
            );
          } else {
            let images = result.images;
             
            let index = images.indexOf(imageUrl);
            if (index !== -1) {
             
              images.splice(index, 1);
              chrome.storage.local.set({ images: images }, function () {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error setting images to local storage:",
                    chrome.runtime.lastError
                  );
                } else {
                  console.log("Image removed from local storage");
                  imageGallery.removeChild(container);
                }
              });
            }
          }
        });
      });
    });
  });
});
document.querySelector(".close").addEventListener("click", function () {
  window.close();
});
document.querySelector(".upload").addEventListener("click", function () {
  document.querySelector("#fileInput").click();
});
document.querySelector("#fileInput").addEventListener("change", function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onloadend = function () {
      var imageUrl = this.result;
      chrome.storage.local.get("images", function (result) {
        var images = result.images || [];
        images.push(imageUrl);
        chrome.storage.local.set({ images: images }, function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error setting images to local storage:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Image added to local storage");
            location.reload();
          }
        });
      });
    };
    reader.readAsDataURL(file);
  }
});
