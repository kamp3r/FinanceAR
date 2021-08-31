//
const formulario = document.getElementById("simuladorCampos")
const sliderV = document.getElementById("inputRange");
const inputV = document.getElementById("aSolicitar");
const nombreS= document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("mail");
const plazos = document.getElementById("menuPlazos");
const tasas = cambiarValorTasas();
const datosTabla = document.querySelector("#tftable,tbody");
let planesVisible = false;

//Sincronia S/I
sliderV.onchange = function (){
    inputV.value = sliderV.value;
}

inputV.onchange = function (){
    sliderV.value = inputV.value;
}
//Sincronia Plazos y Tasas

plazos.addEventListener("change", cambiarValorTasas);
function cambiarValorTasas (){
    let plazosOpc = document.getElementById("menuPlazos").selectedIndex;
    let opciones = document.getElementById("menuPlazos").options;
    if (opciones[plazosOpc].value == 12){
        document.getElementById("tasasSeleccion").innerHTML = 3.95;
    } else if (opciones[plazosOpc].value == 24){
        document.getElementById("tasasSeleccion").innerHTML = 4.19;
    } else if (opciones[plazosOpc].value == 36){
        document.getElementById("tasasSeleccion").innerHTML = 4.36;
    }
    return document.getElementById("tasasSeleccion").value
}

document.getElementById("botonCalc").addEventListener("click", (e) =>{
    e.preventDefault();
    calcularCuotas (inputV.value, tasas, plazos.value);
    mostrarTabla("tasasSeleccion", planesVisible);
    mostrarTabla("tasasLabel", planesVisible);
    mostrarTabla("botonEnviar", planesVisible);
    mostrarTabla("tablaPrestamos", planesVisible);
    planesVisible = !planesVisible;
    
    
})

function mostrarTabla(nombre, visibilidad ){
    let mostrar = document.getElementById(nombre);
    if (visibilidad == false){
        if(mostrar.classList.contains("noMostrar")){
            mostrar.classList.remove("noMostrar")
        }
        mostrar.className += " mostrar"
    } else {
        if(mostrar.classList.contains("mostrar")){
            mostrar.classList.remove("mostrar")
        }
        mostrar.className += " noMostrar"
    }
}

function calcularCuotas(valor, tasas, plazos){
    let hoy = new Date()
    let pagoMensual = 0;
    let pagoAmortizacion = 0;
    let pagosIntereses = 0;
    pagoMensual = valor * (Math.pow(1+tasas/100, plazos)*tasas/100)/(Math.pow(1+tasas/100, plazos)-1);
    while (datosTabla.firstChild){
        datosTabla.removeChild(datosTabla.firstChild);
    }

    //creacion de fechas sucesivas
    function formatoFecha(fecha) {

        fecha = new Date(fecha);
        var dia = fecha.getDate();
        var mesIndex = fecha.getMonth()+1;
        var año = fecha.getFullYear();
    
        return dia + "/" + mesIndex + "/" + año;
    }

    for(let i = 1; i <= plazos; i++) {

        pagosIntereses = parseFloat(valor*(tasas/100));
        pagoAmortizacion = pagoMensual - pagosIntereses;
        valor = parseFloat(valor-pagoAmortizacion);
        
        fechaX = hoy.setMonth(hoy.getMonth() + 1);
        //creacion de las filas
        const fila = document.createElement("tr");
        fila.innerHTML = 
        `   <td>${formatoFecha(fechaX)}
            <td class="valorCuota">${pagoMensual.toFixed(2)}</td>
            <td>${pagoAmortizacion.toFixed(2)}</td>
            <td>${pagosIntereses.toFixed(2)}</td>
            <td>${valor.toFixed(2)}</td>`;
        datosTabla.appendChild(fila);
    }

}    

//Obtener datos del cliente

let clientes = [];
const agregarCliente = (e) =>{
    e.preventDefault();
    let cliente = {
        id: Date.now(),
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("mail").value,
        valor: parseInt(document.getElementById("aSolicitar").value),
        plazo: parseInt(document.getElementById("menuPlazos").value),
        tasas: parseFloat(document.getElementById("tasasSeleccion").value),
    }
    clientes.push(cliente);
    document.forms[0].reset();
    localStorage.setItem("ListaClientes", JSON.stringify(clientes));
}
 document.getElementById("botonEnviar").addEventListener("click", agregarCliente);
