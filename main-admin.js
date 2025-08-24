document.addEventListener("DOMContentLoaded", () => {
  const availabilityForm = document.getElementById("availabilityForm");
  const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");

  // Submit availability
  availabilityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("availableDate").value;
    const times = document.getElementById("availableTimes").value
      .split(",")
      .map(t => t.trim())
      .filter(t => t);

    try {
      const response = await fetch("http://localhost:5000/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, times }),
      });

      if (response.ok) {
        alert("Availability saved successfully.");
        availabilityForm.reset();
      } else {
        alert("Failed to save availability.");
      }
    } catch (err) {
      console.error("Error saving availability:", err);
    }
  });

  // Load appointments
  async function loadAppointments() {
    try {
      const res = await fetch("http://localhost:5000/api/book");
      const appointments = await res.json();

      appointmentsTableBody.innerHTML = "";
      appointments.forEach((appt) => {
        const row = document.createElement("tr");
        row.classList.add("border-b");
        if (appt.completed) {
          row.classList.add("bg-green-200");
        }
        row.setAttribute("data-id", appt._id);
        row.innerHTML = `
          <td class="py-2 px-4">${appt.name}</td>
          <td class="py-2 px-4">${appt.service}</td>
          <td class="py-2 px-4">${appt.date}</td>
          <td class="py-2 px-4">${appt.time}</td>
          <td class="py-2 px-4">
            <button class="text-green-600 hover:underline" onclick="markComplete('${appt._id}', ${appt.completed})">Complete</button>
            <button class="text-red-600 hover:underline ml-2" onclick="deleteAppointment('${appt._id}')">Delete</button>
          </td>
        `;
        appointmentsTableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }

  // Toggle complete state (persist to backend)
  window.markComplete = async function (id, currentState) {
    try {
      const res = await fetch(`http://localhost:5000/api/book/${id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentState })
      });
      if (res.ok) {
        loadAppointments();
      }
    } catch (err) {
      console.error("Error updating complete state:", err);
    }
  };

  // Delete appointment
  window.deleteAppointment = async function (id) {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/book/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadAppointments();
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  loadAppointments();
});
