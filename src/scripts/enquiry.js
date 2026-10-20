const form = document.getElementById("enq");
if (form) {
  const rules = {
    name: v => v.trim().length < 2 ? "Enter your name." : "",
    msg: v => v.trim().length < 10 ? "Tell us a little about your project (at least 10 characters)." : "",
  };
  const show = (el, text) => {
    const err = document.getElementById(el.name + "-err");
    err.textContent = text; el.toggleAttribute("aria-invalid", !!text);
    if (!text) el.removeAttribute("aria-invalid"); else el.setAttribute("aria-invalid", "true");
  };
  // Errors appear on submit and clear while typing. No blur validation: it moved the Submit button
  // between press and release on touch screens, so taps could miss.
  for (const k in rules) form[k].addEventListener("input", () => { if (form[k].getAttribute("aria-invalid")) show(form[k], rules[k](form[k].value)); });
  const q = new URLSearchParams(location.search).get("service");
  if (q && [...form.service.options].some(o => o.value === q)) form.service.value = q;
  document.querySelectorAll("[data-service]").forEach(a => a.addEventListener("click", () => { form.service.value = a.dataset.service; }));
  form.addEventListener("submit", e => {
    e.preventDefault();
    let first = null;
    for (const k in rules) { const m = rules[k](form[k].value); show(form[k], m); if (m && !first) first = form[k]; }
    const status = document.getElementById("enq-status");
    if (first) { status.textContent = "Please fix the highlighted fields."; first.focus(); return; }
    const d = new FormData(form);
    const when = String(d.get("when")).trim();
    let msg = String(d.get("msg")).trim(); if (!/[.!?]$/.test(msg)) msg += ".";
    const text = `Hi Sound O'Clock, I'm ${String(d.get("name")).trim()}. I'd like to enquire about ${d.get("service")}. ${msg}${when ? " Preferred timing: " + when + "." : ""}`;
    const w = window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`, "_blank");
    if (w) w.opener = null;
    status.textContent = w ? "WhatsApp opened with your message. Press send there to submit your enquiry. Nothing has been sent yet." : "Your browser blocked the new tab. Use the WhatsApp button above instead.";
  });
}
