document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const carouselImages = document.querySelector('.carousel-images');
    const indicators = document.querySelectorAll('.indicator');
    let index = 0;
    const images = document.querySelectorAll('.carousel-images img');
    const totalImages = images.length;

    function updateCarousel() {
        const offset = -index * 100;
        carouselImages.style.transform = `translateX(${offset}%)`;

        // Actualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    prevButton.addEventListener('click', () => {
        index = (index > 0) ? index - 1 : totalImages - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        index = (index < totalImages - 1) ? index + 1 : 0;
        updateCarousel();
    });

    // Agregar funcionalidad de clic en los indicadores
    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            index = i;
            updateCarousel();
        });
    });
});



// IMAGENES PANTALLA COMPLETA

function openFullscreen(el) {
    const overlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    
    fullscreenImage.src = el.src; // Cambiar la imagen en el overlay
    overlay.classList.add('show'); // Mostrar el overlay con animación
}

function closeFullscreen() {
    const overlay = document.getElementById('fullscreenOverlay');
    overlay.classList.remove('show'); // Ocultar el overlay con animación
}
