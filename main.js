// ============================================================================
// APB HOUSING — MAIN JS (MAP-FREE CLEAN VERSION)
// ============================================================================

// ---------------------------------------------------------
// UTILITY HELPERS
// ---------------------------------------------------------
function formatPrice(value) {
    return "$" + value.toLocaleString() + " APB Cash";
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// ============================================================================
//  FEATURED PROPERTIES (HOME PAGE)
// ============================================================================
function renderFeatured() {
    const container = document.getElementById("featured-properties");
    if (!container || !window.APB_PROPERTIES) return;

    const featured = getRandomFeatured(3);

    featured.forEach(p => {
        const tagClass = p.area === "Los Santos" ? "ls" : "bc";

        const card = document.createElement("a");
        card.href = "property.html?id=" + encodeURIComponent(p.id);
        card.className = "property-card";

        card.innerHTML = `
            <span class="property-tag ${tagClass}">${p.area}</span>
            <img src="${p.images[0]}" alt="">
            <div class="property-info">
                <h3>${p.name}</h3>
                <div class="price">$${p.price.toLocaleString()} APB Cash</div>
<div class="details">
    ${p.bedrooms} Bed • 
    ${p.bathrooms} Bath • 
    ${p.office ? `${p.office} Office${p.office > 1 ? 's' : ''} • ` : ""} 
    ${p.district}
</div>
			${p.status === "sold" ? `<div class="status-badge sold">SOLD</div>` : ""}
            ${p.status === "unavailable" ? `<div class="status-badge unavailable">Comming Soon!</div>` : ""}
			${p.status === "available" ? `<div class="status-badge available">Available</div>` : ""}
        `;

        container.appendChild(card);
    });
}

// ============================================================================
//  LISTINGS PAGE
// ============================================================================
function renderListings() {
    const container = document.querySelector(".property-grid");
    if (!container || !window.APB_PROPERTIES) return;

    const searchInput = document.querySelector("[data-filter='search']");
    const priceSelect = document.querySelector("[data-filter='price']");
    const bedsSelect = document.querySelector("[data-filter='bedrooms']");
    const areaSelect = document.querySelector("[data-filter='area']");

    let filtered = [...window.APB_PROPERTIES];

    // Search
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.district.toLowerCase().includes(searchTerm) ||
            p.area.toLowerCase().includes(searchTerm)
        );
    }

    // Price filter
    if (priceSelect && priceSelect.value !== "any") {
        const val = priceSelect.value;
        filtered = filtered.filter(p => {
            if (val === "under200") return p.price < 200000;
            if (val === "200to500") return p.price >= 200000 && p.price <= 500000;
            if (val === "over500") return p.price > 500000;
            return true;
        });
    }

    // Bedrooms
    if (bedsSelect && bedsSelect.value !== "any") {
        const val = bedsSelect.value;
        filtered = filtered.filter(p => {
            if (val === "1") return p.bedrooms === 1;
            if (val === "2") return p.bedrooms === 2;
            if (val === "3plus") return p.bedrooms >= 3;
            return true;
        });
    }

    // Area
    if (areaSelect && areaSelect.value !== "any") {
        filtered = filtered.filter(p => p.area === areaSelect.value);
    }

    // Render
    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p style='color:#b0b0b0;'>No properties match your filters.</p>";
        return;
    }

filtered.forEach(p => {
    const tagClass = p.area === "Los Santos" ? "ls" : "bc";

    const card = document.createElement("a");
    card.href = "property.html?id=" + encodeURIComponent(p.id);
    card.className = "property-card";

    card.innerHTML = `
        <span class="property-tag ${tagClass}">${p.area}</span>
        <img src="${p.images[0]}" alt="">
        <div class="property-info">
            <h3>${p.name}</h3>
            <div class="price">${formatPrice(p.price)}</div>
            <div class="details">${p.bedrooms} Bed • ${p.bathrooms} Bath • ${p.district}</div>
        </div>
        ${p.status === "sold" ? `<div class="status-badge sold">SOLD</div>` : ""}
        ${p.status === "unavailable" ? `<div class="status-badge unavailable">Comming Soon!</div>` : ""}
        ${p.status === "available" ? `<div class="status-badge available">Available</div>` : ""}
    `;

    container.appendChild(card);
});
}

function setupListingFilters() {
    const filters = document.querySelectorAll("[data-filter]");
    if (!filters.length) return;

    filters.forEach(el => {
        el.addEventListener("input", renderListings);
        el.addEventListener("change", renderListings);
    });

    renderListings();
}

// ============================================================================
//  PROPERTY DETAILS PAGE
// ============================================================================
function renderPropertyDetails() {
    const wrapper = document.querySelector(".property-details");
    if (!wrapper) return;
function renderPropertyDetails() {
    const wrapper = document.querySelector(".property-details");
    if (!wrapper) return;

    const id = getQueryParam("id");
    const property = window.APB_PROPERTIES.find(p => p.id === id);

    if (!property) return;

    const tagClass = property.area === "Los Santos" ? "ls" : "bc";
	
const imageGallery = property.images
    .map(img => `<img src="${img}" class="detail-image">`)
    .join("");

wrapper.innerHTML = `
    <div class="image-gallery">
        ${imageGallery}
    </div>

    <h2>${property.name}</h2>
    <div class="price">${formatPrice(property.price)}</div>

   <div class="property-meta">
    <span><strong>Area:</strong> ${property.area}</span>
    <span><strong>District:</strong> ${property.district}</span>
    <span><strong>Bedrooms:</strong> ${property.bedrooms}</span>
    <span><strong>Bathrooms:</strong> ${property.bathrooms}</span>
    <span><strong>Office:</strong> ${property.office}</span>   <!-- NEW -->
    <span><strong>Parking:</strong> ${property.parking}</span>
</div>


    <p style="color:#b0b0b0;">${property.longDescription}</p>

    <span class="detail-tag ${tagClass}">
        ${property.area}
    </span>
`;

}
function getRandomFeatured(count = 3) {
    const shuffled = [...window.APB_PROPERTIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
function renderPropertyDetails() {
    const wrapper = document.querySelector(".property-details");
    if (!wrapper) return;

    const id = getQueryParam("id");
    const property = window.APB_PROPERTIES.find(p => p.id === id);

    if (!property) return;

    const tagClass = property.area === "Los Santos" ? "ls" : "bc";
	
const imageGallery = property.images
    .map(img => `<img src="${img}" class="detail-image">`)
    .join("");

wrapper.innerHTML = `
    <div class="image-gallery">
        ${imageGallery}
    </div>

    <h2>${property.name}</h2>
    <div class="price">${formatPrice(property.price)}</div>

    <div class="property-meta">
        <span><strong>Area:</strong> ${property.area}</span>
        <span><strong>District:</strong> ${property.district}</span>
        <span><strong>Bedrooms:</strong> ${property.bedrooms}</span>
        <span><strong>Bathrooms:</strong> ${property.bathrooms}</span>
		<span><strong>Office:</strong> ${property.office}</span> 
        <span><strong>Parking:</strong> ${property.parking}</span>
    </div>

    <p style="color:#b0b0b0;">${property.longDescription}</p>

    <span class="detail-tag ${tagClass}">
        ${property.area}
    </span>
`;

}
function getRandomFeatured(count = 3) {
    const shuffled = [...window.APB_PROPERTIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

    const id = getQueryParam("id");
    const property = window.APB_PROPERTIES.find(p => p.id === id);

    if (!property) return;

    const tagClass = property.area === "Los Santos" ? "ls" : "bc";
	
const imageGallery = property.images
    .map(img => `<img src="${img}" class="detail-image">`)
    .join("");

wrapper.innerHTML = `
    <div class="image-gallery">
        ${imageGallery}
    </div>

    <h2>${property.name}</h2>
    <div class="price">${formatPrice(property.price)}</div>

    <div class="property-meta">
        <span><strong>Area:</strong> ${property.area}</span>
        <span><strong>District:</strong> ${property.district}</span>
        <span><strong>Bedrooms:</strong> ${property.bedrooms}</span>
        <span><strong>Bathrooms:</strong> ${property.bathrooms}</span>
		<span><strong>Office:</strong> ${property.office}</span> 
        <span><strong>Parking:</strong> ${property.parking}</span>
    </div>

    <p style="color:#b0b0b0;">${property.longDescription}</p>

    <span class="detail-tag ${tagClass}">
        ${property.area}
    </span>
`;

}
function getRandomFeatured(count = 3) {
    const shuffled = [...window.APB_PROPERTIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ============================================================================
//  HOME SEARCH
// ============================================================================
function setupHomeSearchRedirect() {
    const input = document.querySelector("[data-home-search]");
    const button = document.querySelector("[data-home-search-button]");
    if (!input || !button) return;

    button.addEventListener("click", () => {
        const term = encodeURIComponent(input.value.trim());
        window.location.href = term ? `listings.html?search=${term}` : "listings.html";
    });
}

function prefillSearchFromQuery() {
    const searchParam = getQueryParam("search");
    const searchInput = document.querySelector("[data-filter='search']");
    if (searchParam && searchInput) {
        searchInput.value = decodeURIComponent(searchParam);
    }
}
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const property = properties.find(p => p.id === id);

if (property) {
    const container = document.getElementById("property-details");
    container.innerHTML = `
        <h2>${property.name}</h2>
        <img src="${property.images[0]}" alt="${property.name}">
        <p>${property.longDescription}</p>
        <p><strong>Price:</strong> $${property.price} APB Cash</p>
        <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
        <p><strong>Parking:</strong> ${property.parking}</p>
    `;
}

// ============================================================================
//  MASTER INITIALIZER — RUNS ON EVERY PAGE
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    setupListingFilters();
    renderPropertyDetails();
    setupAdminForm();
    setupHomeSearchRedirect();
    prefillSearchFromQuery();

});
