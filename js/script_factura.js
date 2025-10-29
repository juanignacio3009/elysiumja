document.addEventListener('DOMContentLoaded', () => {
    const invoiceContainer = document.getElementById('invoice');
    const subtotalElement = document.getElementById('invoice-subtotal');
    const discountElement = document.getElementById('invoice-discount');
    const totalElement = document.getElementById('invoice-total');

    // Recuperar el carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    // Mostrar los productos en la factura
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Crear elementos para cada producto
        const invoiceItem = document.createElement('div');
        invoiceItem.classList.add('invoice-item');
        invoiceItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="product-info">
                <p><strong>${item.name}</strong></p>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: $${item.price.toFixed(2)}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
            </div>
        `;
        invoiceContainer.appendChild(invoiceItem);
    });

    // Aplicar descuentos y mostrar resumen
    const { totalDescuento, promoText } = applyPromotions(subtotal);
    const total = subtotal - totalDescuento;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    if (totalDescuento > 0) {
        discountElement.innerHTML = promoText.map(text => `<span class="discount-text">${text}</span>`).join('<br/>');
    } else {
        discountElement.innerHTML = '-$0';
    }
});

// Función applyPromotions
function applyPromotions(subtotal) {
    let promoText = [];
    let totalDescuento = 0;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

        if (portaChico) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta chico
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Chico: -$500`);
        } else if (portaGrande) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta grande
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Grande: -$500`);
        } else if (portaElysium) {
            descuentoPortasahumerios += 500; // Descuento por 1 porta elysium
            promoPortasahumeriosText.push(`Promo 1 paq + Porta Elysium: -$500`);
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

    return { totalDescuento, promoText };
}


// GENERAR FACTURA

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customer-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener valores del formulario
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        // Actualizar los campos de la factura con los datos del formulario
        document.getElementById('invoice-first-name').textContent = firstName;
        document.getElementById('invoice-last-name').textContent = lastName;
        document.getElementById('invoice-phone').textContent = phone;
        document.getElementById('invoice-email').textContent = email;
    });
});


// SELECCIÓN FECHA Y HORA

document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById('appointment-date');
    const timeInput = document.getElementById('appointment-time');

    // Configurar las opciones de hora según el día seleccionado
    function configureTimeOptions(dayOfWeek) {
        const allOptions = Array.from(timeInput.options);

        // Mostrar solo las opciones válidas
        allOptions.forEach(option => {
        option.style.display = (option.value <= maxTime) ? 'block' : 'none';
        });
    }

    // Controlar el cambio en la fecha
    dateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

        if (dayOfWeek === 5 || dayOfWeek === 6) {
            // Si es sábado o domingo, mostrar un mensaje y limpiar el campo
            alert('Selecciona un día de Lunes a Viernes');
            this.value = ''; // Limpiar el campo de fecha
            configureTimeOptions(dayOfWeek); // Configurar opciones de hora
        } else {
            // Configurar las opciones de hora según el día de la semana
            configureTimeOptions(dayOfWeek);
        }
    });
});


// MOSTRAR EN FACTURA LOS DATOS

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customer-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener valores del formulario
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('document-number').value;
        const email = document.getElementById('email').value;
        const appointmentDate = document.getElementById('appointment-date').value;
        const appointmentTime = document.getElementById('appointment-time').value;

        // Formatear la fecha a dd-mm-yyyy
        const formattedDate = appointmentDate.split('-').reverse().join('-');

        // Actualizar los campos de la factura con los datos del formulario
        document.getElementById('invoice-first-name').textContent = firstName;
        document.getElementById('invoice-last-name').textContent = lastName;
        document.getElementById('invoice-document').textContent = phone;
        document.getElementById('invoice-email').textContent = email;
        document.getElementById('invoice-retirar').textContent = appointmentDate ? formattedDate : 'No disponible';
        document.getElementById('invoice-horario').textContent = appointmentTime ? appointmentTime : 'No disponible';

        // Opcional: limpiar el formulario después de enviar
        form.reset();

    });
});


// FECHA Y NRO DE PEDIDO

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customer-form');
    const invoiceDateElement = document.getElementById('invoice-date');
    const invoiceOrderNumberElement = document.getElementById('invoice-order-number');

    // Generar número de pedido aleatorio
    function generateOrderNumber() {
        return Math.floor(Math.random() * 1000000); // Número aleatorio entre 0 y 999999
    }

    // Mostrar la fecha actual
    function setCurrentDate() {
        const today = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        invoiceDateElement.textContent = today.toLocaleDateString('es-ES', options);
    }

    // Configurar el número de pedido y la fecha al cargar la página
    function initializeInvoice() {
        setCurrentDate();
        invoiceOrderNumberElement.textContent = generateOrderNumber();
    }

    initializeInvoice();
});


// SOLO NUMEROS DNI

document.getElementById('document-number').addEventListener('input', function (e) {
    // Eliminar cualquier carácter que no sea número
    let value = e.target.value.replace(/\D/g, '');
    
    // Asignar el valor formateado de nuevo al campo
    e.target.value = value;
});


// PDF

document.getElementById('customer-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    
    // Muestra el contenedor de la factura y el botón de descarga
    document.querySelector('.invoice-container').classList.remove('hidden');
    document.getElementById('download-pdf').classList.remove('hidden');
});

document.getElementById('download-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const invoiceElement = document.querySelector('.invoice-container');
    const invoiceClone = document.getElementById('invoice-clone');

    // Clona el contenido de la factura
    invoiceClone.innerHTML = invoiceElement.innerHTML;

    // Aplica un tamaño fijo al clon de la factura
    invoiceClone.style.width = '800px';  // Ancho fijo en píxeles
    invoiceClone.style.height = 'auto';  // Altura automática según el contenido
    invoiceClone.style.display = 'block';  // Asegúrate de que esté visible durante la captura
    html2canvas(invoiceClone, {
        scale: 2  // Aumenta la escala para mejor calidad
    }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/jpeg', 0.7); // Cambia a JPEG y ajusta la calidad a 70%
        const imgWidth = 190; // Ancho de la imagen en el PDF
        const pageHeight = 290; // Altura de la página en el PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Descarga el PDF con un nombre único
        doc.save('factura_elysium_' + Math.floor(Math.random() * 1000000) + '.pdf');
          window.open('https://api.whatsapp.com/send?phone=3518619382&text=%C2%A1Hola!%20Te%20env%C3%ADo%20la%20factura%20de%20mi%20compra%20en%20Elysium.%20(%27Adjunta%20aqu%C3%AD%20tu%20factura%20de%20compra%27', '_blank');

        // Vuelve a ocultar el clon después de la generación
        invoiceClone.style.display = 'none';
      
      
        // Mostrar el botón de "Enviar a Redes Sociales" después de descargar el PDF
        const sendSocialButton = document.getElementById('send-social');
        sendSocialButton.classList.remove('hidden');
    });
});


// INDICADOR DE CARGA

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customer-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        // Muestra el indicador de carga
        loadingOverlay.style.display = 'flex'; // Usa 'flex' o 'block', dependiendo de cómo lo hayas configurado en CSS

        // Simula un retraso para mostrar el indicador de carga (puedes eliminar esto si tu proceso es rápido)
        setTimeout(() => {
            
            // Oculta el indicador de carga
            loadingOverlay.style.display = 'none';
        }, 2000); // Ajusta el tiempo si es necesario
    });
});


document.getElementById('send-social').addEventListener('click', function() {
    const facturaURL = "ruta/factura.pdf"; // Aquí va la URL o el nombre del archivo que se acaba de descargar
    const mensaje = `¡Hola! Te envío la factura de mi compra en Elysium. ('Adjunta aquí tu factura de compra')`;
    
    // Abrir WhatsApp con el mensaje y la URL de la factura
    const whatsappURL = `https://api.whatsapp.com/send?phone=3518619382&text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
});


