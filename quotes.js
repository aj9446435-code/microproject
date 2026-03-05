// 4.1 Quote Data Management - Multiple quotes with categories
const quoteList = [
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "motivation" },
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill", category: "success" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "motivation" },
    { text: "Great things never come from comfort zones.", author: "Anonymous", category: "growth" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown", category: "inspiration" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "success" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "perseverance" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "inspiration" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "resilience" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "action" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "perseverance" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "innovation" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "growth" }
];

let previousIndex = -1;
let currentQuote = null;
let quotesGenerated = 0;
let quoteHistory = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
let selectedCategory = "all";

// 4.2 Quote Generation Logic - Smooth UI transitions
function showQuote() {
    // 8.1 Error Handling - Validate quote list
    if (!quoteList || quoteList.length === 0) {
        document.getElementById("quoteText").textContent = "No quotes available.";
        document.getElementById("quoteAuthor").textContent = "";
        return;
    }

    let index;
    // Prevent consecutive duplicate quotes
    do {
        index = Math.floor(Math.random() * quoteList.length);
    } while (index === previousIndex && quoteList.length > 1);

    previousIndex = index;
    currentQuote = quoteList[index];

    // 7.1 Input Safety - Use textContent to prevent script injection
    const quoteText = document.getElementById("quoteText");
    const quoteAuthor = document.getElementById("quoteAuthor");
    
    // Add fade-out effect
    quoteText.style.opacity = "0";
    quoteAuthor.style.opacity = "0";
    
    setTimeout(() => {
        quoteText.textContent = `"${currentQuote.text}"`;
        quoteAuthor.textContent = `- ${currentQuote.author}`;
        quoteText.style.opacity = "1";
        quoteAuthor.style.opacity = "1";
    }, 300);
}

// 4.3 Copy Quote functionality
function copyQuote() {
    if (!currentQuote) {
        alert("Please generate a quote first!");
        return;
    }
    
    const quoteText = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    // Use modern Clipboard API with fallback
    if (navigator.clipboard) {
        navigator.clipboard.writeText(quoteText)
            .then(() => {
                showFeedback("Quote copied to clipboard!");
            })
            .catch(() => {
                fallbackCopy(quoteText);
            });
    } else {
        fallbackCopy(quoteText);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
        showFeedback("Quote copied to clipboard!");
    } catch (err) {
        showFeedback("Failed to copy quote.");
    }
    document.body.removeChild(textarea);
}

// 4.3 Share Quote functionality
function shareQuote() {
    if (!currentQuote) {
        alert("Please generate a quote first!");
        return;
    }
    
    const quoteText = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    // Use native Share API if available
    if (navigator.share) {
        navigator.share({
            title: "Random Quote",
            text: quoteText
        }).catch(() => {
            showFeedback("Share cancelled.");
        });
    } else {
        // Fallback: Copy to clipboard
        copyQuote();
    }
}

// User feedback mechanism
function showFeedback(message) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = message;
    feedback.style.display = "block";
    
    setTimeout(() => {
        feedback.style.display = "none";
    }, 2000);
}

// Initialize on page load
window.addEventListener("load", () => {
    initializeApp();
});

// Advanced Feature: Initialize application
function initializeApp() {
    applyTheme();
    populateCategoryFilter();
    showQuote();
    updateStats();
}

// Advanced Feature: Dark Mode Toggle
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    applyTheme();
}

function applyTheme() {
    const body = document.body;
    const toggleBtn = document.getElementById("darkModeToggle");
    
    if (darkMode) {
        body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️ Light";
    } else {
        body.classList.remove("dark-mode");
        toggleBtn.textContent = "🌙 Dark";
    }
}

// Advanced Feature: Category Filter
function populateCategoryFilter() {
    const categories = ["all", ...new Set(quoteList.map(q => q.category))];
    const filterSelect = document.getElementById("categoryFilter");
    filterSelect.innerHTML = "";
    
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        filterSelect.appendChild(option);
    });
}

function filterByCategory(category) {
    selectedCategory = category;
    showQuote();
}

// Advanced Feature: Get filtered quotes
function getFilteredQuotes() {
    if (selectedCategory === "all") {
        return quoteList;
    }
    return quoteList.filter(q => q.category === selectedCategory);
}

// Advanced Feature: Search quotes
function searchQuotes() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    if (searchTerm.trim() === "") {
        alert("Please enter a search term");
        return;
    }
    
    const results = quoteList.filter(q => 
        q.text.toLowerCase().includes(searchTerm) ||
        q.author.toLowerCase().includes(searchTerm)
    );
    
    if (results.length === 0) {
        alert("No quotes found matching your search");
        return;
    }
    
    const randomQuote = results[Math.floor(Math.random() * results.length)];
    displayQuote(randomQuote);
}

// Advanced Feature: Add to favorites
function addToFavorite() {
    if (!currentQuote) {
        alert("Please generate a quote first!");
        return;
    }
    
    const isFavorited = favorites.some(fav => fav.text === currentQuote.text);
    
    if (isFavorited) {
        favorites = favorites.filter(fav => fav.text !== currentQuote.text);
        showFeedback("Removed from favorites");
    } else {
        favorites.push(currentQuote);
        showFeedback("Added to favorites! ❤️");
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const favBtn = document.getElementById("favoriteBtn");
    const isFavorited = favorites.some(fav => fav.text === currentQuote.text);

    if (isFavorited) {
        favBtn.textContent = "❌ Remove Favorite";
        favBtn.style.background = "#ff6b6b";
    } else {
        favBtn.textContent = "🤍 Favorite";
        favBtn.style.background = "#6c757d";
    }
}

// Advanced Feature: View favorites modal
function showFavorites() {
    if (favorites.length === 0) {
        alert("No favorite quotes yet!");
        return;
    }
    
    const modal = document.getElementById("favoritesModal");
    const favoritesList = document.getElementById("favoritesList");
    favoritesList.innerHTML = "";
    
    favorites.forEach((fav, index) => {
        const item = document.createElement("div");
        item.className = "favorite-item";
        item.innerHTML = `
            <p><strong>${fav.text}</strong></p>
            <p>- ${fav.author}</p>
            <button onclick="removeFavorite(${index})" class="remove-btn">Remove</button>
        `;
        favoritesList.appendChild(item);
    });
    
    modal.style.display = "block";
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showFavorites();
}

function closeFavoritesModal() {
    document.getElementById("favoritesModal").style.display = "none";
}

// Advanced Feature: Quote Statistics
function updateStats() {
    document.getElementById("statsCount").textContent = quotesGenerated;
    document.getElementById("favoriteCount").textContent = favorites.length;
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    
    quoteHistory.slice(-5).reverse().forEach(quote => {
        const item = document.createElement("div");
        item.className = "history-item";
        item.innerHTML = `<p>"${quote.text}" - ${quote.author}</p>`;
        historyList.appendChild(item);
    });
}

function showHistory() {
    const modal = document.getElementById("historyModal");
    updateHistoryDisplay();
    modal.style.display = "block";
}

function closeHistoryModal() {
    document.getElementById("historyModal").style.display = "none";
}

// Override showQuote function
function showQuote() {
    const filteredQuotes = getFilteredQuotes();
    
    if (!filteredQuotes || filteredQuotes.length === 0) {
        document.getElementById("quoteText").textContent = "No quotes available in this category.";
        document.getElementById("quoteAuthor").textContent = "";
        return;
    }

    let index;
    do {
        index = Math.floor(Math.random() * filteredQuotes.length);
    } while (index === previousIndex && filteredQuotes.length > 1);

    previousIndex = index;
    displayQuote(filteredQuotes[index]);
}

function displayQuote(quote) {
    currentQuote = quote;
    quotesGenerated++;
    quoteHistory.push(quote);
    
    const quoteText = document.getElementById("quoteText");
    const quoteAuthor = document.getElementById("quoteAuthor");
    
    quoteText.style.opacity = "0";
    quoteAuthor.style.opacity = "0";
    
    setTimeout(() => {
        quoteText.textContent = `"${currentQuote.text}"`;
        quoteAuthor.textContent = `- ${currentQuote.author}`;
        quoteText.style.opacity = "1";
        quoteAuthor.style.opacity = "1";
    }, 300);
    
    updateFavoriteButton();
    updateStats();
}
