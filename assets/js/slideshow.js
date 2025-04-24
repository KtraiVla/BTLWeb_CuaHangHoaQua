var n = 3;
var i = 1;
// hàm next hình ảnh;
function next() {
  if (i == n) {
    i = 1;
  } else {
    i++;
  }
  document
    .getElementsByClassName("banner-slide")[0]
    .setAttribute("src", "./assets/img/slide" + i + ".jpg");
}

// hàm back hình ảnh;
function back() {
  if (i == 1) {
    i = n;
  } else {
    i--;
  }
  document
    .getElementsByClassName("banner-slide")[0]
    .setAttribute("src", "./assets/img/slide" + i + ".jpg");
}

// Hàm tự động chuyển hình ảnh trong 3s;
function autoPlay() {
  setInterval(next, 3000);
}

// Gọi hàm autoPlay()
autoPlay();


// 
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".banner-title").classList.add("loaded");
});