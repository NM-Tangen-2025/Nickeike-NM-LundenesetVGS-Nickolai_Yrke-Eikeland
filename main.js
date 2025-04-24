const apiBaseUrl = "https://fortunate-bear-715099df12.strapiapp.com/api";
const apiKey = "1330d7d0a7e52fbcf4779861a6948373dff5f06b8bbce4cc0d08025276bb45ce3114590200d5b3cb7d0a856325f55c71e170fc2f2e4508102712e4730fbfb075c745056641f618bee2e54bf7ccdb1a56c6c4e89d60ef7c25f728198bde97d7e4cfbb773f63336580c64084350f57ffba8a15e289b1016cbe4df256bc2928bd50";

// Funksjon for å hente og vise nyheitsartiklar
async function fetchNews() {
    try {
        const response = await fetch(`${apiBaseUrl}/Nyhetsartikler?populate=*`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        const data = await response.json();
        const newsContainer = document.getElementById("news-container");

        data.data.forEach(article => {
            const articleElement = document.createElement("div");
            articleElement.innerHTML = `
                <h3>${article.attributes.Tittel}</h3>
                <p>${article.attributes.Ingress}</p>
                <img src="${article.attributes.Bilde.url}" alt="${article.attributes.Tittel}" width="300">
            `;
            newsContainer.appendChild(articleElement);
        });
    } catch (error) {
        console.error("Feil ved henting av nyheitsartikler:", error);
    }
}

// Funksjon for å hente og vise arrangementer
async function fetchEvents() {
    try {
        const response = await fetch(`${apiBaseUrl}/Arrangementer?populate=*`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP-feil! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Sjekk strukturen på responsen

        if (!data.data) {
            console.error("Feil: Ingen arrangementer funnet!", data);
            return;
        }

        const eventsContainer = document.getElementById("events-container");
        
        data.data.forEach(event => {
            const eventElement = document.createElement("div");
            eventElement.innerHTML = `
                <h3>${event.attributes?.Tittel ?? "Ukjent tittel"}</h3>
                <p>${event.attributes?.Ingress ?? "Ingen ingress tilgjengelig"}</p>
                <p><strong>Dato:</strong> ${event.attributes?.Dato ?? "Ukjent dato"}</p>
                <img src="${event.attributes?.Bilde?.url ?? ""}" alt="${event.attributes?.Tittel ?? "Bilde"}" width="300">
            `;
            eventsContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error("Feil ved henting av arrangementer:", error);
    }
}

// Funksjon for å vise kart basert på lokasjonene frå API-et
async function fetchMap() {
    try {
        const response = await fetch(`${apiBaseUrl}/Lokasjoner?populate=*`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        const data = await response.json();
        const mapContainer = document.getElementById("map-container");

        data.data.forEach(location => {
            const locationElement = document.createElement("div");
            locationElement.innerHTML = `
                <h3>${location.attributes.Navn}</h3>
                <p>Posisjon: ${location.attributes.Posisjon.Breddegrad}, ${location.attributes.Posisjon.Lengdegrad}</p>
                <img src="${location.attributes.Bilde.url}" alt="${location.attributes.Navn}" width="300">
            `;
            mapContainer.appendChild(locationElement);
        });
    } catch (error) {
        console.error("Feil ved henting av kartdata:", error);
    }
}



// Kallar på alle funksjonane når nettsida lastast inn
document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
    fetchEvents();
    fetchMap();
});

