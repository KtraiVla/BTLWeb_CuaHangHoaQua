
document.addEventListener('DOMContentLoaded', () => {
  // Hàm để cập nhật số lượng trên biểu tượng giỏ hàng
  function updateCartNumber() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".header-center__number").textContent = totalItems;
  }

  // Hàm để hiển thị giỏ hàng
  function displayCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Xóa nội dung cũ
    cartItemsContainer.innerHTML = "";

    // Nếu giỏ hàng rỗng
    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p style="text-align: center; padding: 20px;">Giỏ hàng của bạn đang trống.</p>';
      totalPriceElement.textContent = "0đ";
      return;
    }

    // Nhóm các sản phẩm theo tên
    const groupedCart = [];
    cart.forEach(item => {
      const existingItem = groupedCart.find(groupedItem => groupedItem.name === item.name);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        groupedCart.push({ ...item });
      }
    });

    // Tạo HTML cho từng sản phẩm đã được nhóm
    groupedCart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="item-info">${item.name}</div>
        <div class="item-price">${item.price.toLocaleString("vi-VN")}đ</div>
        <div class="item-quantity">
          <button class="decrease" data-name="${item.name}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase" data-name="${item.name}">+</button>
        </div>
        <div class="item-total">${(item.price * item.quantity).toLocaleString("vi-VN")}đ</div>
        <div class="item-delete"><button class="delete" data-name="${item.name}">🗑️</button></div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    // Tính và hiển thị tổng tiền
    const total = groupedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.textContent = total.toLocaleString("vi-VN") + "đ";
  }

  // Hàm để cập nhật giỏ hàng trong localStorage và giao diện
  function updateCart(name, action) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tìm tất cả các sản phẩm có tên giống nhau
    const itemsToUpdate = cart.filter(item => item.name === name);
    const itemsToKeep = cart.filter(item => item.name !== name);

    if (!itemsToUpdate.length) return; // Nếu không tìm thấy sản phẩm, thoát

    // Tính tổng số lượng của các sản phẩm có cùng tên
    const totalQuantity = itemsToUpdate.reduce((sum, item) => sum + item.quantity, 0);
    const firstItem = itemsToUpdate[0]; // Lấy thông tin sản phẩm đầu tiên (image, price, v.v.)

    let updatedQuantity = totalQuantity;

    if (action === "increase") {
      updatedQuantity += 1;
    } else if (action === "decrease" && totalQuantity > 1) {
      updatedQuantity -= 1;
    } else if (action === "delete" || (action === "decrease" && totalQuantity <= 1)) {
      updatedQuantity = 0; // Xóa sản phẩm
    }

    // Cập nhật giỏ hàng: nếu số lượng > 0 thì thêm lại sản phẩm đã gộp, nếu không thì bỏ qua
    let updatedCart = [...itemsToKeep];
    if (updatedQuantity > 0) {
      updatedCart.push({ ...firstItem, quantity: updatedQuantity });
    }

    // Lưu lại giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Cập nhật giao diện và số lượng trên biểu tượng giỏ hàng
    displayCart();
    updateCartNumber();
  }

  // Khi trang tải, hiển thị giỏ hàng và cập nhật số lượng trên biểu tượng
  displayCart();
  updateCartNumber();

  // Xử lý các sự kiện click trên giỏ hàng
  document.getElementById("cartItems").addEventListener("click", (e) => {
    const name = e.target.getAttribute("data-name");

    if (e.target.classList.contains("increase")) {
      updateCart(name, "increase");
    } 
    else if (e.target.classList.contains("decrease")) {
      updateCart(name, "decrease");
    } 
    else if (e.target.classList.contains("delete")) {
      updateCart(name, "delete");
    }
  });

  // Chuyển hướng đến trang nhập thông tin giao hàng khi nhấn nút "Đặt hàng"
  document.querySelector('.checkout').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
      return;
    }
    window.location.href = './order_info.html';
  });
});