// ============================================================================
//  UTILITY FUNCTIONS
// ============================================================================
function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

function formatPrice(num) {
    return `$${num.toLocaleString()} APB Cash`;
}

// ============================================================================
//  FEATURED PROPERTIES (HOME PAGE)
// ============================================================================
function getRandomFeatured(count = 3) {
    const shuffled = [...window.APB_PROPERTIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function renderFeatured() {
    const container = document.querySelector(".featured-grid");
    if (!container) return;

    const featured = getRandomFeatured(3);

    container.innerHTML = featured.map(p => `
        <div class="featured-card">
            <img src="${p.images[0]}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${formatPrice(p.price)}</p>
            <a href="property.html?id=${p.id}" class="btn">View</a>
        </div>
    `).join("");
}

// ============================================================================
//  LISTINGS PAGE — FILTERS + RENDERING
// ============================================================================
function setupListingFilters() {
    const grid = document.querySelector(".property-grid");
    if (!grid) return;

    const searchInput = document.querySelector("[data-filter='search']");
    const priceFilter = document.querySelector("[data-filter='price']");
    const bedroomFilter = document.querySelector("[data-filter='bedrooms']");
    const areaFilter = document.querySelector("[data-filter='area']");
    const filterButton = document.querySelector(".search-container button");

    function applyFilters() {
        const term = searchInput.value.toLowerCase();
        const price = priceFilter.value;
        const beds = bedroomFilter.value;
        const area = areaFilter.value;

        const filtered = window.APB_PROPERTIES.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(term) ||
                p.area.toLowerCase().includes(term) ||
                p.district.toLowerCase().includes(term);

            const matchesPrice =
                price === "any" ||
                (price === "under200" && p.price < 200000) ||
                (price === "200to500" && p.price >= 200000 && p.price <= 500000) ||
                (price === "over500" && p.price > 500000);

            const matchesBeds =
                beds === "any" ||
                (beds === "1" && p.bedrooms === 1) ||
                (beds === "2" && p.bedrooms === 2) ||
                (beds === "3plus" && p.bedrooms >= 3);

            const matchesArea =
                area === "any" || p.area === area;

            return matchesSearch && matchesPrice && matchesBeds && matchesArea;
        });

        renderListings(filtered);
    }

    filterButton.addEventListener("click", applyFilters);
    searchInput.addEventListener("input", applyFilters);

    renderListings(window.APB_PROPERTIES);
}

function renderListings(list) {
    const grid = document.querySelector(".property-grid");
    if (!grid) return;

    grid.innerHTML = list.map(p => `
        <div class="property-card">
            <img src="${p.images[0]}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${formatPrice(p.price)}</p>
            <p>${p.bedrooms} Bed • ${p.bathrooms} Bath</p>
            <a href="property.html?id=${p.id}" class="btn">View Details</a>
        </div>
    `).join("");
}

// ============================================================================
//  PROPERTY DETAILS PAGE — GALLERY + LIGHTBOX
// ============================================================================
function renderPropertyDetails() {
    const wrapper = document.querySelector(".property-details");
    if (!wrapper) return;

    const id = getQueryParam("id");
    const property = window.APB_PROPERTIES.find(p => p.id === id);
    if (!property) return;

    const tagClass = property.area === "Los Santos" ? "ls" : "bc";

    const gallery = property.images
        .map(img => `<img src="${img}" class="detail-image" data-full="${img}">`)
        .join("");

    wrapper.innerHTML = `
        <div class="image-gallery">${gallery}</div>

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

        <span class="detail-tag ${tagClass}">${property.area}</span>
    `;

    setupLightbox();
}

function setupLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    document.querySelectorAll(".detail-image").forEach(img => {
        img.addEventListener("click", () => {
            lightbox.classList.add("active");
            lightboxImg.src = img.dataset.full;
        });
    });

    lightbox.addEventListener("click", () => {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            lightbox.classList.remove("active");
            lightboxImg.src = "";
        }
    });
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

// ============================================================================
//  MASTER INITIALIZER
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    setupListingFilters();
    setupHomeSearchRedirect();
    prefillSearchFromQuery();

    waitForProperties(renderPropertyDetails);
});

function waitForProperties(callback) {
    if (window.APB_PROPERTIES && Array.isArray(window.APB_PROPERTIES)) {
        callback();
    } else {
        setTimeout(() => waitForProperties(callback), 50);
    }
}


waitForProperties(renderPropertyDetails);

    setupHomeSearchRedirect();
    prefillSearchFromQuery();
});


