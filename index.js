document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const confirmation = document.getElementById("confirmation");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const appointmentData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      service: document.getElementById("service").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
    };

    try {
      const response = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        confirmation.classList.remove("hidden");
        form.reset();
      } else {
        alert("Failed to book appointment. Try again later.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error connecting to server.");
    }
  });
});
