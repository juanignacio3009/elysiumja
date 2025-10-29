const carousel = document.getElementById('carousel');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let currentIndex = 0;
let interval;
const imageCount = carousel.children.length;
const autoCarouselDelay = 3000; // Tiempo entre cambios automáticos
const manualOverrideDelay = 5000; // Tiempo antes de reiniciar el carrusel automático después de usar los botones

// Función para cambiar la imagen
function changeImage(index) {
    carousel.style.marginLeft = `-${index * 100}%`;
    currentIndex = index;
}

// Función para la siguiente imagen
function nextImage() {
    currentIndex = (currentIndex + 1) % imageCount;
    changeImage(currentIndex);
}

// Función para la imagen anterior
function prevImage() {
    currentIndex = (currentIndex - 1 + imageCount) % imageCount;
    changeImage(currentIndex);
}

// Iniciar el carrusel automático
function startAutoCarousel() {
    stopAutoCarousel(); // Asegúrate de detener cualquier intervalo anterior
    interval = setInterval(nextImage, autoCarouselDelay);
}

// Detener el carrusel automático
function stopAutoCarousel() {
    clearInterval(interval);
}

// Event listeners para los botones
next.addEventListener('click', () => {
    stopAutoCarousel();
    nextImage();
    setTimeout(startAutoCarousel, manualOverrideDelay); // Reiniciar el carrusel automático después de 5 segundos
});

prev.addEventListener('click', () => {
    stopAutoCarousel();
    prevImage();
    setTimeout(startAutoCarousel, manualOverrideDelay); // Reiniciar el carrusel automático después de 5 segundos
});

// Iniciar el carrusel automáticamente al cargar la página
startAutoCarousel();



// NUESTROS AROMAS

const secVariedades = document.querySelector('.sec_variedades');
const colorAromas = document.querySelectorAll('.color-aroma');
const tarjetaAromas = document.getElementById('tarjeta_aromas');
const packaging = document.querySelector('.packaging');
const titulo = document.querySelector('.titulo');
const subtitulo = document.querySelector('.subtitulo');

let selectedAroma = null;

// Mapa de imágenes de fondo con gradiente según el aroma
const aromaBackgrounds = {
    'rosa': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/rosa_bg.jpg?v=1726286393135)',       
    'ruda': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/ruda_bg.jpg?v=1725551104485)',       
    'manzanilla': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/manzanilla_bg.jpg?v=1725551104485)',  
    'citronela': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/citronela_bg.jpeg?v=1725551104485)',   
    'lavanda': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/lavanda_bg.jpg?v=1726286217441)',      
    'vainilla': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/vainilla_bg.jpg?v=1725551104485)',    
    'romero': 'url(https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/romero_bg.jpg?v=1725551104485)'       
};

colorAromas.forEach(element => {
    element.addEventListener('click', function() {
        const aroma = this.getAttribute('data-aroma');

        if (selectedAroma === aroma) {
            // Deseleccionar aroma
            this.classList.remove('selected');
            tarjetaAromas.src = `https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/tarjeta_aromas.png?v=1726285892568`;
            secVariedades.style.backgroundImage = ''; // Restablecer fondo predeterminado
            tarjetaAromas.classList.remove('transparent'); // Quitar transparencia
            packaging.classList.remove('transparent');
            titulo.style.color = ''; // Restaurar color original
            subtitulo.style.color = ''; // Restaurar color original
            selectedAroma = null;
        } else {
            // Seleccionar nuevo aroma
            colorAromas.forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            tarjetaAromas.src = `https://cdn.glitch.global/357c4ceb-367e-4cd0-a5e4-cb3de9b949c1/tarjeta_aromas_${aroma}.png?v=1726285635032`; 
            // Aplicar el gradiente con la imagen de fondo
            secVariedades.style.backgroundImage = `${aromaBackgrounds[aroma] || ''}`;
            tarjetaAromas.classList.add('transparent'); // Añadir transparencia
            packaging.classList.add('transparent');
            titulo.style.color = 'white'; // Cambiar color a blanco
            subtitulo.style.color = 'white'; // Cambiar color a blanco
            selectedAroma = aroma;
        }
    });
});


// Obtén el botón de scroll-to-top
const backToTopButton = document.querySelector('.back-to-top');

// Función para mostrar o ocultar el botón
function toggleBackToTopButton() {
    if (window.scrollY > 300) { // Cambia 300 por el valor que desees
        backToTopButton.style.display = 'inline-flex';
    } else {
        backToTopButton.style.display = 'none';
    }
}

// Llama a la función cuando la página se desplaza
window.addEventListener('scroll', toggleBackToTopButton);

// Añade el evento de clic al botón para volver al inicio
backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});



// CARRITO SYNC

document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cartButton');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeBtn = document.querySelector('.close');
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const cartCount = document.getElementById('cartCount');
    const cartItemCount = document.getElementById('cartItemCount');
    const proceedButton = document.getElementById('proceedButton');
  

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para actualizar el carrito
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let itemCount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            itemCount += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                 <img src="${item.image}" alt="${item.name}">
                <span class="nameq">${item.name}</span>
                <div class="quantity-controls">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <span class="precioq">$${itemTotal.toFixed(2)}</span>
                <button class="fa-solid fa-trash" id="remove" data-id="${item.id}"></button>

                <style>
                    .cart-item {
                        display: flex;
                        align-items: center;
                        gap: 3px;
                        font-size: 12px; 
                    }

                    .cart-item img {
                        width: 30px;
                        height: auto;
                    }

                    .nameq {
                        flex: 1;
                        font-size: 12px;
                    }

                    .quantity-controls {
                        display: flex;
                        align-items: center;
                    }

                    .quantity-controls input {
                        width: 30px;
                        text-align: center;
                        margin: 0 3px;
                        font-size: 12px;
                        min-width: 45px;
                        width: auto;
                    }

                    .increase,
                    .decrease {
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        font-size: 12px;
                    }

                    .increase {
                        margin-right: 10px;
                    }

                    .precioq {
                        font-size: 12px;
                        margin-left: auto;
                    }

                    #remove {
                        color: black;
                        background: none;
                        border: none;
                        padding: 3px 5px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-left: 3px;
                    }
                </style>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartCount.textContent = itemCount;
        cartItemCount.textContent = itemCount;
        proceedButton.disabled = cart.length === 0;
        addEventListenersToCartItems();
    }

    function addEventListenersToCartItems() {
        const increaseButtons = document.querySelectorAll('.increase');
        const decreaseButtons = document.querySelectorAll('.decrease');
        const removeButtons = document.querySelectorAll('#remove');

        increaseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                const product = cart.find(item => item.id === productId);
                product.quantity += 1;
                saveCart();
                updateCart();
            });
        });

        decreaseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                const product = cart.find(item => item.id === productId);
                if (product.quantity > 1) {
                    product.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
                saveCart();
                updateCart();
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                cart = cart.filter(item => item.id !== productId);
                saveCart();
                updateCart();
            });
        });
    }

    // Función para añadir productos al carrito
      function addProductToCart(id, name, price, image, quantity, category, categoryType) {
        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id, name, image, quantity, price, category, categoryType }); // Añadido categoryType
        }
    }
  
  function applyPromotions(subtotal) {
    let promoText = [];
    let totalDescuento = 0;

    // Contar sahumerios y portasahumerios en el carrito
    const sahumeriosCount = cart.filter(item => item.category === 'sahumerios').reduce((acc, item) => acc + item.quantity, 0);
    const portasahumeriosCount = cart.filter(item => item.category === 'portasahumerios');

    // Descuentos para sahumerios
    let descuentoSahumerios = 0;
    let promoSahumeriosText = [];

    const setsPromo2 = Math.floor(sahumeriosCount / 3);
    const remainingSahumeriosAfterPromo2 = sahumeriosCount - (setsPromo2 * 3);
    const setsPromo1 = Math.floor(remainingSahumeriosAfterPromo2 / 2);

    const descuentoPromo2 = setsPromo2 * 1500;
    const descuentoPromo1 = setsPromo1 * 500;

    if (setsPromo2 > 0) {
        descuentoSahumerios += descuentoPromo2;
        promoSahumeriosText.push(`Promo ${setsPromo2}x (3 Sahumerios): -$${descuentoPromo2.toFixed(0)}`);
    }
    if (setsPromo1 > 0) {
        descuentoSahumerios += descuentoPromo1;
        promoSahumeriosText.push(`Promo ${setsPromo1}x (2 Sahumerios): -$${descuentoPromo1.toFixed(0)}`);
    }

    // Descuentos para portasahumerios
    let descuentoPortasahumerios = 0;
    let promoPortasahumeriosText = [];

    // Solo se aplica una promoción de portasahumerios si hay al menos un sahumerio
    if (sahumeriosCount > 0) {
        const portaChico = portasahumeriosCount.find(item => item.categoryType === 'chico');
        const portaGrande = portasahumeriosCount.find(item => item.categoryType === 'grande');
        const portaElysium = portasahumeriosCount.find(item => item.categoryType === 'elysium');
        const portaCeramica = portasahumeriosCount.find(item => item.categoryType === 'cerámica');

        if (portaChico) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta chico
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Chico: -$500`);
        } else if (portaGrande) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta grande
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Grande: -$500`);
        } else if (portaElysium) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta elysium
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Elysium: -$500`);
        } else if (portaCeramica) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta cerámica
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Cerámica: -$500`);
        }
    }

    // Determinar el mejor descuento
    if (descuentoSahumerios > descuentoPortasahumerios) {
        totalDescuento = descuentoSahumerios;
        promoText = promoSahumeriosText;
    } else {
        totalDescuento = descuentoPortasahumerios;
        promoText = promoPortasahumeriosText;
    }

    // Asegurar que se muestren ambos tipos de promociones si hay sahumerios
    if (descuentoSahumerios > 0 && totalDescuento < descuentoSahumerios) {
        totalDescuento = descuentoSahumerios;
        promoText = promoSahumeriosText;
    }

    const total = (subtotal - totalDescuento);

    // Mostrar subtotal, descuento y total
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    totalElement.textContent = `Total: $${total.toFixed(2)}`;

  const discountElement = document.getElementById('discount-applied');
    if (totalDescuento > 0) {
    discountElement.innerHTML = promoText.map(text => `<span class="discount-text">${text}</span>`).join('<br/>'); // Muestra las promociones aplicadas con el nuevo estilo
} else {
    discountElement.innerHTML = '';
}
}

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Agregar evento para añadir productos al carrito
    const addCartButtons = document.querySelectorAll('.add-cart');
    addCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.card-product');
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.getAttribute('data-name');
            const productPrice = parseFloat(productCard.getAttribute('data-price'));
            const productImage = productCard.getAttribute('data-image');
            const category = productCard.getAttribute('data-category');
            const categoryType = productCard.getAttribute('data-categorytype');

            addProductToCart(productId, productName, productPrice, productImage, 1, category, categoryType);
            saveCart();
            updateCart();
        });
    });

    // Mostrar el carrito
    cartButton.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        updateCart();
    });

    // Cerrar el carrito
    closeBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Sincronizar el carrito entre páginas
    window.addEventListener('storage', (event) => {
        if (event.key === 'cart') {
            cart = JSON.parse(event.newValue);
            updateCart();
        }
    });

    // Cargar el carrito al inicio
    updateCart();
});



//Búsqueda

    document.addEventListener('DOMContentLoaded', function() {
        const backToTopButton = document.querySelector('.back-to-top');
        const searchBar = document.getElementById('search-bar');
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        document.querySelector('.search-container').appendChild(resultsContainer);

        // Inicialmente ocultar el botón
        backToTopButton.style.display = 'none';

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'inline-flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Resultados de búsqueda
        const resultados = [
            'Pack citronela',
            'Pack vainilla',
            'Pack manzanilla',
            'Pack rosa',
            'Pack ruda',
            'Pack lavanda',
            'Pack romero',
            'Portasahumerio triple buho',
            'Portasahumerio buho',
            'Portasahumerio buho grande',
            'Portasahumerio triple buho azul',
            'Portasahumerio con diseño rústico',
            'Portasahumerio con diseño circular',
            'Portasahumerio con diseño tabla',
            'Portasahumerio cerámica',
        ];
      
      const urls = [
    'productos/producto1.html',
    'productos/producto2.html',
    'productos/producto3.html',
    'productos/producto4.html',
    'productos/producto5.html',
    'productos/producto6.html',
    'productos/producto7.html',
    'productos/producto8.html',
    'productos/producto9.html',
    'productos/producto10.html',
    'productos/producto11.html',
    'productos/producto12.html',
    'productos/producto13.html',
    'productos/producto14.html',
    'productos/producto15.html',        
];

        searchBar.addEventListener('input', function() {
            const query = searchBar.value.toLowerCase();
            resultsContainer.innerHTML = '';
            
            if (query) {
                const resultadosFiltrados = resultados.filter(item => item.toLowerCase().includes(query));
                resultadosFiltrados.forEach(item => {
                    const index = resultados.indexOf(item); // Encuentra el índice correcto
                    const div = document.createElement('div');
                    div.textContent = item;
                    div.onclick = () => {
                        window.location.href = urls[index]; // Usa el índice para acceder a la URL
                    };
                    resultsContainer.appendChild(div);
                });
            }
        });
    });



// PLACEHOLDER AÑADIDO AL CARRITO

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.add-cart');

    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            addToCart();
        });
    });

    function addToCart() {
        const notification = document.getElementById("notification");
        notification.textContent = "Producto añadido al carrito";
        
        // Muestra la notificación
        notification.style.display = "block";
        notification.style.opacity = "0.8";

        // Desvanece el mensaje después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
            }, 500); // Tiempo que toma el desvanecimiento
        }, 1500); // Tiempo que se muestra la notificación
    }
});
