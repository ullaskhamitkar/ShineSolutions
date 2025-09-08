console.log("Website loaded");

// Toggle menu
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Handle "Other Service" input visibility
document.addEventListener("DOMContentLoaded", () => {
  const serviceSelect = document.getElementById("serviceSelect");
  const otherServiceInput = document.getElementById("otherService");

  if (serviceSelect && otherServiceInput) {
    serviceSelect.addEventListener("change", () => {
      if (serviceSelect.value === "Other") {
        otherServiceInput.style.display = "block";
        otherServiceInput.required = true;
      } else {
        otherServiceInput.style.display = "none";
        otherServiceInput.required = false;
        otherServiceInput.value = ""; // clear field if hidden
      }
    });
  }

  const form = document.getElementById("appointmentForm");
  if (form) {
    // Set hidden inputs for Formspree
    const replyInput = document.createElement("input");
    replyInput.type = "hidden";
    replyInput.name = "_replyto";
    form.appendChild(replyInput);

    const subjectInput = document.createElement("input");
    subjectInput.type = "hidden";
    subjectInput.name = "_subject";
    subjectInput.value = "Shine Solutions Appointment Confirmation";
    form.appendChild(subjectInput);

    const templateInput = document.createElement("input");
    templateInput.type = "hidden";
    templateInput.name = "_template";
    templateInput.value = "table";
    form.appendChild(templateInput);

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // stop normal submission

      // Update _replyto dynamically
      replyInput.value = form.email.value;

      // ---- Generate PDF Invoice ----
      if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Shine Solutions Appointment", 20, 20);
        doc.setFontSize(12);
        doc.text(`Name: ${form.name.value}`, 20, 35);
        doc.text(`Email: ${form.email.value}`, 20, 45);
        doc.text(`Phone: ${form.phone.value}`, 20, 55);
        doc.text(
          `Service: ${form.service.value}${
            form.service.value === "Other"
              ? " - " + form.otherService.value
              : ""
          }`,
          20,
          65
        );
        doc.text(`Frequency: ${form.frequency.value}`, 20, 75);
        doc.text(`Date: ${form.date.value}`, 20, 85);
        doc.text(`Time: ${form.time.value}`, 20, 95);
        doc.text(`Address: ${form.address.value}`, 20, 105);
        doc.text(`Notes: ${form.notes.value}`, 20, 115);

        doc.save(`ShineSolutions_${form.name.value}.pdf`);
      }

      // ---- Submit form to Formspree ----
      const formData = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            form.reset(); // Clear form after submission
            window.location.href = "thankyou.html"; // Redirect to thankyou page
          } else {
            alert("Form submission failed. Please contact support.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Network error. Please contact support.");
        });
    });
  }
});
