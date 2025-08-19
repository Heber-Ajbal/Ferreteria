// Generic form handler: save to localStorage + optional POST
async function handleFormSubmit(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  // Save locally as a lead
  saveLead({source: form.dataset.source || "contact", ...data});

  // Optional network POST
  if(window.FORMS_ENDPOINT){
    try{
      const res = await fetch(window.FORMS_ENDPOINT, {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error(await res.text());
      alert("¡Enviado! Gracias por contactarnos."); form.reset(); return;
    }catch(err){
      console.warn("POST failed; using mailto fallback.", err);
    }
  }

  // Fallback: open email client with composed message
  const subject = encodeURIComponent(data.asunto || data.subject || "Consulta Ferretería");
  const body = encodeURIComponent(Object.entries(data).map(([k,v]) => `${k}: ${v}`).join("\n"));
  const mailto = `mailto:ventas@example.com?subject=${subject}&body=${body}`; // <- cambia este correo
  window.location.href = mailto;
  form.reset();
}

function attachForms(){
  document.querySelectorAll("form[data-auto]").forEach(f => f.addEventListener("submit", handleFormSubmit));
}
document.addEventListener("DOMContentLoaded", attachForms);
