// Year stamp
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll for in-page nav links (Home page)
document.querySelectorAll('a.nav-link[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      // close mobile nav if open
      const toggle = document.getElementById("nav-toggle");
      if (toggle && toggle.checked) toggle.checked = false;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - 70,
        behavior: "smooth"
      });
    }
  });
});

// Hover animation for process numbers (subtle bounce on pointer)
document.querySelectorAll(".step-num").forEach(el => {
  el.addEventListener("mouseenter", () => el.classList.add("wiggle"));
  el.addEventListener("mouseleave", () => el.classList.remove("wiggle"));
});

// Simple wiggle via injected CSS class
const style = document.createElement("style");
style.textContent = `
  .wiggle{ animation: wiggle .4s ease; }
  @keyframes wiggle{
    0%{ transform: translateY(0) scale(1); }
    35%{ transform: translateY(-4px) scale(1.05); }
    100%{ transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(style);

/* ---------- Google Sheets submission ----------
   1) Create a new Google Sheet.
   2) Extensions → Apps Script, paste this code:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form');
  if (!sheet) SpreadsheetApp.getActiveSpreadsheet().insertSheet('Form');
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.name, data.email, data.business, data.phone, data.message]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

   3) Deploy → New deployment → Web app
      - Execute as: Me
      - Who has access: Anyone
      - Copy the Web app URL and paste below as SHEETS_ENDPOINT.
*/
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxCQeyODeQ87qXigMj5QHj7gSzKoSYzdZaSIQCkzcNEnmHYAl0XAuy02dxx0-qSheyw3w/exec";

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("formStatus");
    status.textContent = "Submitting…";

    const fd = new FormData(contactForm);
    const payload = {
      firstName: fd.get("firstName") || "",
      lastName: fd.get("lastName") || "",
      email: fd.get("email") || "",
      company: fd.get("company") || "",
      role: fd.get("role") || "",
      website: fd.get("website") || "",
      phone: fd.get("phone") || "",
      companySize: fd.get("companySize") || "",
      projectBudget: fd.get("projectBudget") || "",
      message: fd.get("message") || "",
      page: location.href
    };

    try {
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      contactForm.reset();
      status.textContent = "Thanks! We’ll be in touch shortly.";
    } catch (err) {
      status.textContent = "Something went wrong. Please try again or email hello@repetix.ai.";
      console.error(err);
    }
  });
}