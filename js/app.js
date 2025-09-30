/* ===== Swift – Interações JS (carrinho, toasts, persistência) ===== */

const fmtBRL = v => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CART_KEY = 'swift_cart_v1';
let cart = loadCart();

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
  const idx = cart.findIndex(i => i.name === name);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ name, price: Number(price || 0), qty: 1 });
  saveCart();
  updateCartUI();
  toast(`Adicionado: <strong>${name}</strong>`);
}

function setQty(name, qty) {
  const i = cart.findIndex(x => x.name === name);
  if (i < 0) return;
  cart[i].qty = Math.max(0, Number(qty || 0));
  if (cart[i].qty === 0) cart.splice(i, 1);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function cartTotal() { return cart.reduce((s, i) => s + i.qty * i.price, 0); }

function updateCartUI() {
  const count = cartCount();
  const total = fmtBRL(cartTotal());

  document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
}

function toast(html) {
  const hasBootstrap = !!window.bootstrap;
  if (!hasBootstrap) {
    const div = document.createElement('div');
    div.innerHTML = html.replace(/<[^>]+>/g,'');
    alert(div.textContent || 'OK');
    return;
  }
  let toaster = document.getElementById('toaster');
  if (!toaster) {
    toaster = document.createElement('div');
    toaster.id = 'toaster';
    toaster.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(toaster);
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'toast align-items-center text-bg-dark border-0';
  wrapper.role = 'status';
  wrapper.ariaLive = 'polite';
  wrapper.ariaAtomic = 'true';
  wrapper.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${html}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>`;
  toaster.appendChild(wrapper);
  const t = new bootstrap.Toast(wrapper, { delay: 1800 });
  t.show();
  wrapper.addEventListener('hidden.bs.toast', () => wrapper.remove());
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Cabeçalho
  const btnLogin  = document.querySelector('header .btn.btn-primary'); // "Já tenho conta"
  const btnSignup = document.querySelector('header .btn.btn-light');   // "Criar nova conta"
  const forgotLink = document.querySelector('header a.link-dark');     // seu HTML usa link-dark

  btnLogin?.addEventListener('click', () => toast('Tela de <strong>Login</strong> — (placeholder)'));
  btnSignup?.addEventListener('click', () => toast('Tela de <strong>Cadastro</strong> — (placeholder)'));
  forgotLink?.addEventListener('click', (e) => { e.preventDefault(); toast('<strong>Esqueci a senha</strong> — (placeholder)'); });

  // Conecta TODOS os botões "ADICIONAR" que têm data-add/data-price
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const name = btn.dataset.add;
    const price = parseFloat(btn.dataset.price || '0');
    addToCart(name, price);
  });

  // Duplo clique no total do rodapé limpa o carrinho (atalho)
  document.querySelector('footer [data-cart-total]')?.addEventListener('dblclick', () => {
    if (confirm('Limpar carrinho?')) clearCart();
  });
});

// expõe funções pra usar em onclick se quiser
window.addToCart = addToCart;
window.setQty = setQty;
window.clearCart = clearCart;
// sanity check
console.log('app.js carregado');

