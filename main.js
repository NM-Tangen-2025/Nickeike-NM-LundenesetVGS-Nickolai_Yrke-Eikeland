const apiBaseUrl = "https://fortunate-bear-715099df12.strapiapp.com/api";
const apiKey = "1330d7d0a7e52fbcf4779861a6948373dff5f06b8bbce4cc0d08025276bb45ce3114590200d5b3cb7d0a856325f55c71e170fc2f2e4508102712e4730fbfb075c745056641f618bee2e54bf7ccdb1a56c6c4e89d60ef7c25f728198bde97d7e4cfbb773f63336580c64084350f57ffba8a15e289b1016cbe4df256bc2928bd50";

// Funksjon for å fjerne uønskede tegn som ### og **
function cleanText(text) {
    return text.replace(/[#*]+/g, "").trim(); // Fjerner alle # og * og trimmer teksten
}

// Oppdatert fetchNews-funksjon
async function fetchNews() {
    try {
        const response = await fetch(`${apiBaseUrl}/Nyhetsartikler?populate=*`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        const data = await response.json();
        console.log("Nyhetsartikler API-respons:", data); // Logg hele responsen

        const newsContainer = document.getElementById("news-container");

        if (!data.data || !Array.isArray(data.data)) {
            console.error("Feil: Ingen nyhetsartikler funnet!", data);
            newsContainer.innerHTML = "<p>Ingen nyhetsartikler tilgjengelig.</p>";
            return;
        }

        data.data.forEach(article => {
            const title = cleanText(article.Tittel ?? "Ukjent tittel");
            const ingress = cleanText(article.Ingress ?? "Ingen ingress tilgjengelig");
            const date = new Date(article.Dato).toLocaleDateString("no-NO", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
            const content = cleanText(article.Innhold ?? "Ingen innhold tilgjengelig.");
            const imageUrl = article.Bilde?.formats?.medium?.url ?? 
                             article.Bilde?.url ?? 
                             "https://via.placeholder.com/300";

            const articleElement = document.createElement("div");
            articleElement.classList.add("article");
            articleElement.innerHTML = `
                <h3>${title}</h3>
                <p><strong>Dato:</strong> ${date}</p>
                <p>${ingress}</p>
                <img src="${imageUrl}" alt="${title}" width="300">
                <p>${content}</p>
            `;
            newsContainer.appendChild(articleElement);
        });
    } catch (error) {
        console.error("Feil ved henting av nyhetsartikler:", error);
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "<p>Kunne ikke laste nyhetsartikler.</p>";
    }
}

// Funksjon for å hente og vise arrangementer
async function fetchEvents() {
    try {
        const response = await fetch(`${apiBaseUrl}/Arrangementer?populate=*`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        const data = await response.json();
        console.log("Arrangementer API-respons:", data); // Logg hele responsen

        const eventsContainer = document.getElementById("events-container");

        if (!data.data || !Array.isArray(data.data)) {
            console.error("Feil: Ingen arrangementer funnet!", data);
            return;
        }

        data.data.forEach(event => {
            const type = event.Type ?? "Ukjent type";
            const title = event.Tittel ?? "Ukjent tittel";
            const tidspunkt = event.Tidspunkt ?? "Ukjent tidspunkt";
            const imageUrl = event.Bilde?.url ?? "https://via.placeholder.com/300"; // Standardbilde hvis `Bilde` er null

            const formattedTime = new Date(tidspunkt).toLocaleString("no-NO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false // Bruk 24-timers format
            });

            const eventElement = document.createElement("div");
            eventElement.innerHTML = `
                <h3>${title}</h3>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Tidspunkt:</strong> ${formattedTime}</p>
                <img src="${imageUrl}" alt="${title}" width="300">
            `;
            eventsContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error("Feil ved henting av arrangementer:", error);
    }
}

// Oppdatert fetchMap-funksjon
async function fetchMap() {
    try {
        const response = await fetch(`${apiBaseUrl}/Lokasjoner?populate=*`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        const data = await response.json();
        console.log("Lokasjoner API-respons:", data); // Logg hele responsen

        if (!data.data || !Array.isArray(data.data)) {
            console.error("Feil: Ingen lokasjoner funnet!", data);
            return;
        }

        // Initialiser Leaflet-kartet
        const map = L.map('map-container').setView([58.14455742654124, 8.00331894316615], 13); // Senter på første lokasjon

        // Legg til OpenStreetMap-fliser
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Legg til markører for hver lokasjon
        data.data.forEach(location => {
            const name = location.Navn ?? "Ukjent navn";
            const latitude = parseFloat(location.Posisjon?.Breddegrad);
            const longitude = parseFloat(location.Posisjon?.Lengdegrad);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(`<h3>${name}</h3><p>Posisjon: ${latitude}, ${longitude}</p>`);
            }
        });
    } catch (error) {
        console.error("Feil ved henting av kartdata:", error);
    }
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// Kallar på alle funksjonane når nettsida lastast inn
document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
    fetchEvents();
    fetchMap();
});

