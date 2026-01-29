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
// 🔐 ADMIN PASSWORD (CHANGE THIS)
const ADMIN_PASSWORD = "neonvault123";

let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = [];
let total = 0;

const productsContainer = document.getElementById("products");

// ---------- ADMIN ----------
function openAdmin() {
  const pass = prompt("Producer password:");
  if (pass === ADMIN_PASSWORD) {
    document.getElementById("adminPanel").classList.remove("hidden");
  } else {
    alert("Access denied");
  }
}

function logout() {
  document.getElementById("adminPanel").classList.add("hidden");
}

function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;

  if (!name || !price || !image) return alert("Fill all fields");

  products.push({ name, price, image });
  localStorage.setItem("products", JSON.stringify(products));

  renderProducts();
}

// ---------- STORE ----------
function renderProducts() {
  productsContainer.innerHTML = "";

  products.forEach((product, i) => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}">
      <h2>${product.name}</h2>
      <p>$${product.price}</p>
      <button onclick="addToCart('${product.name}', ${product.price})">
        Add to Cart
      </button>
    `;

    productsContainer.appendChild(div);
  });
}

function addToCart(item, price) {
  cart.push({ item, price });
  total += price;
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.item} - $${p.price}`;
    cartItems.appendChild(li);
  });

  document.getElementById("total").textContent = `Total: $${total}`;
}

function checkout() {
  alert("Checkout coming soon");
}

renderProducts();
