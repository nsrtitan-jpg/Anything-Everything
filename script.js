let cart = [];
let total = 0;

function addToCart(item, price) {
  cart.push({ item, price });
  total += price;
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach(product => {
    const li = document.createElement("li");
    li.textContent = `${product.item} - $${product.price}`;
    cartItems.appendChild(li);
  });

  document.getElementById("total").textContent = `Total: $${total}`;
}

function checkout() {
  alert("Checkout complete! (Demo only — no real payment yet)");
  cart = [];
  total = 0;
  renderCart();
}
