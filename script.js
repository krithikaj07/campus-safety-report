// script.js - Complete Campus Safety Report System

import { db, collection, addDoc, onSnapshot, getDocs } from './firebase-setup.js';

// Initialize the app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Load emergency contacts
    const emergencyContacts = {
        "Campus Police": "555-1234",
        "Health Center": "555-5678",
        "Counseling Services": "555-9012",
        "Emergency": "911"
    };
    
    const contactsList = document.getElementById('emergency-contacts');
    for (const [name, number] of Object.entries(emergencyContacts)) {
        const li = document.createElement('li');
        li.textContent = `${name}: ${number}`;
        contactsList.appendChild(li);
    }

    // Modal functionality
    const modal = document.getElementById("emergency-modal");
    const btn = document.getElementById("emergency-btn");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Load incidents
    loadIncidents();
    setupRealTimeListeners();

    // Set up geofencing
    setupGeofencing();
});

// Sample campus events data (replace with your actual data source)
const campusEvents = [
    { name: "Football Game", lat: 34.0522, lng: -118.2437, time: "2024-05-15T19:00" },
    { name: "Concert", lat: 34.0532, lng: -118.2427, time: "2024-05-16T20:00" }
];

async function loadIncidents() {
    const incidentsList = document.getElementById("incidents-list");
    incidentsList.innerHTML = ""; // Clear old data

    const querySnapshot = await getDocs(collection(db, "incidents"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${data.type}</strong><br>
            ${data.location ? '📍 ' + data.location : ''}
            ${data.time ? '⏰ ' + formatTime(data.time) : ''}
            ${data.details ? '<br>ℹ️ ' + data.details : ''}
        `;
        incidentsList.appendChild(listItem);
    });
}

function setupRealTimeListeners() {
    // Listen for new incidents in real-time
    onSnapshot(collection(db, "incidents"), (snapshot) => {
        const alertsContainer = document.getElementById('alerts-container');
        alertsContainer.innerHTML = '';
        
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const data = change.doc.data();
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert';
                alertDiv.innerHTML = `
                    <strong>${data.type}</strong> reported<br>
                    ${data.location ? '📍 ' + data.location : ''}
                    ${data.time ? '⏰ ' + formatTime(data.time) : ''}
                `;
                alertsContainer.prepend(alertDiv);
                
                // Check if this alert is near user
                checkProximityAlert(data);
            }
        });
    });
}

function setupGeofencing() {
    // Check every 5 minutes if user is near events
    setInterval(checkNearbyEvents, 300000);
    checkNearbyEvents(); // Run immediately
}

function checkNearbyEvents() {
    if (!navigator.geolocation) {
        document.getElementById('events-container').innerHTML = 
            '<p>Geolocation not supported by your browser.</p>';
        return;
    }
    
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const nearbyEvents = campusEvents.filter(event => {
            return getDistance(userLat, userLng, event.lat, event.lng) < 2; // 2 miles
        });
        
        displayNearbyEvents(nearbyEvents);
        
        // Show safety tips based on location
        showSafetyTips(userLat, userLng);
    }, () => {
        document.getElementById('events-container').innerHTML = 
            '<p>Location access denied. Enable location for event alerts.</p>';
    });
}

function displayNearbyEvents(events) {
    const container = document.getElementById('events-container');
    if (events.length === 0) {
        container.innerHTML = '<p>No nearby campus events</p>';
        return;
    }
    
    container.innerHTML = '<h3>You are near these events:</h3>';
    events.forEach(event => {
        const div = document.createElement('div');
        div.className = 'event';
        div.innerHTML = `
            <strong>${event.name}</strong><br>
            Time: ${formatTime(event.time)}
        `;
        container.appendChild(div);
    });
}

function showSafetyTips(lat, lng) {
    const tipsContainer = document.getElementById('tips-container');
    const tips = getLocationSpecificTips(lat, lng);
    
    tipsContainer.innerHTML = '<h3>Safety Tips:</h3>';
    tips.forEach(tip => {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'tip';
        tipDiv.innerHTML = `✅ ${tip}`;
        tipsContainer.appendChild(tipDiv);
    });
}

function getLocationSpecificTips(lat, lng) {
    // This would be more sophisticated in a real implementation
    const generalTips = [
        "Stay in well-lit areas at night",
        "Keep valuables out of sight",
        "Be aware of your surroundings",
        "Use the buddy system when possible"
    ];
    
    // Example of location-specific tips
    const libraryTips = [
        "Don't leave belongings unattended",
        "Use lockers for valuable items",
        "Report suspicious behavior to staff"
    ];
    
    // In a real app, you'd check actual campus locations
    return generalTips.concat(libraryTips);
}

function checkProximityAlert(incident) {
    if (!navigator.geolocation || !incident.latitude || !incident.longitude) return;
    
    navigator.geolocation.getCurrentPosition(position => {
        const distance = getDistance(
            position.coords.latitude,
            position.coords.longitude,
            incident.latitude,
            incident.longitude
        );
        
        if (distance < 0.5) { // Within 0.5 miles
            showProximityWarning(incident, distance);
        }
    });
}

function showProximityWarning(incident, distance) {
    const warning = confirm(
        `⚠️ Safety Alert! A ${incident.type} was reported ${distance.toFixed(2)} miles away.\n\n` +
        `Do you want to see safety tips for this area?`
    );
    
    if (warning) {
        showSafetyTips(incident.latitude, incident.longitude);
    }
}

// Incident reporting with geolocation
document.getElementById("reportForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const location = document.getElementById("location").value;
    const details = document.getElementById("details").value;

    if (!navigator.geolocation) {
        alert("Geolocation is required to report incidents.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const timestamp = new Date();

        try {
            await addDoc(collection(db, "incidents"), {
                type,
                location,
                details,
                latitude,
                longitude,
                time: timestamp.toISOString()
            });

            document.getElementById("report-status").style.display = "block";
            setTimeout(() => {
                document.getElementById("report-status").style.display = "none";
            }, 3000);

            loadIncidents();
        } catch (error) {
            console.error("Error reporting incident: ", error);
            alert("Failed to report incident.");
        }

        e.target.reset();
    }, () => {
        alert("You must allow location access to report incidents.");
    });
});

// Helper functions
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}
