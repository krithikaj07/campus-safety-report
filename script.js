// script.js
import { db, collection, addDoc } from './firebase-setup.js';

document.getElementById("reportForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const type = document.getElementById("type").value;

  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const timestamp = new Date();

    try {
      await addDoc(collection(db, "incidents"), {
        type,
        latitude,
        longitude,
        time: timestamp.toISOString()
      });

      alert("Incident reported successfully!");
    } catch (e) {
      alert("Error saving report.");
      console.error(e);
    }
  });
});