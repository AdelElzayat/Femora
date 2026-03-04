document.addEventListener("DOMContentLoaded", function () {
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  }
  function requireAuth() {
    if (!getCurrentUser()) {
      window.location = "login-form.html";
      return false;
    }
    return true;
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  }
  function writeCart(c) {
    localStorage.setItem("cart", JSON.stringify(c));
  }
  let cart = readCart();
  function updateCartCount() {
    const btn = navList.querySelector(".cart-count");
    if (btn) btn.textContent = cart.reduce((s, i) => s + i.qty, 0);
  }

  function readFavs() {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  }
  function writeFavs(f) {
    localStorage.setItem("favorites", JSON.stringify(f));
  }
  let favorites = readFavs();

  function toggleCartDropdown() {
    if (!requireAuth()) return;
    let panel = document.querySelector(".cart-dropdown");
    if (panel) {
      panel.classList.toggle("open");
      return;
    }
    panel = document.createElement("div");
    panel.className = "cart-dropdown";
    panel.style.position = "absolute";
    panel.style.top = "100%";
    panel.style.right = "0";
    panel.style.width = "250px";
    panel.style.background = "#fff";
    panel.style.border = "1px solid #ccc";
    panel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    panel.style.zIndex = "100";
    panel.style.padding = "10px";

    panel.classList.add("open");
    navList.appendChild(panel);

    panel.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    renderCartDropdown();
  }

  document.addEventListener("click", function (e) {
    const panel = document.querySelector(".cart-dropdown");
    const cartBtn = navList.querySelector(".cart-btn");
    if (panel && panel.classList.contains("open")) {
      if (!panel.contains(e.target) && !cartBtn.contains(e.target)) {
        panel.classList.remove("open");
      }
    }
  });

  function renderCartDropdown() {
    const panel = document.querySelector(".cart-dropdown");
    if (!panel) return;
    panel.innerHTML = "";
    if (cart.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "Cart is empty";
      panel.appendChild(empty);
    } else {
      cart.forEach((item) => {
        const row = document.createElement("div");
        row.style.marginBottom = "6px";

        const info = document.createElement("div");
        const total = (item.price * item.qty).toFixed(2);
        info.textContent = `${item.name} - $${total}`;

        const controls = document.createElement("div");
        controls.style.display = "flex";
        controls.style.alignItems = "center";
        controls.style.marginTop = "4px";
        const dec = document.createElement("button");
        dec.type = "button";
        dec.className = "qty-btn";
        dec.textContent = "-";
        const qty = document.createElement("span");
        qty.textContent = item.qty;
        qty.style.minWidth = "20px";
        qty.style.textAlign = "center";
        const inc = document.createElement("button");
        inc.type = "button";
        inc.className = "qty-btn";
        inc.textContent = "+";
        dec.addEventListener("click", () => changeQty(item.id, item.qty - 1));
        inc.addEventListener("click", () => changeQty(item.id, item.qty + 1));
        controls.appendChild(dec);
        controls.appendChild(qty);
        controls.appendChild(inc);
        row.appendChild(info);
        row.appendChild(controls);
        panel.appendChild(row);
      });
    }

    const viewBtn = document.createElement("button");
    viewBtn.className = "view-all-btn";
    viewBtn.type = "button";
    viewBtn.textContent = "View All Products";
    viewBtn.style.marginTop = "8px";
    viewBtn.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
    panel.appendChild(viewBtn);
  }
  function changeQty(id, newQty) {
    const idx = cart.findIndex((i) => i.id === id);
    if (idx === -1) return;
    if (newQty <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].qty = newQty;
    }
    writeCart(cart);
    updateCartCount();
    renderCartDropdown();
  }

  const navList = document.querySelector(".navdiv ul");
  function refreshNav() {
    const user = getCurrentUser();
    if (user) {
      navList
        .querySelectorAll("button.login, button.register")
        .forEach((b) => (b.style.display = "none"));

      if (!navList.querySelector(".greeting")) {
        const g = document.createElement("div");
        g.className = "greeting";
        g.style.marginLeft = "10px";
        const nameSpan = document.createElement("span");
        nameSpan.textContent = "Hello, " + user.username;
        const cartBtn = document.createElement("div");
        cartBtn.className = "cart-btn";
        cartBtn.style.position = "relative";
        cartBtn.style.margin = "0 8px";
        cartBtn.style.cursor = "pointer";
        cartBtn.innerHTML =
          '<span class="cart-icon">🛒</span><span class="cart-count">0</span>';
        cartBtn.addEventListener("click", toggleCartDropdown);
        const out = document.createElement("button");
        out.className = "logout-btn";
        // include logout icon from FontAwesome
        out.innerHTML = '<i class="fa-solid fa-right-from-bracket" style="margin-right:4px"></i>Logout';
        out.addEventListener("click", () => {
          localStorage.removeItem("currentUser");
          refreshNav();
        });
        g.appendChild(nameSpan);
        g.appendChild(cartBtn);
        g.appendChild(out);
        navList.appendChild(g);
      } else {
        const g = navList.querySelector(".greeting");
        if (!g.querySelector(".cart-btn")) {
          const cartBtn = document.createElement("div");
          cartBtn.className = "cart-btn";
          cartBtn.style.position = "relative";
          cartBtn.style.margin = "0 8px";
          cartBtn.style.cursor = "pointer";
          cartBtn.innerHTML =
            '<span class="cart-icon">🛒</span><span class="cart-count">0</span>';
          cartBtn.addEventListener("click", toggleCartDropdown);
          g.insertBefore(cartBtn, g.querySelector("button"));
        }
      }
    } else {
      navList
        .querySelectorAll("button.login, button.register")
        .forEach((b) => (b.style.display = "inline-block"));
      const greeting = navList.querySelector(".greeting");
      if (greeting) greeting.remove();
      const cartBtn = navList.querySelector(".cart-btn");
      if (cartBtn) cartBtn.remove();
    }
  }
  refreshNav();
  updateCartCount();

  const select = document.querySelector(".select");
  const selected = select.querySelector(".selected");
  const options = select.querySelector(".options");
  const optionLabels = select.querySelectorAll(".option");

  selected.addEventListener("click", function (e) {
    if (!requireAuth()) return;
    e.stopPropagation();
    select.classList.toggle("open");
  });

  optionLabels.forEach(function (option) {
    option.addEventListener("click", function () {
      select.classList.remove("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
    }
  });

  const searchInput = document.querySelector(".input");
  const searchBtn = document.querySelector(".btn");
  function getSearchMode() {
    const radios = document.querySelectorAll(
      '.select .options input[type="radio"]',
    );
    for (const r of radios) {
      if (r.checked) {
        if (r.id === "all") return "name";
        if (r.id === "option-1") return "category";
      }
    }
    return "all";
  }

  const searchRadios = document.querySelectorAll(
    '.select .options input[type="radio"]',
  );
  searchRadios.forEach((r) => r.addEventListener("change", filterItems));
  function filterItems() {
    if (!requireAuth()) return;
    const q = (searchInput.value || "").trim().toLowerCase();
    const mode = getSearchMode();
    const items = document.querySelectorAll(".cards .item");
    items.forEach((item) => {
      const name = item.querySelector(".item-name").textContent.toLowerCase();
      let catText = item
        .querySelector(".item-category")
        .textContent.toLowerCase();

      if (catText.startsWith("category:")) {
        catText = catText.split(":")[1].trim();
      }
      let show = true;
      if (q) {
        if (mode === "name") show = name.includes(q);
        else if (mode === "category") show = catText.includes(q);
        else show = name.includes(q) || catText.includes(q);
      }
      item.style.display = show ? "flex" : "none";
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", filterItems);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", function (e) {
      filterItems();
    });

    searchInput.addEventListener("search", function () {
      filterItems();
    });
  }

  document.querySelectorAll(".button2").forEach((btn, index) => {
    const id = index + 1;

    if (cart.find((i) => i.id === id)) {
      btn.textContent = "Remove from Cart";
    } else {
      btn.textContent = "Add to Cart";
    }
    btn.addEventListener("click", function () {
      if (!requireAuth()) return;
      const card = btn.closest(".item");
      const name = card.querySelector(".item-name").textContent;
      const priceText = card.querySelector(".item-price").textContent;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

      let img = "";
      const imgEl = card.querySelector(".item-img");
      if (imgEl) {
        if (imgEl.tagName === "IMG") img = imgEl.src;
        else {
          const bg = imgEl.style.backgroundImage;
          if (bg && bg.startsWith("url(")) img = bg.slice(5, -2);
        }
      }
      const existing = cart.find((i) => i.id === id);
      if (existing) {
        cart = cart.filter((i) => i.id !== id);
        btn.textContent = "Add to Cart";
      } else {
        cart.push({ id, name, price, qty: 1, img });
        btn.textContent = "Remove from Cart";
      }
      writeCart(cart);
      updateCartCount();
      renderCartDropdown();
    });
  });
  document
    .querySelectorAll(".heart-container .checkbox")
    .forEach((cb, index) => {
      const id = index + 1;
      if (favorites.find((f) => f.id === id)) {
        cb.checked = true;
      }
      cb.addEventListener("click", function () {
        if (!requireAuth()) {
          cb.checked = false;
          return;
        }

        const card = cb.closest(".item");
        const name = card.querySelector(".item-name").textContent;
        const priceText = card.querySelector(".item-price").textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        const id = index + 1;
        if (cb.checked) {
          if (!favorites.find((f) => f.id === id)) {
            let img = "";
            const imgEl = card.querySelector(".item-img");
            if (imgEl) {
              if (imgEl.tagName === "IMG") img = imgEl.src;
              else {
                const bg = imgEl.style.backgroundImage;
                if (bg && bg.startsWith("url(")) img = bg.slice(5, -2);
              }
            }
            const catEl = card.querySelector(".item-category");
            const category = catEl
              ? catEl.textContent.replace(/^Category:\s*/, "")
              : "";
            favorites.push({ id, name, price, img, category });
          }
        } else {
          favorites = favorites.filter((f) => f.id !== id);
        }
        writeFavs(favorites);
      });
    });

  const logoLink = document.querySelector(".logo a");
  const logoImg = document.querySelector(".logo img");
  function onLogoClick(e) {
    e.preventDefault();
    const path = window.location.pathname;
    if (path.endsWith("index.html") || path === "/" || path === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "index.html";
    }
  }
  if (logoLink) logoLink.addEventListener("click", onLogoClick);
  if (logoImg) logoImg.addEventListener("click", onLogoClick);
});

document.querySelector(".favorite").addEventListener("click", function () {
  var card = this.closest(".card");
  var item = {
    name: card.querySelector(".item-name").textContent,
    price: card.querySelector(".item-price").textContent,
  };
  addToCart(item);
});

function addToCart(item) {
  var cartItem = document.createElement("div");
  cartItem.textContent = item.name + ": " + item.price;
  document.querySelector(".cart").appendChild(cartItem);
}

document.querySelector(".favorite").addEventListener("click", function () {
  var card = this.closest(".card");
  var item = {
    name: card.querySelector(".item-name").textContent,
    price: card.querySelector(".item-price").textContent,
  };
  addToCart(item);
});

function addToCart(item) {
  var cartItem = document.createElement("div");
  cartItem.textContent = item.name + ": " + item.price;
  document.querySelector(".cart").appendChild(cartItem);
}