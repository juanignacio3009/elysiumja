/* AÑADIR AL CARRITO */
document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cartButton');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeBtn = document.querySelector('.close');
    const addToCartButtons = document.querySelectorAll('.add-cart-button');
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const cartCount = document.getElementById('cartCount');
    const cartItemCount = document.getElementById('cartItemCount');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Delegación de eventos para añadir al carrito
    document.querySelector('.product-grid').addEventListener('click', (event) => {
        if (event.target.classList.contains('add-cart-button')) {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.getAttribute('data-name');
            const productPrice = parseFloat(productCard.getAttribute('data-price'));
            const productImage = productCard.getAttribute('data-image');
            const quantityInput = productCard.querySelector('.quantity');
            const quantity = parseInt(quantityInput.value, 10);
            const discountPercent = parseFloat(productCard.getAttribute('data-discount')) || 0;
            const discount = discountPercent / 100;
            const discountedPrice = productPrice - (productPrice * discount);
            
            // Obtener el categoryType
            const categoryType = productCard.getAttribute('data-categorytype');

            // Añadir el producto al carrito
            addProductToCart(productId, productName, discountedPrice, productImage, quantity, productCard.getAttribute('data-category'), categoryType);
            updateCart();
            saveCart();
        }
    });

    function addProductToCart(id, name, price, image, quantity, category, categoryType) {
        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id, name, image, quantity, price, category, categoryType }); // Añadido categoryType
        }
    }

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

        // Aplicar promociones y actualizar el subtotal
        applyPromotions(subtotal);

        cartCount.textContent = itemCount;
        cartItemCount.textContent = itemCount;


        const increaseButtons = document.querySelectorAll('.increase');
        const decreaseButtons = document.querySelectorAll('.decrease');
        const removeButtons = document.querySelectorAll('#remove');

        // Activar/desactivar el botón de "Iniciar compra"
        proceedButton.disabled = cart.length === 0;

        increaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-id');
        const product = cart.find(item => item.id === productId);
        product.quantity += 1;
        updateCart();
        saveCart();
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                const product = cart.find(item => item.id === productId);
                product.quantity += 0;
                updateCart();
                saveCart();
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
                updateCart();
                saveCart();
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                cart = cart.filter(item => item.id !== productId);
                updateCart();
                saveCart();
            });
        });
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

    cartButton.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        updateCart();
    });

    closeBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Cargar el carrito al inicio
    updateCart();
});



// FILTROS

// Variable para rastrear los filtros activos
let activeFilters = {
    discount: false,
    intensity: [],
    sort: null,
    category: null // Añadir filtro de categoría
};

// Almacenar el orden original de los productos
let originalOrder = [];

// Función para inicializar el orden original de los productos
function storeOriginalOrder() {
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    originalOrder = productCards.map(card => card.outerHTML);
}

// Función para restaurar el orden original de los productos
function restoreOriginalOrder() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = originalOrder.join('');
}

// Función para alternar la visibilidad de los filtros
function toggleFilters() {
    const filters = document.getElementById('filters');
    filters.style.display = filters.style.display === 'none' ? 'flex' : 'none';
}

// Función para ordenar los productos
function sortProducts(order) {
    if (order === activeFilters.sort) {
        // Si el mismo orden se selecciona de nuevo, se desactiva el orden
        activeFilters.sort = null;
    } else {
        activeFilters.sort = order;
    }
    applyFilters();
}

// Función para aplicar el orden de productos
function applySort(productCards) {
    if (!activeFilters.sort) return productCards; // No ordenar si no hay orden activo

    return productCards.sort(function(a, b) {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        if (activeFilters.sort === 'priceAsc') {
            return priceA - priceB;
        } else if (activeFilters.sort === 'priceDesc') {
            return priceB - priceA;
        }
    });
}

// Función para filtrar productos con descuento
function filterDiscount() {
    activeFilters.discount = !activeFilters.discount;
    applyFilters();
}

// Función para filtrar productos por intensidad
function toggleFilterByIntensity(intensity) {
    const index = activeFilters.intensity.indexOf(intensity);
    if (index > -1) {
        // Intensidad ya está en los filtros, se elimina
        activeFilters.intensity.splice(index, 1);
    } else {
        // Intensidad no está en los filtros, se agrega
        activeFilters.intensity.push(intensity);
    }
    applyFilters();
}

// Función para filtrar por categoría de productos
function filterPortasahumerios(category) {
    if (category === activeFilters.category) {
        // Si el mismo filtro de categoría se selecciona de nuevo, se desactiva el filtro
        activeFilters.category = null;
    } else {
        activeFilters.category = category;
    }
    applyFilters();
}

// Función para aplicar filtros a los productos
function applyFilters() {
    // Restaurar el orden original para aplicar filtros y orden
    restoreOriginalOrder();

    let productCards = Array.from(document.querySelectorAll('.product-card'));

    // Filtrar por categoría
    if (activeFilters.category) {
        productCards = productCards.filter(card => card.dataset.category === activeFilters.category);
    } else {
        // Si no hay filtro de categoría aplicado, oculta los productos de "Portasahumerios"
        productCards = productCards.filter(card => card.dataset.category !== 'portasahumerios');
    }

    // Filtrar por descuento
    if (activeFilters.discount) {
        productCards = productCards.filter(card => card.dataset.discount === 'true');
    }

    // Filtrar por intensidad
    if (activeFilters.intensity.length > 0) {
        productCards = productCards.filter(card => {
            const intensity = parseInt(card.dataset.intensity, 10);
            return activeFilters.intensity.includes(intensity);
        });
    }

    // Aplicar el orden
    productCards = applySort(productCards);

    // Actualizar la grilla de productos
    updateProductGrid(productCards);
}

// Función para actualizar la grilla de productos
function updateProductGrid(productCards) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // Limpiar la grilla

    productCards.forEach(card => {
        productGrid.appendChild(card);
    });
}

// Función para aplicar filtros al cargar la página
function applyInitialFilters() {
    // Establecer el estado inicial del filtro de categoría (puede ser null o el valor por defecto)
    activeFilters.category = null; // O puedes establecerlo en un valor específico si deseas filtrar por defecto

    // Aplicar filtros iniciales
    applyFilters();
}

// Al cargar la página, almacenar el orden original de los productos y aplicar filtros iniciales
document.addEventListener('DOMContentLoaded', () => {
    storeOriginalOrder();
    applyInitialFilters();
});


//Publicidad

    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('promoModal');
        const closeButton = document.querySelector('.close-button');
        const closeModalButton = document.getElementById('closeModalButton');

        // Mostrar el modal al cargar la página
        modal.style.display = 'block';

        // Cerrar el modal al hacer clic en la "X"
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        closeModalButton.onclick = function() {
            modal.style.display = 'none';
        };

        // Cerrar el modal al hacer clic fuera de la ventana modal
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
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
    const buttons = document.querySelectorAll('.add-cart-button');

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