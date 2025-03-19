document.addEventListener("DOMContentLoaded", function() {
    const ctaSection = document.querySelector(".cta-section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ctaSection.classList.add("visible");
            }
        });
    }, { threshold: 0.5 });

    observer.observe(ctaSection);
});
