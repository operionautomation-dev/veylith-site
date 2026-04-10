document.getElementById("sevari-form")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const status = document.getElementById("form-status");
  status.innerText = "Sending...";

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    // ===== SWITCH THIS LATER TO N8N =====
    const webhookUrl = ""; // leave empty for now

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "sevari_web",
          ...data
        })
      });
    } else {
      // fallback: email
      window.location.href =
        `mailto:veylithsystems@gmail.com?subject=Sevari Enquiry&body=${encodeURIComponent(
          data.name + " (" + data.email + ")\n\n" + data.message
        )}`;
    }

    status.innerText = "Sent.";
  } catch (err) {
    status.innerText = "Error. Try again.";
  }
});
