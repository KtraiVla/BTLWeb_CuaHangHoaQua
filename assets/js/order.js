
// Cập nhật số lượng trên biểu tượng giỏ hàng
function updateCartNumber() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector(".header-center__number").textContent = totalItems;
}

// Hiển thị nhập thông tin
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "flex"; // Hiển thị form nhập thông tin ngay khi vào trang

  // Cập nhật số lượng trên biểu tượng giỏ hàng
  updateCartNumber();

  // Nhấn nút "Quay lại" ==> quay lại trang giỏ hàng
  document.getElementById("cancelBtn").addEventListener("click", () => {
    window.location.href = "./giohang.html";
  });

  // Khi nhấn nút "Xác nhận thông tin" (sử dụng sự kiện submit của form)
  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn form gửi đi

    // Lấy giá trị từ form
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const province = document.getElementById("province").value;
    const district = document.getElementById("district").value;
    const village = document.getElementById("village").value;
    const agreement = document.getElementById("agreement").checked;

    // Kiểm tra các trường bắt buộc
    if (!fullName || !phone || !province || !district || !village) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*).");
      return;
    }

    // Kiểm tra người dùng có tick đồng ý không?
    if (!agreement) {
      alert("Vui lòng đồng ý với chính sách giao hàng.");
      return;
    }

    // Lấy thông tin giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Tạo thông tin đơn hàng
    const orderInfo = {
      fullName,
      email: document.getElementById("email").value.trim(),
      phone,
      address: `${document
        .getElementById("address")
        .value.trim()}, ${village}, ${district}, ${province}`,
      note: document.getElementById("note").value.trim(),
      cart,
      total,
    };

    // Chuỗi thông báo 
    let message = 'Đặt hàng thành công! \n\n'; 
    message += 'Thông tin đơn hàng: \n';
    message += `Họ và tên: ${orderInfo.fullName}\n`;
    message += `Email: ${orderInfo.email || 'Không có'}\n`;
    message += `Số điện thoại: ${orderInfo.phone}\n`;
    message += `Địa chỉ: ${orderInfo.address}\n`;
    message += `Ghi chú: ${orderInfo.note || 'Không có'}\n\n`;
    message += 'Sản phẩm:\n';
    orderInfo.cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')} VNĐ\n`;
    });
    message += `\nTổng tiền: ${orderInfo.total.toLocaleString('vi-VN')} VNĐ`;
    
    // Hiển thị thông báo đặt hàng thành công
    alert(message);

    // Xóa giỏ hàng
    localStorage.removeItem("cart");

    // Cập nhật số lượng
    updateCartNumber();

    // Chuyển hướng về trang sản phẩm
    window.location.href = "./product.html";
  });
});
