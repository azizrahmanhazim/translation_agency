document.addEventListener("DOMContentLoaded", function() {
    const sentences = [
        {
            english: "Welcome to our Translation Services",
            translated: "مرحباً بكم في خدمات الترجمة لدينا" // Arabic
        },
        {
            english: "Quality Translations Tailored for Your Needs",
            translated: "ستاسو د اړتیاوو سره سمه باکيفيته ژباړه" // Pashto
        },
        {
            english: "Experience the Best Translation Services with Us",
            translated: "ہمارے ساتھ ترجمہ کی بہترین خدمات کا تجربہ کریں" // Urdu
        },

        {
            english: "Fast, Reliable, and Precise Translation Services",
            translated: "خدمات ترجمه سریع، قابل اعتماد و دقیق" // Persian
        }
    ];

    let sentenceIndex = 0;
    let wordIndex = 0;
    let englishWords = [];
    let translatedWords = [];
    let isDeleting = false;
    let isEnglishTyping = true; // ✅ Controls whether English or translation is typing
    let typingSpeed = 200;  // Word typing speed
    let pauseTime = 1000;   // Pause after full sentence

    function typeSentence() {
        let englishTextElement = document.getElementById("english-text");
        let translatedTextElement = document.getElementById("translated-text");

        if (isEnglishTyping && wordIndex < englishWords.length) {
            // ✅ Type English first
            englishTextElement.innerHTML = englishWords.slice(0, wordIndex + 1).join(" ");
            wordIndex++;
            setTimeout(typeSentence, typingSpeed);
        } else if (isEnglishTyping) {
            // ✅ After English is typed, wait before typing translation
            isEnglishTyping = false;
            wordIndex = 0;
            setTimeout(typeSentence, pauseTime);
        } else if (!isDeleting && wordIndex < translatedWords.length) {
            // ✅ Type translation after English
            translatedTextElement.innerHTML = translatedWords.slice(0, wordIndex + 1).join(" ");
            wordIndex++;
            setTimeout(typeSentence, typingSpeed);
        } else if (!isDeleting) {
            setTimeout(() => { isDeleting = true; typeSentence(); }, pauseTime);
        } else if (isDeleting && wordIndex > 0) {
            // ✅ Delete both English and translation at the same time
            englishTextElement.innerHTML = englishWords.slice(0, wordIndex - 1).join(" ");
            translatedTextElement.innerHTML = translatedWords.slice(0, wordIndex - 1).join(" ");
            wordIndex--;
            setTimeout(typeSentence, 100);
        } else {
            isDeleting = false;
            isEnglishTyping = true;
            wordIndex = 0;
            sentenceIndex = (sentenceIndex + 1) % sentences.length;
            englishWords = sentences[sentenceIndex].english.split(" ");
            translatedWords = sentences[sentenceIndex].translated.split(" ");

            setTimeout(typeSentence, 500);
        }
    }

    function startTyping() {
        englishWords = sentences[sentenceIndex].english.split(" ");
        translatedWords = sentences[sentenceIndex].translated.split(" ");
        typeSentence();
    }

    startTyping();
});
