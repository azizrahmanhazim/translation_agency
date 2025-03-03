document.getElementById("language-search").addEventListener("keyup", function () {
    let searchValue = this.value.toLowerCase();
    let languageItems = document.querySelectorAll(".language-item");

    languageItems.forEach(function (item) {
        let languageName = item.querySelector(".language-name").textContent.toLowerCase();

        if (languageName.includes(searchValue)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});
