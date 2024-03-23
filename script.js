'use strict'

var divMaskModalAdd = document.querySelector('.dm1');
var divModalAdd = document.querySelector('.madd1');

var divMaskModalBolsita = document.querySelector('.dm2');
var divModalBolsita = document.querySelector('.madd');

var nombreProductoModalAdd = document.getElementById('nombre-producto-add');
var descripcionProductoModalAdd = document.getElementById('descripcion-producto-add');

var campoCantidadPiezas = document.querySelector('.counter');

var productoActual = null; // Variable global para almacenar el producto actual

var itemsBolsita = document.querySelectorAll('.div-counter-items');

var totalPay = document.getElementById('totalPay');

var emptyListMessage = document.querySelector('.emptyList');
var btnMakeOrder = document.querySelector('.btmakeorder');

var checkMenu = document.getElementById('closemenu');

var bolsitaSlider = document.querySelector('.div-icon-slide-bolsita');

var sectionHorarioLunesViernes = document.getElementById('horarioslunesviernes');
var sectionHorarioSabadoDomingo = document.getElementById('horariossabadodomingo');
var sectionUbicacionInformacion = document.getElementById('locationsectioninformation');
var sectionUbicacionInformacion2 = document.getElementById('locationsectioninformation2');
var sectionNumeroTelefono = document.getElementById('numtelsection');
var sectionEmailSection = document.getElementById('emailsection');
var sectionFacebook = document.getElementById('sectionFacebook');
var imagenPresentacion = document.getElementById('imagenpresentacion');


const PROPIEDAD_HORARIO_LUNES_VIERNES = "lunesViernesHorario";
const PROPIEDAD_HORARIO_SABADO_DOMINGO = "sabadoDomingoHorario";
const PROPIEDAD_UBICACION_ = "ubicacionPanaderia";
const PROPIEDAD_UBICACION2_ = "ubicacionPanaderia2";
const PROPIEDAD_GEOLOCALIZACION = "geolocalizacionPanaderia";
const PROPIEDAD_GEOLOCALIZACION2 = "geolocalizacionPanaderia2";
const PROPIEDAD_NUM_CONTACTO = "telefonoSendWhatsApp";
const PROPIEDAD_CORREO_ELECTRONICO = "correoPanaderia";
const PROPIEDAD_FACEBOOK = "facebookPanaderia";
const PROPIEDAD_IMAGEN = "imagenPresentacion";

var PROPIERTIES_CONFIG = null;

document.addEventListener('DOMContentLoaded', async function() {
    PROPIERTIES_CONFIG = await obtenerPropiedadesConfig();
    // Hacemos la carga de la información dinamica del archivo config.jsona
   sectionHorarioLunesViernes.textContent = PROPIERTIES_CONFIG[PROPIEDAD_HORARIO_LUNES_VIERNES];
   sectionHorarioSabadoDomingo.textContent = PROPIERTIES_CONFIG[PROPIEDAD_HORARIO_SABADO_DOMINGO];
   sectionUbicacionInformacion.innerHTML = PROPIERTIES_CONFIG[PROPIEDAD_UBICACION_];
   sectionUbicacionInformacion2.innerHTML = PROPIERTIES_CONFIG[PROPIEDAD_UBICACION2_];
   sectionUbicacionInformacion.setAttribute('href', 'https://www.google.com/maps?q=' + PROPIERTIES_CONFIG[PROPIEDAD_GEOLOCALIZACION]);
   sectionUbicacionInformacion2.setAttribute('href', 'https://www.google.com/maps?q=' + PROPIERTIES_CONFIG[PROPIEDAD_GEOLOCALIZACION2]);
   sectionNumeroTelefono.textContent = PROPIERTIES_CONFIG[PROPIEDAD_NUM_CONTACTO];
   sectionNumeroTelefono.setAttribute('href', `https://wa.me/${PROPIERTIES_CONFIG[PROPIEDAD_NUM_CONTACTO]}?text=¡Hola! Panadería San Miguel`);
   sectionEmailSection.textContent = PROPIERTIES_CONFIG[PROPIEDAD_CORREO_ELECTRONICO];
   sectionEmailSection.setAttribute('href', `mailto:${PROPIERTIES_CONFIG[PROPIEDAD_CORREO_ELECTRONICO]}`);
   sectionFacebook.setAttribute('href', PROPIERTIES_CONFIG[PROPIEDAD_FACEBOOK]);
   imagenPresentacion.setAttribute('src', `./resources/images/${PROPIERTIES_CONFIG[PROPIEDAD_IMAGEN]}`);
});


async function obtenerPropiedadesConfig() {
    try {
        const respuesta = await fetch("./resources/data/config.json"); // Obtiene el archivo JSON
        const json = await respuesta.json(); // Convierte la respuesta a JSON

        return json; // Devuelve la propiedad solicitada
    } catch (error) {
        console.error("Error al cargar el archivo JSON: ", error);
    }
}

function openLink(link, type) {
    if(type == "link"){
        window.open(PROPIERTIES_CONFIG[link])
    }else if(type == "phone"){
        window.open(`https://wa.me/${PROPIERTIES_CONFIG[link]}?text=¡Hola! Panadería San Miguel`)
    }else if(type == "email"){
        window.open(`mailto:${PROPIERTIES_CONFIG[link]}`)
    }
   
}


const ACTION_OPEN = "open";
const ACTION_CLOSE = "close";
const ACTION_DECREASE = "decrease";
const DATA_BOLSITA = "PRODUCTOS_BOLSITA_PAN_SM"

const TYPE_COMUN_REP = "comun";
const TYPE_ENCARGO_REP = "encargo";

const ACTION_INCREASE = "add";
const ACTION_REMOV = "remov";

// FUNCIÓN PARA AGREGAR PRODUCTO AL CARRITO
function openAddProduct(element){
    const productoData = element.getAttribute('data-producto');
    const producto = JSON.parse(productoData);

    productoActual = producto;

    nombreProductoModalAdd.textContent = producto.nombre.toUpperCase();
    descripcionProductoModalAdd.textContent = `¿Cuántas piezas de ${producto.nombre.toLowerCase()} quieres agregar a tu bolsita?`;
    campoCantidadPiezas.value = 1;
    openCloseModalAdd(ACTION_OPEN);
}

function openCloseModalAdd(action){
    if(action === ACTION_OPEN){
        divMaskModalAdd.classList.add('dm-open');
        divModalAdd.classList.add('madd-active');
    }else {
        divMaskModalAdd.classList.remove('dm-open');
        divModalAdd.classList.remove('madd-active');
    }
}

function openCloseModalBolsita(action){
    if(action === ACTION_OPEN){
        divMaskModalBolsita.classList.add('dm-open');
        divModalBolsita.classList.add('madd-active');
    }else {
        divMaskModalBolsita.classList.remove('dm-open');
        divModalBolsita.classList.remove('madd-active');
    }
    mostrarProductosEnBolista();
}

function cargarYMostrarProductos(type) {
    fetch('./resources/data/reposteria.json')
        .then(response => response.json())
        .then(data => {
            if(type === TYPE_COMUN_REP){
                data.reposteriaComun.forEach(producto => {
                        agregarProductoAlDOM(producto, 'reposteria-piezas');
                });
            }else if(type === TYPE_ENCARGO_REP){
                data.reposteriaPedido.forEach(producto => {
                    agregarProductoAlDOM(producto, 'div-respoteria-encargo');
            });
            }
        })
        .catch(error => console.error('Error al cargar productos común:', error));

}


function agregarProductoAlDOM(producto, nameContainer) {

    const container = document.querySelector("."+nameContainer);
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    productDiv.innerHTML =  devolverSeccionProducto(producto);

    const buttonAdd = productDiv.querySelector('.button-add');
    buttonAdd.setAttribute('data-producto', JSON.stringify(producto));

    container.appendChild(productDiv);
}

function navigatedLink(path){
    window.location.href = "#reposteria";
}

function mostrarProductosEnBolista(){
    const container = document.querySelector(".div-pzsa");
    container.innerHTML = "";
    

    const productosEnBolsita = JSON.parse(localStorage.getItem(DATA_BOLSITA)) || [];

    const costoTotal = productosEnBolsita.reduce((acumulador, productoActual) => {
        return acumulador + (productoActual.costo * productoActual.cantidad);
    }, 0);

    totalPay.innerHTML = `Total a pagar: <br> ${formatearComoMoneda(costoTotal)}`;

     
    if(productosEnBolsita.length == 0){
        emptyListMessage.style.display = "block";
        btnMakeOrder.style.display = "none";
        btnMakeOrder.classList.add('disabled-style');
        
    }else{
        emptyListMessage.style.display = "none";
        btnMakeOrder.classList.remove('disabled-style');
        btnMakeOrder.style.display = "flex";
    }

    productosEnBolsita.forEach(producto => {
        const productDiv = document.createElement('div');
        productDiv.className = 'pza-rep';
        productDiv.innerHTML = `
        <img class="img-pza" width="50px" height="50px" src="./resources/images/reposteria/${producto.imagen}" alt="PIEZA">
                        <p>${producto.nombre}</p>
                        <p class="costopieza-p"><small class="costopza">Costo por pza</small><br>${formatearComoMoneda(producto.costo)}</p>
                        <p class="costopieza-p"><small class="costopza">En tu bolsita</small><br>${producto.cantidad} pz</p>
                        <div class="buttons-counter">
                            <div class="button-counter btncounte" title="DISMINUIR" onclick="disminuirAumentarProductoBolsita(${producto.id}, 'remov')">
                                <img width="20px" height="20px" src="./resources/icons/removeBlack.svg" alt="DISMINUIR">
                            </div>
                            <div class="button-counter btncounte" title="AUMENTAR"  onclick="disminuirAumentarProductoBolsita(${producto.id}, 'add')">
                                <img width="20px" height="20px" src="./resources/icons/addBlack.svg" alt="AUMENTAR" >
                            </div>
                            <div class="button-counter btncounte btnremove" title="QUITAR DE LA BOLSITA" onclick="eliminarProductoDeLaBolsita(${producto.id})">
                                <img width="20px" height="20px" src="./resources/icons/iconoTrash.svg" alt="REMOVER" >
                            </div>
                        </div>`;
                        container.appendChild(productDiv);
    });
   
}

function formatearComoMoneda(cantidad) {
    return cantidad.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    });
}


function devolverSeccionProducto(producto){
    return `
    <div class="image-product">
        <img src="./resources/images/reposteria/${producto.imagen}" alt="${producto.alt}">
    </div>
    <div class="div-footer-product">
        <p>${producto.nombre}</p>
    </div>
    <p class="costo-product">$${producto.costo}</p>
    <div class="button-add" onclick="openAddProduct(this)">
        <img src="./resources/icons/add.svg" alt="ADD">
    </div>
`;
}

campoCantidadPiezas.addEventListener('input', validarNumero);
campoCantidadPiezas.addEventListener('click', validarNumero);

function validarNumero() {
    var input = campoCantidadPiezas;
    var valor = input.value;

    // Remover caracteres no numéricos, excepto el punto decimal
    valor = valor.replace(/[^0-9]/g, '');

    // Convertir a número y verificar si es negativo
    if (Number(valor) < 0 || isNaN(valor)) {
        input.value = '';
    } else {
        input.value = valor;
    }

    if(valor == "" || valor == null || valor == 0){
        input.value = 1;
    }
}

function increaseDecreaseAdd(action){
    var input = campoCantidadPiezas;
    var valor = Number(input.value);
    if(action === ACTION_DECREASE){
        valor--;
    }else{
        valor++;
    }
    
    input.value = valor;
    validarNumero();
}

function agregarProductoALocalStorage(){
    if (!productoActual) {
        console.error("No hay producto seleccionado");
        return;
    }

    const cantidad = parseInt(campoCantidadPiezas.value, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
        console.error("Cantidad inválida");
        return;
    }

    const productoParaAgregar = { ...productoActual, cantidad: cantidad };

    // Aquí asumimos que guardas un array de productos en localStorage
    const productosEnBolsita = JSON.parse(localStorage.getItem(DATA_BOLSITA)) || [];

    let productoExistente = productosEnBolsita.find(p => p.id === productoActual.id);

    if (productoExistente) {
        productoExistente.cantidad += cantidad; // Actualiza la cantidad si el producto ya existe
    } else {
        productosEnBolsita.push(productoParaAgregar); // Agrega el producto si no existe
    }

    localStorage.setItem(DATA_BOLSITA, JSON.stringify(productosEnBolsita));

    cambiarCantidadNumeroBolsita();

    openCloseModalAdd(ACTION_CLOSE); // Cierra el modal después de agregar el producto
}

function disminuirAumentarProductoBolsita(producto, action){


    // Aquí asumimos que guardas un array de productos en localStorage
    const productosEnBolsita = JSON.parse(localStorage.getItem(DATA_BOLSITA)) || [];

    let productoExistente = productosEnBolsita.find(p => p.id === producto);
    const productoIndex = productosEnBolsita.findIndex(p => p.id === producto);

    if (productoExistente) {
        

        if(action === ACTION_INCREASE){
            productoExistente.cantidad += 1;
        }else if(action === ACTION_REMOV){
            if(productoExistente.cantidad === 1){
                productosEnBolsita.splice(productoIndex, 1);
            }else{
                productoExistente.cantidad -= 1;
            }
        }
    } 

    // Actualizar el localStorage con los nuevos datos
    localStorage.setItem(DATA_BOLSITA, JSON.stringify(productosEnBolsita));

    mostrarProductosEnBolista();
    cambiarCantidadNumeroBolsita();
}

function eliminarProductoDeLaBolsita(producto){
    const productosEnBolsita = JSON.parse(localStorage.getItem(DATA_BOLSITA)) || [];
    const productoIndex = productosEnBolsita.findIndex(p => p.id === producto);

    productosEnBolsita.splice(productoIndex, 1);

    localStorage.setItem(DATA_BOLSITA, JSON.stringify(productosEnBolsita));

    mostrarProductosEnBolista();
    cambiarCantidadNumeroBolsita();
}

function cambiarCantidadNumeroBolsita(){
    const productosEnBolsita = JSON.parse(localStorage.getItem(DATA_BOLSITA)) || [];

    if(productosEnBolsita.lenght == 0){
        itemsBolsita.forEach(div => div.textContent = 0);
    }else{
        let items = productosEnBolsita.reduce((acumulador, productoActual) => {
            return acumulador + productoActual.cantidad;
        }, 0); // El 0 inicializa el acumulador
        itemsBolsita.forEach(div => div.textContent = items);

        if(items > 99){
            itemsBolsita.forEach(div => div.textContent = "99+");
        }
    }
}


window.addEventListener('scroll', function() {
    var distanciaDeseada = 100; // La distancia de desplazamiento en píxeles antes de mostrar el div
    var divBolsita = document.querySelector('.div-icon-slide-bolsita');

    if (window.scrollY > distanciaDeseada) {
        divBolsita.classList.add('disb-active'); // Muestra el div
    } else {
        divBolsita.classList.remove('disb-active');  // Oculta el div
    }
    
});

function clickCheckMenu(){
    checkMenu.checked = !checkMenu.checked;
}

checkMenu.addEventListener('change', function(){
    var divBolsita = document.querySelector('.div-icon-slide-bolsita');
    if(checkMenu.checked){
        divBolsita.style.display = "none";
    }else{
        divBolsita.style.display = "flex";
    }
});


function sendPedido() {
    obtenerUbicacion(function(direccionUsuario) {
        let mensaje = "¡Hola!\nMe gustaría solcitar estas piezas:\n\n*Productos:*\n";

        const datosAlmacenados = localStorage.getItem(DATA_BOLSITA);

        if (datosAlmacenados) {
            const datos = JSON.parse(datosAlmacenados);
            datos.forEach((producto, indice) => {
                mensaje += `* *${indice + 1}* | ${producto.nombre} | ${producto.cantidad} unidades\n`;
            });

            // Añade la dirección al mensaje
            if (direccionUsuario) {
                mensaje += `\n*Dirección de entrega:*\n${direccionUsuario}`;
            }

            // Codifica el mensaje para URL
            const mensajeCodificado = encodeURIComponent(mensaje);
            
            // Crea la URL de WhatsApp
            const numero = "7226264354"; // Reemplaza con el número real
            const urlWhatsApp = `https://wa.me/${numero}?text=${mensajeCodificado}`;

            // Abre WhatsApp en una nueva pestaña
            window.open(urlWhatsApp, '_blank');
        } else {
            console.log('No hay datos para enviar');
        }
    });
}


function obtenerUbicacion(callback) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var latitud = position.coords.latitude;
                var longitud = position.coords.longitude;
                callback("https://www.google.com/maps?q=" + latitud + ',' + longitud); // Llamamos al callback con la ubicación
            },
            function(error) {
                // Manejo de errores
                console.error("Error al obtener la ubicación: ", error);
                callback(null); // Llamamos al callback con null en caso de error
            }
        );
    } else {
        alert("Tu navegador no soporta la Geolocalización.");
        callback(null);
    }
}





cargarYMostrarProductos(TYPE_COMUN_REP);
cargarYMostrarProductos(TYPE_ENCARGO_REP);
cambiarCantidadNumeroBolsita();