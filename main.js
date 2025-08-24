// main.js

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bookingForm')) {
    // We are on the customer booking page
    initCustomerPage();
  } else if (document.getElementById('adminSection')) {
    // We are on the admin dashboard page
    initAdminPage();
  }
});

// -------------------- CUSTOMER PAGE --------------------

function initCustomerPage() {
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const confirmation = document.getElementById('confirmation');

  // Fetch available times when date changes
dateInput.addEventListener('change', async () => {
  const selectedDate = dateInput.value;
  timeSelect.innerHTML = '<option value="">Loading...</option>';
  try {
    const res = await fetch(`/api/availability/${selectedDate}`);
    if (!res.ok) throw new Error('Failed to fetch availability');
    const times = await res.json(); // now times is an array directly

    if (times.length === 0) {
      timeSelect.innerHTML = '<option value="">No available times</option>';
    } else {
      timeSelect.innerHTML = '<option value="">Select a time</option>';
      times.forEach(time => {
        timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
      });
    }
  } catch (err) {
    timeSelect.innerHTML = '<option value="">No times available</option>';
    console.error(err);
  }
});


  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: bookingForm.name.value.trim(),
      email: bookingForm.email.value.trim(),
      phone: bookingForm.phone.value.trim(),
      service: bookingForm.service.value,
      date: bookingForm.date.value,
      time: bookingForm.time.value,
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Booking failed');
      bookingForm.reset();
      confirmation.classList.remove('hidden');
      setTimeout(() => confirmation.classList.add('hidden'), 4000);
    } catch (err) {
      alert('Failed to book appointment. Please try again.');
      console.error(err);
    }
  });
}

// -------------------- ADMIN PAGE --------------------

function initAdminPage() {
  const appointmentsList = document.getElementById('appointmentsList');
  const availabilityForm = document.getElementById('availabilityForm');
  const availabilityConfirmation = document.getElementById('availabilityConfirmation');

  // Load all appointments
  async function loadAppointments() {
    try {
      const res = await fetch('/api/book');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const appointments = await res.json();

      if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p>No appointments found.</p>';
        return;
      }

      appointmentsList.innerHTML = '';
      appointments.forEach(appointment => {
        const div = document.createElement('div');
        div.className = 'p-4 border rounded-lg flex justify-between items-center';

        div.innerHTML = `
          <div>
            <p><strong>${appointment.name}</strong> — ${appointment.service}</p>
            <p>${appointment.date} @ ${appointment.time}</p>
            <p>${appointment.email} | ${appointment.phone}</p>
            <p>Status: ${appointment.completed ? 'Completed' : 'Pending'}</p>
          </div>
          <div class="space-x-2">
            <button data-id="${appointment._id}" class="complete-btn bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Mark Complete</button>
            <button data-id="${appointment._id}" class="delete-btn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
          </div>
        `;

        appointmentsList.appendChild(div);
      });

      // Add event listeners for buttons
      document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          try {
            const res = await fetch(`/api/book/${id}/complete`, { method: 'PATCH' });
            if (!res.ok) throw new Error('Failed to update');
            loadAppointments();
          } catch (err) {
            alert('Error marking complete');
            console.error(err);
          }
        });
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (!confirm('Are you sure you want to delete this appointment?')) return;
          try {
            const res = await fetch(`/api/book/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            loadAppointments();
          } catch (err) {
            alert('Error deleting appointment');
            console.error(err);
          }
        });
      });

    } catch (err) {
      appointmentsList.innerHTML = '<p>Error loading appointments.</p>';
      console.error(err);
    }
  }

  loadAppointments();

  // Handle adding availability
  // ... inside initAdminPage()

availabilityForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const date = availabilityForm.availableDate.value;
  const time = availabilityForm.availableTime.value;

  try {
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, times: [time] }),  // wrap single time in array
    });
    if (!res.ok) throw new Error('Failed to add availability');
    availabilityForm.reset();
    availabilityConfirmation.classList.remove('hidden');
    setTimeout(() => availabilityConfirmation.classList.add('hidden'), 4000);
  } catch (err) {
    alert('Failed to add availability.');
    console.error(err);
  }
});

}
