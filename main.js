// Variables de productos y filtros
const grid = document.querySelector(".product-grid");
const fldVendors = document.getElementById("filter-vendors");
const fldModels = document.getElementById("filter-models");
const fldYears = document.getElementById("filter-years");
const rangeMin = document.getElementById("range-min");
const rangeMax = document.getElementById("range-max");
const rangeMinVal = document.getElementById("range-min-val");
const rangeMaxVal = document.getElementById("range-max-val");

// Variables de carrito y pago
const clearBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-button");
const formSection = document.getElementById("checkout-form");
const paymentForm = document.getElementById("paymentForm");
const paymentMsg = document.getElementById("paymentMessage");

// ——— Variables globales para e-commerce ———
let allProducts = [];
let cart = [];
let lastFiltered = [];
const itemsPerPage = 12;
let currentPage = 1;

// Menú hamburguesa 
const btn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-horizontal");
const marcasToggle = document.getElementById("marcas-toggle");
const marcasMenu   = document.getElementById("marcas-menu");

marcasToggle.addEventListener("click", e => {
  e.preventDefault();
  marcasMenu.classList.toggle("visible");
});

// Cerrar al hacer clic fuera
document.addEventListener("click", e => {
  if (!marcasToggle.contains(e.target) &&
      !marcasMenu.contains(e.target)) {
    marcasMenu.classList.remove("visible");
  }
});

// Al clicar una marca, aplicar filtro y hacer scroll
marcasMenu.querySelectorAll("a[data-brand]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const brand = link.dataset.brand;
    // Cerrar menú
    marcasMenu.classList.remove("visible");
    // Scroll a productos
    document.getElementById("productos")
            .scrollIntoView({ behavior: "smooth" });
    // Chequear la casilla correspondiente
    const cb = document.querySelector(`input[name="vendor"][value="${brand}"]`);
    if (cb && !cb.checked) {
      cb.checked = true;
    }
    // Re-aplicar filtros
    applyFilters();
  });
});

btn.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Insertar año en el footer 
function insertarAnioActualFooter() {
  const spanAnio = document.getElementById("anio-actual");
  if (spanAnio) spanAnio.textContent = new Date().getFullYear();
}

// Inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  insertarAnioActualFooter();
  setupFilterToggle();
  fetchProducts();
  document.getElementById("clear-cart").addEventListener("click", clearCart);
  document.getElementById("checkout-button").addEventListener("click", showPaymentForm);
  document.getElementById("paymentForm").addEventListener("submit", handlePayment);
});


// ——— Toggle collapsible de grupos de filtro ———
function setupFilterToggle() {
  document.querySelectorAll(".filter-group").forEach(group => {
    group.querySelector(".filter-group-header")
         .addEventListener("click", () => group.classList.toggle("collapsed"));
  });
}

/// Fetch de productos.json
async function fetchProducts() {
  const grid = document.querySelector(".product-grid");
  try {
    const res  = await fetch("productos.json");
    const json = await res.json();
    allProducts = json.products;
    initFilters();
    applyFilters();
  } catch (e) {
    console.error("Error cargando productos:", e);
    grid.innerHTML = `<p>No se pudieron cargar los productos.</p>`;
  }
}

// Inicializar filtros dinámicos
function initFilters() {
  // Refs a DOM
  const fldVendors = document.getElementById("filter-vendors");
  const fldModels = document.getElementById("filter-models");
  const fldYears = document.getElementById("filter-years");
  const rangeMin = document.getElementById("range-min");
  const rangeMax = document.getElementById("range-max");
  const rangeMinVal = document.getElementById("range-min-val");
  const rangeMaxVal = document.getElementById("range-max-val");

  // 1) Marca
  const vendCount = allProducts.reduce((acc,p) => {
    acc[p.vendor] = (acc[p.vendor]||0) + 1;
    return acc;
  }, {});
  renderCheckboxWithCount(vendCount, fldVendors, "vendor");

  // 2) Modelo y Año
  function getCount(key){
    return allProducts.reduce((acc,p)=>{
      p.variants.forEach(v=>{
        const val = v[key];
        if(val) acc[val] = (acc[val]||0) + 1;
      });
      return acc;
    },{});
  }
  renderCheckboxWithCount(getCount("option1"), fldModels, "model");
  renderCheckboxWithCount(getCount("option2"), fldYears,  "year");

  // 3) Slider de precio
  const precios = allProducts.flatMap(p=>p.variants.map(v=>+v.price));
  const minP = Math.min(...precios), maxP = Math.max(...precios);
  rangeMin.min = minP; rangeMin.max = maxP; rangeMin.value = minP;
  rangeMax.min = minP; rangeMax.max = maxP; rangeMax.value = maxP;
  rangeMinVal.textContent = minP.toFixed(2);
  rangeMaxVal.textContent = maxP.toFixed(2);

  // 4) Listeners básicos
  rangeMin.addEventListener("input", () => {
    if (+rangeMin.value > +rangeMax.value) rangeMin.value = rangeMax.value;
    rangeMinVal.textContent = (+rangeMin.value).toFixed(2);
    applyFilters();
  });
  rangeMax.addEventListener("input", () => {
    if (+rangeMax.value < +rangeMin.value) rangeMax.value = rangeMin.value;
    rangeMaxVal.textContent = (+rangeMax.value).toFixed(2);
    applyFilters();
  });

  // 5) Pintar el fondo coloreado
  function updatePriceSliderBackground(){
    let low  = +rangeMin.value, high = +rangeMax.value;
    if(low>high) [low,high]=[high,low];
    const total = +rangeMin.max - +rangeMin.min;
    const pctLow  = ((low - +rangeMin.min)/total)*100;
    const pctHigh = ((high- +rangeMin.min)/total)*100;
    const grad = `linear-gradient(to right,
      #ccc 0%,#ccc ${pctLow}%,
      var(--azul-claro) ${pctLow}%,var(--azul-claro) ${pctHigh}%,
      #ccc ${pctHigh}%,#ccc 100%)`.replace(/\s+/g,' ');
    rangeMin.style.background = grad;
    rangeMax.style.background = grad;
  }
  rangeMin.addEventListener("input", updatePriceSliderBackground);
  rangeMax.addEventListener("input", updatePriceSliderBackground);
  updatePriceSliderBackground();
}

// Renderizar checkboxes con conteo
function renderCheckboxWithCount(map, container, name){
  container.innerHTML = "";
  Object.entries(map).sort((a,b)=>a[0].localeCompare(b[0]))
    .forEach(([val,cnt])=>{
      const id = `${name}-${val}`.replace(/\s+/g,"-").toLowerCase();
      const lbl = document.createElement("label");
      lbl.innerHTML = `
        <input type="checkbox" name="${name}" id="${id}" value="${val}">
        ${val} (${cnt})
      `;
      container.appendChild(lbl);
      lbl.querySelector("input")
         .addEventListener("change", applyFilters);
    });
}

// Obtener valores seleccionados
function getChecked(name){
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(cb=>cb.value);
}

// Contar ocurrencias de una opción de variante
function getCount(key){
  return allProducts.reduce((a,p)=>{
    p.variants.forEach(v=>{
      const val = v[key];
      if(val) a[val] = (a[val]||0) + 1;
    });
    return a;
  }, {});
}

// Render de checkboxes con conteo
function renderCheckboxWithCount(map, container, name){
  container.innerHTML = "";
  Object.entries(map)
    .sort((a,b)=>a[0].localeCompare(b[0]))
    .forEach(([val,cnt])=>{
      const id = `${name}-${val}`.replace(/\s+/g,"-").toLowerCase();
      const lbl = document.createElement("label");
      lbl.innerHTML = `
        <input type="checkbox" name="${name}" id="${id}" value="${val}">
        ${val} (${cnt})
      `;
      container.appendChild(lbl);
      lbl.querySelector("input")
         .addEventListener("change", applyFilters);
    });
}

// Leer checkboxes marcados
function getChecked(name){
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(cb=>cb.value);
}

// Aplicar filtros y paginación 
function applyFilters(){
  const selV = getChecked("vendor"),
        selM = getChecked("model"),
        selY = getChecked("year");
  const minP = +document.getElementById("range-min").value,
        maxP = +document.getElementById("range-max").value;

  const filtered = allProducts.filter(p=>{
    if(selV.length && !selV.includes(p.vendor)) return false;
    return p.variants.some(v=>{
      const pr = +v.price;
      const okM = !selM.length || selM.includes(v.option1);
      const okY = !selY.length || selY.includes(v.option2);
      const okP = pr>=minP && pr<=maxP;
      return okM && okY && okP;
    });
  });

  lastFiltered = filtered;
  currentPage  = 1;
  renderProductsPage(filtered);
}

// Renderizar página de productos
function renderProductsPage(arr){
  const grid = document.querySelector(".product-grid");
  const start = (currentPage-1)*itemsPerPage;
  const pageItems = arr.slice(start, start+itemsPerPage);
  grid.innerHTML = "";
  if(!pageItems.length){
    grid.innerHTML = `<p>No hay productos que coincidan.</p>`;
  } else {
    pageItems.forEach(p=>{
      const img = p.images[0]?.src||"",
            pr  = +p.variants[0]?.price||0,
            fmt = new Intl.NumberFormat("es-PE", {
                    style:"currency",currency:"PEN"
                  }).format(pr);
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${img}" alt="${p.title}">
        <div class="product-info">
          <h3>${p.title}</h3>
          <div class="price">${fmt}</div>
          <button data-id="${p.id}">Añadir producto</button>
        </div>
      `;
      grid.appendChild(card);
      card.querySelector("button")
          .addEventListener("click", ()=> addToCart(p));
    });
  }
  renderPagination(Math.ceil(arr.length/itemsPerPage));
}


// Renderizar paginación
function renderPagination(totalPages){
  const nav = document.getElementById("pagination");
  nav.innerHTML = "";
  const makeItem = (label,page,active,ellipsis=false) => {
    const s = document.createElement("span");
    s.textContent = label;
    s.className = "page-item" + (active?" active":"") + (ellipsis?" ellipsis":"");
    if(!active && !ellipsis){
      s.addEventListener("click", ()=>{
        currentPage = page;
        renderProductsPage(lastFiltered);
      });
    }
    return s;
  };
  nav.appendChild(makeItem("1",1,currentPage===1));
  if(totalPages>5 && currentPage>3) nav.appendChild(makeItem("…",null,false,true));
  for(let p=Math.max(2,currentPage-1); p<=Math.min(totalPages-1,currentPage+1); p++){
    nav.appendChild(makeItem(String(p),p,currentPage===p));
  }
  if(totalPages>5 && currentPage<totalPages-2) nav.appendChild(makeItem("…",null,false,true));
  if(totalPages>1) nav.appendChild(makeItem(String(totalPages),totalPages,currentPage===totalPages));
  if(currentPage<totalPages) nav.appendChild(makeItem("→",currentPage+1,false));
}


// Render grid de productos 
function renderProducts(arr) {
  grid.innerHTML = "";
  if (!arr.length) {
    grid.innerHTML = `<p>No hay productos que coincidan.</p>`;
    return;
  }
  arr.forEach(prod => {
    const imgSrc = prod.images[0]?.src || "";
    const price  = parseFloat(prod.variants[0]?.price || 0);
    const fmt    = new Intl.NumberFormat("es-PE", {
                     style: "currency", currency: "PEN"
                   }).format(price);
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${imgSrc}" alt="${prod.title}">
      <div class="product-info">
        <h3>${prod.title}</h3>
        <div class="price">${fmt}</div>
        <button data-id="${prod.id}">Añadir producto</button>
      </div>
    `;
    grid.appendChild(card);

    // Evento de "Comprar producto"
    card.querySelector("button").addEventListener("click", () => {
      addToCart(prod, price, fmt);
    });
  });
}

// Añadir producto al carrito
// Si ya existe, incrementar cantidad; si no, agregar nuevo
function addToCart(prod){
  const item = cart.find(i=>i.id===prod.id);
  if(item) item.qty++;
  else     cart.push({ id:prod.id, title:prod.title, price:+prod.variants[0].price, qty:1 });
  renderCart();
}

// Render del carrito 
function renderCart() {
  const ul    = document.getElementById("cart-items");
  const clear = document.getElementById("clear-cart");
  ul.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>
        ${item.title} x${item.qty}
        <button class="cart-remove" title="Quitar una unidad">&times;</button>
      </span>
      <span>
        ${new Intl.NumberFormat("es-PE", {
          style: "currency", currency: "PEN"
        }).format(item.price * item.qty)}
      </span>
    `;
    // listener al “×”
    li.querySelector(".cart-remove")
      .addEventListener("click", () => removeCartItem(item.id));
    ul.appendChild(li);
  });

  document.getElementById("cart-total").textContent =
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })
      .format(total);

  clear.disabled = cart.length === 0;
}

// Vaciar carrito completo
function clearCart(){ cart=[]; renderCart(); }

// Quitar una unidad del producto en el carrito
function removeCartItem(id) {
  const idx = cart.findIndex(item => item.id === id);
  if (idx === -1) return;

  // Si hay más de 1, decrementa; si solo hay 1, elimina el ítem
  if (cart[idx].qty > 1) {
    cart[idx].qty--;
  } else {
    cart.splice(idx, 1);
  }
  renderCart();
}

// Botón Vaciar carrito
document.getElementById("clear-cart").addEventListener("click", clearCart);

// ——— Checkout: mostrar formulario, validar, mensaje ———
function showPaymentForm(){
  const msg    = document.getElementById("paymentMessage");
  msg.textContent=""; msg.className="checkout-message";
  if(!cart.length){
    msg.textContent="El carrito está vacío."; msg.classList.add("error");
    return;
  }
  document.getElementById("checkout-form").style.display="block";
  document.getElementById("checkout-form").scrollIntoView({behavior:"smooth"});
}
function handlePayment(e){
  e.preventDefault();
  const msg    = document.getElementById("paymentMessage");
  msg.textContent=""; msg.className="checkout-message";
  const name   = document.getElementById("cardName").value.trim();
  const num    = document.getElementById("cardNumber").value.replace(/\s+/g,"");
  const exp    = document.getElementById("cardExpiry").value.trim();
  const cvv    = document.getElementById("cardCvv").value.trim();
  if(!name)    return showError("Ingresa el nombre en la tarjeta.");
  if(!/^\d{16}$/.test(num))  return showError("Número de tarjeta inválido.");
  if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp))  return showError("Expiración debe ser MM/AA.");
  if(!/^\d{3}$/.test(cvv))   return showError("CVV inválido.");
  msg.textContent="¡Compra realizada con éxito!";
  msg.classList.add("success");
  clearCart();
  document.getElementById("paymentForm").reset();
}
function showError(text){
  const msg = document.getElementById("paymentMessage");
  msg.textContent = text;
  msg.className = "checkout-message error";
}