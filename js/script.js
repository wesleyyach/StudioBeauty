const WHATSAPP_PHONE_E164 = "5581999630813"; // Ex.: 5511999999999 (DD + número, sem espaços)

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatYMD(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function parseYMD(ymd) {
  // Espera formato "YYYY-MM-DD" do input type="date"
  const parts = String(ymd).split("-").map((p) => Number(p));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

function startOfTodayLocal() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

function setYear() {
  const el = document.querySelector("[data-year]");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}

function setDateMinToToday() {
  const input = document.querySelector('input[name="data"][type="date"]');
  if (!input) return;
  input.min = formatYMD(startOfTodayLocal());
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

    if (fields.data) {
      const chosen = parseYMD(fields.data);
      const today = startOfTodayLocal();

      if (!chosen) {
        alert("Data inválida. Escolha uma data válida.");
        return;
      }

      if (chosen < today) {
        alert("Escolha uma data a partir de hoje.");
        return;
      }

      const weekday = chosen.getDay(); // 0 = domingo, 6 = sábado
      if (weekday === 0) {
        alert("Atendemos de segunda a sábado. Escolha um dia entre segunda e sábado.");
        return;
      }
    }

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
setDateMinToToday();
setupMobileNav();
setupWhatsAppForm();

