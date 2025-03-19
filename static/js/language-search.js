function searchLanguages() {
    let input = document.getElementById("languageSearch").value.toLowerCase();
    let cards = document.querySelectorAll(".language-card");

    cards.forEach(card => {
        let language = card.textContent.toLowerCase();
        if (language.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
