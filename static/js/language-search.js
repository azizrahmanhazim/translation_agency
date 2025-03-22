function searchLanguages() {
    const searchTerm = document.getElementById('languageSearch').value.toLowerCase();
    const languageCards = document.querySelectorAll('.language-card');

    languageCards.forEach(card => {
        const languageName = card.querySelector('.language-name').textContent.toLowerCase();
        if (languageName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}