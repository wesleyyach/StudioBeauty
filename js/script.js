const WHATSAPP_PHONE_E164 = "5581999630813"; // Ex.: 5511999999999 (DD + número, sem espaços)

function setYear() {
  const el = document.querySelector("[data-year]");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function buildWhatsAppMessage(fields) {
  const lines = [
    "Olá! Gostaria de agendar no Studio Beauty.",
    "",
    `Nome: ${fields.nome || "-"}`,
    `Telefone: ${fields.telefone || "-"}`,
    `Serviço: ${fields.servico || "-"}`,
    `Data: ${fields.data || "-"}`,
    `Horário: ${fields.hora || "-"}`,
  ];

  if (fields.obs) {
    lines.push(`Observações: ${fields.obs}`);
  }

  return lines.join("\n");
}

function setupWhatsAppForm() {
  const form = document.querySelector("[data-whats-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const fields = {
      nome: String(data.get("nome") || "").trim(),
      telefone: String(data.get("telefone") || "").trim(),
      servico: String(data.get("servico") || "").trim(),
      data: String(data.get("data") || "").trim(),
      hora: String(data.get("hora") || "").trim(),
      obs: String(data.get("obs") || "").trim(),
    };

    const msg = buildWhatsAppMessage(fields);
    const phone = WHATSAPP_PHONE_E164.replace(/[^\d]/g, "");

    if (!phone || phone.includes("X")) {
      alert('Edite o número do WhatsApp em "script.js" (WHATSAPP_PHONE_E164).');
      return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

setYear();
setupMobileNav();
setupWhatsAppForm();

