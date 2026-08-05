const money = value => `$${Number(value).toFixed(2)}`;

document.querySelectorAll('.buy-now').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image
    };
    localStorage.setItem('foreverPromiseProduct', JSON.stringify(product));
    window.location.href = 'orderpage.html';
  });
});

const orderForm = document.getElementById('orderForm');
if (orderForm) {
  const params = new URLSearchParams(window.location.search);
  const saved = JSON.parse(localStorage.getItem('foreverPromiseProduct') || 'null');
  const product = params.get('mode') === 'custom' || !saved
    ? { name: 'Custom Couple Ring Set', price: 149, image: 'gold-diamond.jpg' }
    : saved;

  const el = id => document.getElementById(id);
  el('selectedName').textContent = product.name;
  el('selectedPrice').textContent = `Base price: ${money(product.price)}`;
  el('selectedImage').src = product.image;
  el('selectedImage').alt = product.name;
  el('summaryProduct').textContent = product.name;

  const updateSummary = () => {
    const extras = ['metal', 'gemstone', 'diamond'].reduce((sum, id) => sum + Number(el(id).value), 0);
    const delivery = Number(el('delivery').value);
    const quantity = Math.max(1, Number(el('quantity').value) || 1);
    const total = (Number(product.price) + extras + delivery) * quantity;
    el('summaryBase').textContent = money(product.price);
    el('summaryCustom').textContent = money(extras);
    el('summaryDelivery').textContent = delivery ? money(delivery) : 'Free';
    el('summaryQuantity').textContent = quantity;
    el('summaryTotal').textContent = money(total);
  };

  ['metal', 'gemstone', 'diamond', 'delivery', 'quantity'].forEach(id => el(id).addEventListener('change', updateSummary));
  el('quantity').addEventListener('input', updateSummary);
  updateSummary();

  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }
    el('successMessage').hidden = false;
    el('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function showPaymentInfo() {

    const payment = document.querySelector('input[name="payment"]:checked').value;
    const info = document.getElementById("paymentInfo");

    info.style.display = "block";

    switch(payment){

        case "kpay":
            info.innerHTML = `
                <h3>KPay Payment</h3>
                <p><strong>Account Name:</strong> Forever Promise</p>
                <p><strong>Phone:</strong> 09-123456789</p>
                <p>Please transfer the amount and upload your payment screenshot after ordering.</p>
            `;
            break;

        case "wave":
            info.innerHTML = `
                <h3>Wave Pay</h3>
                <p><strong>Account Name:</strong> Forever Promise</p>
                <p><strong>Phone:</strong> 09-987654321</p>
                <p>Please transfer the payment and keep the transaction receipt.</p>
            `;
            break;

        case "aya":
            info.innerHTML = `
                <h3>AYA Pay</h3>
                <p><strong>Account Name:</strong> Forever Promise</p>
                <p><strong>Phone:</strong> 09-456789123</p>
                <p>Please complete your payment before confirming the order.</p>
            `;
            break;

        case "cod":
            info.innerHTML = `
                <h3>Cash on Delivery</h3>
                <p>You can pay in cash when your order arrives.</p>
                <p>Please make sure your shipping address and phone number are correct.</p>
            `;
            break;
    }
}
