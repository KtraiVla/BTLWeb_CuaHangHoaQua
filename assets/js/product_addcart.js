document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Cập nhật số lượng sản phẩm trong giỏ hàng trên header
  updateCartCount();

  // Hiển thị giỏ hàng trên trang giohang.html
  if (document.getElementById("cartItems")) {
    displayCart();
  }

  // Hàm thêm sản phẩm vào giỏ hàng
  window.addToCart = function (button) {
    const productItem = button.closest(".product-page__item");
    const name = productItem.querySelector(".product-page__name").textContent;
    const price = parseInt(
      productItem.querySelector(".price-new").textContent.replace(/\D/g, "")
    );
    const image = productItem.querySelector(".product-page__img").src;

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${name} đã được thêm vào giỏ hàng!`);
  };

  // Hàm xử lý khi nhấn "Mua ngay"
  window.buyNow = function (button) {
    const productItem = button.closest(".product-page__item");
    const name = productItem.querySelector(".product-page__name").textContent;
    const price = parseInt(
      productItem.querySelector(".price-new").textContent.replace(/\D/g, "")
    );
    const image = productItem.querySelector(".product-page__img").src;

    document.getElementById("modalImage").src = image;
    document.getElementById("modalName").textContent = name;
    document.getElementById("modalPrice").textContent = formatPrice(price);
    document.getElementById("modalQuantity").textContent = 1;

    document.getElementById("buyModal").style.display = "flex";
  };

  // Hàm thay đổi số lượng trong modal
  window.changeQuantity = function (change) {
    const quantityElement = document.getElementById("modalQuantity");
    let quantity = parseInt(quantityElement.textContent);
    if (quantity + change > 0) {
      quantity += change;
      quantityElement.textContent = quantity;
    }
  };

  // Hàm đóng modal buyModal
  window.closeModal = function () {
    document.getElementById("buyModal").style.display = "none";
  };

  // Hàm đặt hàng từ modal
  window.placeOrder = function () {
    const name = document.getElementById("modalName").textContent;
    const price = parseInt(
      document.getElementById("modalPrice").textContent.replace(/\D/g, "")
    );
    const image = document.getElementById("modalImage").src;
    const quantity = parseInt(document.getElementById("modalQuantity").textContent);

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, image, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Đóng modal buyModal
    closeModal();

    // Chuyển hướng đến trang orderinfo.html
    window.location.href = "./order_info.html";
  };

  // Hàm cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".header-center__number").textContent = totalItems;
  }

  // Hàm hiển thị giỏ hàng trên trang giohang.html
  function displayCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
      updateTotalPrice();
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="item-info">${item.name}</div>
          <div class="item-price">${formatPrice(item.price)}</div>
          <div class="item-quantity">
            <button class="decrease" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
          <div class="item-total">${formatPrice(
            item.price * item.quantity
          )}</div>
          <div class="item-delete">
            <button class="delete" onclick="removeFromCart(${index})">🗑️</button>
          </div>
        `;
      cartItemsContainer.appendChild(cartItem);
    });
    updateTotalPrice();
  }

  // Hàm định dạng giá tiền
  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
  }

  // Hàm cập nhật số lượng sản phẩm
  window.updateQuantity = function (index, change) {
    if (cart[index].quantity + change > 0) {
      cart[index].quantity += change;
    } else {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  };

  // Hàm cập nhật tổng tiền
  function updateTotalPrice() {
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    document.getElementById("totalPrice").textContent = formatPrice(totalPrice);
  };
});