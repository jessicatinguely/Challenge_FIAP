const cart=[];
const BRL = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function addToCart(name, price){
  cart.push({name,price});
  const total = cart.reduce((s,i)=>s+i.price,0);
  document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=cart.length);
  document.querySelectorAll('[data-cart-total]').forEach(e=>e.textContent=BRL(total));
}