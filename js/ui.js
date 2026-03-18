/**
 * UI Decorator Script
 * This file handles visual enhancements (loading state & background color) 
 * strictly without modifying the main application logic in script.js.
 */
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const resultSection = document.getElementById("results");

    // 1. Loading State Interception
    // When search is clicked, display loader. The original fetchWeather function 
    // will clear this HTML out automatically when the data arrives via resultSection.innerHTML = ""
    searchBtn.addEventListener("click", () => {
        if (searchInput.value.trim() !== "") {
            resultSection.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Fetching weather data...</p>
                </div>
            `;
        }
    });

    // 2. DOM Observer for Output Styling Interception
    // Listens for when the original script.js adds the .weather-card to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                const addedNode = mutation.addedNodes[0];
                if (addedNode && addedNode.classList && addedNode.classList.contains("weather-card")) {
                    
                    // Extract temperature text (e.g., "Temperature: 28.5°C") to adjust theme
                    const tempNode = addedNode.querySelector("h2");
                    if (tempNode) {
                        const tempText = tempNode.textContent;
                        const match = tempText.match(/-?\d+(\.\d+)?/);
                        if (match) {
                            const temp = parseFloat(match[0]);
                            updateTheme(temp);
                        }
                    }
                    
                    // Decorate the card with an icon container that was requested
                    addWeatherIcon(addedNode);
                }
            }
        });
    });

    // Start observing the #results div for the weather card injected by script.js
    observer.observe(resultSection, { childList: true });

    /**
     * Updates the body classes based on the current parsed temperature.
     */
    function updateTheme(temp) {
        document.body.classList.remove("theme-cold", "theme-moderate", "theme-hot");
        if (temp < 15) {
            document.body.classList.add("theme-cold");
        } else if (temp <= 25) { // Adjusted up slightly to be 'moderate' until 25
            document.body.classList.add("theme-moderate");
        } else {
            document.body.classList.add("theme-hot");
        }
    }

    /**
     * Prepends a generic clean weather icon SVG to the given card
     */
    function addWeatherIcon(card) {
        const iconContainer = document.createElement("div");
        iconContainer.className = "weather-icon-container";
        iconContainer.innerHTML = `
            <svg class="weather-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="Mm4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
        `;
        card.insertBefore(iconContainer, card.firstChild);
    }

    // 4. Intercept window.alert to safely remove the loader if an error occurs 
    // (script.js uses alert("city not found"))
    const originalAlert = window.alert;
    window.alert = function (message) {
        if (resultSection && resultSection.querySelector(".loading-state")) {
            resultSection.innerHTML = `
                <div class="empty-state">
                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                     <circle cx="12" cy="12" r="10"></circle>
                     <line x1="12" y1="8" x2="12" y2="12"></line>
                     <line x1="12" y1="16" x2="12.01" y2="16"></line>
                   </svg>
                   <p>${message}</p>
                </div>
            `;
        }
        originalAlert(message);
    };
});
