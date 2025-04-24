// Hàm để cập nhật số lượng trên biểu tượng giỏ hàng
function updateCartNumber() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Chỉ đếm số loại sản phẩm (số phần tử trong mảng cart), không tính quantity
  const totalItems = cart.length;
  document.querySelector(".header-center__number").textContent = totalItems;
}
// Biến lưu trữ số lượng trong modal
let modalQuantity = 1;

// Hàm mở modal và điền thông tin sản phẩm
function openModal(button) {
  const productItem =
    button.closest(".product-detail") || button.closest(".best-pro__item");
  const name =
    productItem.querySelector(".product-detail__name")?.textContent ||
    productItem.querySelector(".best-pro__name").textContent;
  const price = parseInt(
    (
      productItem.querySelector(".price-new") ||
      productItem.querySelector(".price__new")
    ).textContent.replace(/\D/g, "")
  );
  const image =
    productItem.querySelector(".pro-detail__right-img")?.src ||
    productItem.querySelector(".best-pro__img").src;

  // Điền thông tin vào modal
  document.getElementById("modalImage").src = image;
  document.getElementById("modalName").textContent = name;
  document.getElementById("modalPrice").textContent =
    price.toLocaleString("vi-VN") + "đ";
  modalQuantity = 1; // Reset số lượng về 1
  document.getElementById("modalQuantity").textContent = modalQuantity;

  // Hiển thị modal
  document.getElementById("buyModal").style.display = "flex";
}

// Hàm đóng modal
function closeModal() {
  document.getElementById("buyModal").style.display = "none";
}

// Hàm thay đổi số lượng trong modal
function changeQuantity(change) {
  modalQuantity += change;
  if (modalQuantity < 1) modalQuantity = 1; // Không cho phép số lượng nhỏ hơn 1
  document.getElementById("modalQuantity").textContent = modalQuantity;
}

// Hàm xử lý khi nhấn "Đặt hàng"
function placeOrder() {
  const product = {
    name: document.getElementById("modalName").textContent,
    price: parseInt(
      document.getElementById("modalPrice").textContent.replace(/\D/g, "")
    ),
    image: document.getElementById("modalImage").src,
    quantity: modalQuantity,
  };

  // Lấy giỏ hàng từ localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingProductIndex = cart.findIndex(
    (item) => item.name === product.name
  );
  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += product.quantity;
  } else {
    cart.push(product);
  }

  // Lưu giỏ hàng trở lại localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Cập nhật số lượng trên biểu tượng giỏ hàng
  updateCartNumber();

  // Đóng modal
  closeModal();

  // Chuyển hướng đến trang nhập thông tin đặt hàng
  window.location.href = "./order_info.html";
}

// Khi trang tải, cập nhật số lượng giỏ hàng và thêm sự kiện
document.addEventListener("DOMContentLoaded", () => {
  updateCartNumber();

  // Xử lý sự kiện nhấn nút "Thêm vào giỏ hàng"
  document.querySelector(".add").addEventListener("click", () => {
    const product = {
      name: document.querySelector(".product-detail__name").textContent,
      price: parseInt(
        document.querySelector(".price-new").textContent.replace(/\D/g, "")
      ),
      image: document.querySelector(".pro-detail__right-img").src,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.name === product.name
    );
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartNumber();
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  });

  // Xử lý sự kiện nhấn nút "Mua ngay" (trong chi tiết sản phẩm và sản phẩm liên quan)
  document.querySelectorAll(".buy").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  // Xử lý sự kiện nhấn nút "Thêm vào giỏ hàng" trong phần sản phẩm liên quan
  document.querySelectorAll(".btn-add").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productItem = e.target.closest(".best-pro__item");
      const product = {
        name: productItem.querySelector(".best-pro__name").textContent,
        price: parseInt(
          productItem
            .querySelector(".price__new")
            .textContent.replace(/\D/g, "")
        ),
        image: productItem.querySelector(".best-pro__img").src,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = cart.findIndex(
        (item) => item.name === product.name
      );
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartNumber();
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    });
  });
});
