// Utilities for the whole site
(function(){
  // Fill dynamic year
  const y = document.querySelectorAll("[data-year]");
  y.forEach(el => el.textContent = new Date().getFullYear());

  // WhatsApp FAB
  const wa = document.getElementById("waFab");
  if (wa && window.WHATSAPP_PHONE) {
    wa.href = `https://wa.me/${window.WHATSAPP_PHONE}?text=${encodeURIComponent("Hola, me interesa una cotización de ferretería.")}`;
    wa.classList.remove("hidden");
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.transform = "translateY(0)"; e.target.style.opacity=1; observer.unobserve(e.target); }
    });
  }, {threshold:.15});
  document.querySelectorAll(".card, .hero-card").forEach(el=>{
    el.style.transform="translateY(10px)"; el.style.opacity=.0; observer.observe(el);
  });

  // Quote cart count
  updateQuoteCount();
})();

function getLeads(){ return JSON.parse(localStorage.getItem("leads") || "[]"); }
function saveLead(lead){
  const items = getLeads();
  items.push({...lead, createdAt: new Date().toISOString()});
  localStorage.setItem("leads", JSON.stringify(items));
}

function getQuote(){ return JSON.parse(localStorage.getItem("quote") || "[]"); }
function saveQuote(items){ localStorage.setItem("quote", JSON.stringify(items)); updateQuoteCount(); }
function updateQuoteCount(){
  const count = getQuote().length;
  document.querySelectorAll("[data-quote-count]").forEach(el => el.textContent = count);
}
function addToQuote(item){
  const current = getQuote();
  if(!current.find(x => x.id === item.id)){
    current.push(item);
    saveQuote(current);
    alert("Agregado a la cotización.");
  } else {
    alert("Este artículo ya está en tu cotización.");
  }
}
function removeFromQuote(id){
  const next = getQuote().filter(x => x.id !== id);
  saveQuote(next);
}

function exportLeadsCSV(){
  const rows = getLeads();
  if(!rows.length){ alert("No hay leads para exportar."); return; }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=> `"${String(r[h]).replace(/"/g,'""')}"`).join(","))).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "leads.csv"; a.click();
  URL.revokeObjectURL(url);
}

function sendQuoteViaWhatsApp(){
  const items = getQuote();
  if(!items.length){ alert("Tu cotización está vacía."); return; }
  const text = "Hola, quisiera cotizar:\n" + items.map(i=>`• ${i.name} (x${i.qty || 1})`).join("\n");
  if(window.WHATSAPP_PHONE){
    location.href = `https://wa.me/${window.WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  } else {
    alert("Configura el número de WhatsApp en assets/js/config.js");
  }
}
