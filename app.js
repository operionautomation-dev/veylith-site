// =============================
// VEYLITH SYSTEMS — FORM ENGINE
// =============================

// CONFIG — REPLACE WHEN N8N IS READY
const ENDPOINTS = {
  sevari: "",     // e.g. https://yourdomain.com/webhook/sevari
  serenity: "",   // e.g. https://yourdomain.com/webhook/serenity
  general: "mailto:veylithsystems@gmail.com"
};

// =============================
// CORE HANDLER
// =============================
async function handleFormSubmit(formId, type) {
  const form = document.getElementById(formId);
  if (!form) return;

  const status = form.querySelector("[id$='status']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (status) status.innerText = "Processing...";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      system: type,
      timestamp: new Date().toISOString(),
      source: "veylith_web",
      ...data
    };

    try {
      const endpoint = ENDPOINTS[type];

      // =============================
      // IF WEBHOOK EXISTS → SEND TO N8N
      // =============================
      if (endpoint && endpoint.startsWith("http")) {

        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (status) status.innerText = "Submitted.";

      } else {

        // =============================
        // FALLBACK → EMAIL
        // =============================
        const subject = `${type.toUpperCase()} Enquiry`;

        const body = `
Name: ${data.name || ""}
Email: ${data.email || ""}

Message:
${data.message || ""}
        `;

        window.location.href =
          `mailto:veylithsystems@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        if (status) status.innerText = "Opening email client...";
      }

    } catch (err) {
      if (status) status.innerText = "Error. Try again.";
      console.error("Submission error:", err);
    }
  });
}

// =============================
// INITIALISE
// =============================
document.addEventListener("DOMContentLoaded", () => {
  handleFormSubmit("sevari-form", "sevari");
  handleFormSubmit("serenity-form", "serenity");
  handleFormSubmit("general-form", "general");
});
