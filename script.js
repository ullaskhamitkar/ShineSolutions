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
    // Set customer email for Formspree reply
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

      const options = {
        key: "rzp_test_REfKK8H4mcNbS5", // Replace with your Razorpay key
        amount: 10000, // ₹100 in paise
        currency: "INR",
        name: "Shine Solutions Appointment Booking",
        description: "Appointment Booking Fee",
        prefill: {
          name: form.name.value,
          email: form.email.value,
          contact: form.phone.value,
        },
        theme: { color: "#4CAF50" },
        handler: function (response) {
          // Add Razorpay payment ID to form
          const paymentInput = document.createElement("input");
          paymentInput.type = "hidden";
          paymentInput.name = "razorpay_payment_id";
          paymentInput.value = response.razorpay_payment_id;
          form.appendChild(paymentInput);

          // AJAX submit form to Formspree
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
        },
      };

      const rzp = new Razorpay(options);

      // Handle payment failures
      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        alert("Payment failed. Please try again.");
      });

      rzp.open();
    });
  }
});
