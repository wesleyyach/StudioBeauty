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

function setupTimeSelect() {
  const select = document.querySelector("[data-time-select]");
  if (!select) return;

  const startMinutes = 9 * 60; // 09:00
  const endMinutes = 19 * 60; // 19:00
  const step = 30; // 30 em 30 min

  const toHHMM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${pad2(h)}:${pad2(m)}`;
  };

  for (let t = startMinutes; t <= endMinutes; t += step) {
    const v = toHHMM(t);
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  }
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  if (backdrop) backdrop.addEventListener("click", () => setOpen(false));

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
setupTimeSelect();
setupMobileNav();
setupWhatsAppForm();

