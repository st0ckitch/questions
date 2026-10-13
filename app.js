// Where submissions go. Every response is emailed via FormSubmit (https://formsubmit.co).
// Optional: set sheetsUrl to a Google Apps Script web-app URL to also store each response
// as a row in a Google Sheet (see README.md).
const CONFIG = {
  to: "artyomananov@gmail.com",
  cc: ["i.sisauri@bist.ge"],
  subject: "New Student Transition Information Request",
  sheetsUrl: "",
};

const fieldsEl = document.getElementById("fields");
const formEl = document.getElementById("form");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");
const signatures = {};

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

function title(q, forId) {
  const t = el(forId ? "label" : "div", { class: "title", ...(forId ? { for: forId } : {}) }, [q.label]);
  if (q.required) t.append(el("span", { class: "req", text: "*" }));
  if (q.help) t.append(el("span", { class: "help", text: q.help }));
  return t;
}

function choices(q, kind) {
  const wrap = el("div", { class: `choices ${kind}`, role: kind === "multi" ? "group" : "radiogroup" });
  const options = kind === "yesno" ? ["Yes", "No"] : q.options;
  for (const opt of options) {
    const input = el("input", { type: kind === "multi" ? "checkbox" : "radio", name: q.id, value: opt });
    wrap.append(el("label", { class: "choice" }, [input, el("span", { text: opt })]));
  }
  return wrap;
}

function signaturePad(q) {
  const box = el("div", { class: "sig-box" });
  const canvas = el("canvas");
  const hint = el("div", { class: "sig-hint", text: "✍ Sign here" });
  const clear = el("button", { type: "button", class: "sig-clear", text: "Clear" });
  box.append(canvas, hint, clear);

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let state = { signed: false };
  signatures[q.id] = { canvas, state };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    const prev = state.signed ? canvas.toDataURL() : null;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1f2a3c";
    if (prev) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, width, height);
      img.src = prev;
    }
  }
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.moveTo(...pos(e));
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    ctx.lineTo(...pos(e));
    ctx.stroke();
    state.signed = true;
    box.classList.add("signed");
  });
  const stop = () => (drawing = false);
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  clear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.signed = false;
    box.classList.remove("signed");
  });
  window.addEventListener("resize", resize);
  requestAnimationFrame(resize);
  return box;
}

function render() {
  for (const q of window.QUESTIONS) {
    if (q.type === "statement") {
      fieldsEl.append(el("p", { class: "statement", text: q.text }));
      continue;
    }
    const block = el("div", { class: "q", "data-id": q.id });
    switch (q.type) {
      case "name":
        block.append(title(q, `${q.id}_first`), el("div", { class: "row" }, [
          el("input", { class: "input", id: `${q.id}_first`, name: `${q.id}_first`, placeholder: "First Name", autocomplete: "given-name" }),
          el("input", { class: "input", name: `${q.id}_last`, placeholder: "Last Name", autocomplete: "family-name", "aria-label": `${q.label} – last name` }),
        ]));
        break;
      case "date":
        block.append(title(q, q.id), el("input", { class: "input", type: "date", id: q.id, name: q.id }));
        break;
      case "text":
        block.append(title(q, q.id), el("input", { class: "input", type: "text", id: q.id, name: q.id }));
        break;
      case "textarea":
        block.append(title(q, q.id), el("textarea", { class: "textarea", id: q.id, name: q.id }));
        break;
      case "yesno":
      case "single":
      case "multi":
        block.append(title(q), choices(q, q.type === "single" ? "single" : q.type));
        break;
      case "signature":
        block.append(title(q), signaturePad(q));
        break;
    }
    block.append(el("div", { class: "err", text: "This field is required." }));
    block.addEventListener("input", () => block.classList.remove("invalid"));
    block.addEventListener("change", () => block.classList.remove("invalid"));
    fieldsEl.append(block);
  }
}

function valueOf(q) {
  const f = formEl.elements;
  switch (q.type) {
    case "name": {
      const first = f[`${q.id}_first`].value.trim();
      const last = f[`${q.id}_last`].value.trim();
      return [first, last].filter(Boolean).join(" ");
    }
    case "multi":
      return [...formEl.querySelectorAll(`input[name="${q.id}"]:checked`)].map((i) => i.value).join(", ");
    case "yesno":
    case "single":
      return formEl.querySelector(`input[name="${q.id}"]:checked`)?.value || "";
    case "signature":
      return signatures[q.id].state.signed ? "Signed (see attached signature.png)" : "";
    default:
      return f[q.id].value.trim();
  }
}

function collect() {
  const answers = [];
  let firstInvalid = null;
  for (const q of window.QUESTIONS) {
    if (q.type === "statement") continue;
    const value = valueOf(q);
    const block = fieldsEl.querySelector(`[data-id="${q.id}"]`);
    const missing = q.required && (!value || (q.type === "name" && !formEl.elements[`${q.id}_last`].value.trim()));
    block.classList.toggle("invalid", Boolean(missing));
    if (missing && !firstInvalid) firstInvalid = block;
    answers.push({ q, value });
  }
  return { answers, firstInvalid };
}

function signatureBlob() {
  const sig = Object.values(signatures).find((s) => s.state.signed);
  return sig ? new Promise((res) => sig.canvas.toBlob(res, "image/png")) : Promise.resolve(null);
}

async function sendEmail(answers, sigBlob) {
  const data = new FormData();
  const student = answers.find((a) => a.q.id === "student_name")?.value;
  data.append("_subject", student ? `${CONFIG.subject}: ${student}` : CONFIG.subject);
  data.append("_cc", CONFIG.cc.join(","));
  data.append("_template", "table");
  data.append("_captcha", "false");
  for (const { q, value } of answers) data.append(q.label, value || "—");
  if (sigBlob) data.append("attachment", sigBlob, "signature.png");

  const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.to}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: data,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || String(json.success) === "false") throw new Error(json.message || `HTTP ${res.status}`);
}

function sendToSheet(answers, sigDataUrl) {
  if (!CONFIG.sheetsUrl) return Promise.resolve();
  const row = { submitted_at: new Date().toISOString() };
  for (const { q, value } of answers) row[q.label] = value;
  if (sigDataUrl) row["Signature image"] = sigDataUrl;
  return fetch(CONFIG.sheetsUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(row),
  }).catch(() => {});
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { answers, firstInvalid } = collect();
  formError.hidden = !firstInvalid;
  formError.textContent = "Please fill in all required fields.";
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";
  try {
    const sigBlob = await signatureBlob();
    const sigDataUrl = Object.values(signatures).find((s) => s.state.signed)?.canvas.toDataURL("image/png");
    await Promise.all([sendEmail(answers, sigBlob), sendToSheet(answers, sigDataUrl)]);
    formEl.hidden = true;
    document.querySelector(".head").hidden = true;
    document.getElementById("thanks").hidden = false;
    window.scrollTo({ top: 0 });
  } catch (err) {
    formError.hidden = false;
    formError.textContent = `Sorry, your response could not be sent (${err.message}). Please try again.`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});

render();
