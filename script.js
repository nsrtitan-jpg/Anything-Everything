// ---- Firebase init ----
const firebaseConfig = {
  apiKey: "AIzaSyAHmo_DOmg7Zbh-Qq1UdJ10eMRWAe8hLgc",
  authDomain: "urban-market-e9430.firebaseapp.com",
  projectId: "urban-market-e9430",
  storageBucket: "urban-market-e9430.firebasestorage.app",
  messagingSenderId: "457012355959",
  appId: "1:457012355959:web:bfdfeb310b76fbf322b772",
  measurementId: "G-11F69ZG64Q"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ---- Admin Emails ----
const ADMIN_EMAILS = [
  "nsrtitan@gmail.com",
  "davidmichaelcox@gmail.com"
];

// ---- DOM refs ----
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const signupEmailInput = document.getElementById("signup-email");
const signupPasswordInput = document.getElementById("signup-password");

const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");

const authMessage = document.getElementById("auth-message");
const adminMessage = document.getElementById("admin-message");
const marketMessage = document.getElementById("market-message");
const cartMessage = document.getElementById("cart-message");

const userEmailSpan = document.getElementById("user-email");

const adminSection = document.getElementById("admin-section");
const authSection = document.getElementById("auth-section");

const productTitleInput = document.getElementById("product-title");
const productDescriptionInput = document.getElementById("product-description");
const productPriceInput = document.getElementById("product-price");
const productImageInput = document.getElementById("product-image");
const addProductBtn = document.getElementById("add-product-btn");

const productsGrid = document.getElementById("products-grid");

const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartSection = document.getElementById("cart-section");
const cartItemsDiv = document.getElementById("cart-items");
const cartCountSpan = document.getElementById("cart-count");
const cartTotalSpan = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// ---- State ----
let currentUser = null;
let isAdmin = false;
let cart = [];

// ---- Helpers ----
function setMessage(el, msg, type = "") {
  el.textContent = msg;
  el.className = "message " + type;
}

function updateAuthUI(user) {
  if (user) {
    userEmailSpan.textContent = user.email;
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    authSection.classList.add("hidden");
  } else {
    userEmailSpan.textContent = "";
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
}

function updateAdminUI() {
  adminSection.classList.toggle("hidden", !isAdmin);
}

// ---- Render products ----
function renderProducts(products) {
  productsGrid.innerHTML = "";

  if (!products.length) {
    setMessage(marketMessage, "No products yet.");
    return;
  }

  setMessage(marketMessage, "");

  products.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "product-card";

    if (data.imageUrl) {
      const img = document.createElement("img");
      img.src = data.imageUrl;
      img.className = "product-image";
      card.appendChild(img);
    }

    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = data.title;

    const desc = document.createElement("div");
    desc.className = "product-description";
    desc.textContent = data.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = `$${Number(data.price).toFixed(2)}`;

    const footer = document.createElement("div");
    footer.className = "product-footer";

    const addBtn = document.createElement("button");
    addBtn.className = "btn secondary";
    addBtn.textContent = "Add to Cart";
    addBtn.onclick = () => addToCart({
      id: doc.id,
      title: data.title,
      price: Number(data.price)
    });

    footer.appendChild(price);
    footer.appendChild(addBtn);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(footer);

    productsGrid.appendChild(card);
  });
}

// ---- Cart ----
function addToCart(item) {
  cart.push(item);
  updateCartUI();
}

function updateCartUI() {
  cartItemsDiv.innerHTML = "";

  if (!cart.length) {
    cartItemsDiv.textContent = "Your cart is empty.";
    cartCountSpan.textContent = "0";
    cartTotalSpan.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const row = document.createElement("div");
    row.className = "cart-item";

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = item.title;

    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.textContent = `$${item.price.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn danger";
    removeBtn.textContent = "X";
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCartUI();
    };

    row.appendChild(title);
    row.appendChild(price);
    row.appendChild(removeBtn);

    cartItemsDiv.appendChild(row);
  });

  cartCountSpan.textContent = cart.length;
  cartTotalSpan.textContent = total.toFixed(2);
}

// ---- Auth actions ----
loginSubmit.onclick = async () => {
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();

  try {
    await auth.signInWithEmailAndPassword(email, password);
    setMessage(authMessage, "Logged in.", "success");
  } catch (err) {
    setMessage(authMessage, err.message, "error");
  }
};

signupSubmit.onclick = async () => {
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value.trim();

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    setMessage(authMessage, "Account created.", "success");
  } catch (err) {
    setMessage(authMessage, err.message, "error");
  }
};

logoutBtn.onclick = () => auth.signOut();

// ---- Admin: Add product ----
addProductBtn.onclick = async () => {
  if (!isAdmin) {
    setMessage(adminMessage, "Only admins can add products.", "error");
    return;
  }

  const title = productTitleInput.value.trim();
  const description = productDescriptionInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  const imageUrl = productImageInput.value.trim();

  if (!title || isNaN(price)) {
    setMessage(adminMessage, "Title and valid price required.", "error");
    return;
  }

  try {
    await db.collection("products").add({
      title,
      description,
      price,
      imageUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    setMessage(adminMessage, "Product added.", "success");

    productTitleInput.value = "";
    productDescriptionInput.value = "";
    productPriceInput.value = "";
    productImageInput.value = "";
  } catch (err) {
    setMessage(adminMessage, err.message, "error");
  }
};

// ---- Cart toggle ----
cartToggleBtn.onclick = () => {
  cartSection.classList.toggle("hidden");
};

// ---- Checkout ----
checkoutBtn.onclick = () => {
  if (!cart.length) {
    setMessage(cartMessage, "Cart is empty.", "error");
    return;
  }
  setMessage(cartMessage, "Checkout is demo-only.", "success");
};

// ---- Auth listener ----
auth.onAuthStateChanged((user) => {
  currentUser = user;
  isAdmin = user && ADMIN_EMAILS.includes(user.email);
  updateAuthUI(user);
  updateAdminUI();
});

// ---- Firestore listener ----
db.collection("products")
  .orderBy("createdAt", "desc")
  .onSnapshot((snapshot) => {
    renderProducts(snapshot.docs);
  });
