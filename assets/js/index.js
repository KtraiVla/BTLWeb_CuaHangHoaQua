document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo giỏ hàng từ localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Cập nhật số lượng sản phẩm trong giỏ hàng trên header
  updateCartCount();

  // Hiển thị thông báo
  const authMessage = document.getElementById("authMessage");

  function showMessage(message, isError = true) {
    authMessage.textContent = message;
    authMessage.classList.toggle("show", true);
    authMessage.style.color = isError ? "#ff0000" : "#28a745";
    setTimeout(() => {
      authMessage.classList.toggle("show", false);
    }, 3000);
  }

  // Chuyển đổi giữa các tab
  window.showTab = function (tabName) {
    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active");
    });
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.getElementById(tabName).classList.add("active");
    document
      .querySelector(`.tab[onclick="showTab('${tabName}')"]`)
      .classList.add("active");
    authMessage.classList.toggle("show", false);
  };

  // Kiểm tra định dạng email và số điện thoại
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,11}$/;

  // Xử lý form đăng nhập
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!emailRegex.test(email)) {
      showMessage("Vui lòng nhập email hợp lệ!");
      return;
    }

    if (password.length < 6) {
      showMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showMessage("Email hoặc mật khẩu không đúng!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    showMessage("Đăng nhập thành công!", false);
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
  });

  // Xử lý form đăng ký
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!firstName || !lastName) {
      showMessage("Vui lòng nhập đầy đủ họ và tên!");
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage("Vui lòng nhập email hợp lệ!");
      return;
    }

    if (!phoneRegex.test(phone)) {
      showMessage("Vui lòng nhập số điện thoại hợp lệ (10-11 số)!");
      return;
    }

    if (password.length < 6) {
      showMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === email)) {
      showMessage("Email đã được đăng ký!");
      return;
    }

    const newUser = { firstName, lastName, email, phone, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    showMessage("Đăng ký thành công!", false);
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
  });

  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".header-center__number").textContent = totalItems;
  }
});
