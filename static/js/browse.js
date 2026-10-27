// Load approved items from Flask/SQLite

document.addEventListener("DOMContentLoaded", loadItems);

let approvedItems = [];

async function loadItems() {
    const lostContainer = document.getElementById("lost-items");
    const foundContainer = document.getElementById("found-items");

    lostContainer.innerHTML = "<p>Loading items...</p>";
    foundContainer.innerHTML = "";

    try {
        const response = await fetch("/api/items");
        if (!response.ok) throw new Error("Could not load items");

        const items = await response.json();
        approvedItems = items.filter(item => item.status === "Approved");
        renderItems(approvedItems);
    } catch (error) {
        console.error(error);
        lostContainer.innerHTML = "<p>Unable to load lost items. Please try again.</p>";
        foundContainer.innerHTML = "<p>Unable to load found items. Please try again.</p>";
    }
}

function renderItems(items) {
    const lostContainer = document.getElementById("lost-items");
    const foundContainer = document.getElementById("found-items");

    lostContainer.innerHTML = "";
    foundContainer.innerHTML = "";

    const lostItems = items.filter(item => item.type === "lost");
    const foundItems = items.filter(item => item.type === "found");

    lostItems.forEach(item => lostContainer.appendChild(createCard(item)));
    foundItems.forEach(item => foundContainer.appendChild(createCard(item)));

    if (lostItems.length === 0) {
        lostContainer.innerHTML = "<p>No approved lost items available.</p>";
    }

    if (foundItems.length === 0) {
        foundContainer.innerHTML = "<p>No approved found items available.</p>";
    }
}

function createCard(item) {
    const card = document.createElement("div");
    card.className = "item-card";

    const dateLabel = item.type === "lost" ? "Date Lost" : "Date Found";

    card.innerHTML = `
        <h3>${safeText(item.itemName)}</h3>
        <p><strong>Category:</strong> ${safeText(formatCategory(item.category))}</p>
        <p><strong>Location:</strong> ${safeText(item.location)}</p>
        <p><strong>${dateLabel}:</strong> ${safeText(item.date)}</p>
        <p><strong>Description:</strong> ${safeText(item.description)}</p>
        <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Approved</span></p>
        <button type="button" class="details-button">View Details</button>
    `;

    card.querySelector(".details-button").addEventListener("click", () => {
        viewDetails(
            item.itemName,
            formatCategory(item.category),
            item.location,
            item.date,
            item.description,
            item.contact
        );
    });

    return card;
}

function searchItems() {
    const search = document.getElementById("searchInput").value.toLowerCase().trim();
    const category = document.getElementById("categorySelect").value.toLowerCase();

    const filtered = approvedItems.filter(item => {
        const searchableText = [
            item.itemName,
            item.category,
            item.location,
            item.description
        ].join(" ").toLowerCase();

        const nameMatch = search === "" || searchableText.includes(search);
        const categoryMatch = category === "" || String(item.category).toLowerCase() === category;

        return nameMatch && categoryMatch;
    });

    renderItems(filtered);
}

function viewDetails(name, category, location, date, description, contact) {
    alert(
        "Item Details\n\n" +
        "Item: " + name + "\n" +
        "Category: " + category + "\n" +
        "Location: " + location + "\n" +
        "Date: " + date + "\n" +
        "Description: " + description + "\n" +
        "Contact: " + contact
    );
}

function formatCategory(category) {
    if (!category) return "Other";
    return String(category).charAt(0).toUpperCase() + String(category).slice(1);
}

function safeText(value) {
    const div = document.createElement("div");
    div.textContent = value || "";
    return div.innerHTML;
}

// Allow Enter in the search field to run the search.
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") searchItems();
        });
    }
});
