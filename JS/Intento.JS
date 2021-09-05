//Array datosClientes - Class Clientes
const datosClientes = [];

class Clientes {
	constructor() {
		this.client = {};
	}
	creacionClientes(nombre, apellido, email, monto, plazo, tasas, cuota) {
		this.client = {
			id: Date.now(),
			nombre: nombre,
			apellido: apellido,
			email: email,
			monto: monto,
			plazo: plazo,
			tasas: tasas,
			cuota: cuota,
		};
		datosClientes.push(this.client);
		document.forms[0].reset();
		localStorage.setItem("Datos de Clientes", JSON.stringify(datosClientes));
	}
	calcularCuotas(monto, tasas, plazos) {
		let hoy = new Date();
		let pagoMensual = 0;
		let pagoAmortizacion = 0;
		let pagosIntereses = 0;
		pagoMensual =
			(monto * ((Math.pow(1 + tasas / 100, plazos) * tasas) / 100)) /
			(Math.pow(1 + tasas / 100, plazos) - 1);
		while (datosTabla.firstChild) {
			datosTabla.removeChild(datosTabla.firstChild);
		}

		//creacion de fechas sucesivas
		function formatoFecha(fecha) {
			fecha = new Date(fecha);
			var dia = fecha.getDate();
			var mesIndex = fecha.getMonth() + 1;
			var año = fecha.getFullYear();

			return dia + "/" + mesIndex + "/" + año;
		}
        //recorrido meses para la tabla
		for (let i = 1; i <= plazos; i++) {
			pagosIntereses = parseFloat(monto * (tasas / 100));
			pagoAmortizacion = parseFloat(pagoMensual - pagosIntereses);
			monto = parseFloat(monto - pagoAmortizacion);

			var fechaX = hoy.setMonth(hoy.getMonth() + 1);
			//creacion de las filas
			$("#tablaPrestamos").append(`<tr><td>${formatoFecha(fechaX)}
            <td class='valorCuota'>${pagoMensual.toFixed(2)}</td>
            <td>${pagoAmortizacion.toFixed(2)}</td>
            <td>${pagosIntereses.toFixed(2)}</td>
            <td>${monto.toFixed(2)}</td>`);
		}
	}
}
var client = new Clientes();

const datosTabla = document.querySelector("#tftable, tbody");
//Variar valores de tasas
const tasas = cambiarValorTasas();
function cambiarValorTasas() {
	let plazosOpc = $("#menuPlazos").prop("selectedIndex");
	let opciones = $("#menuPlazos").prop("options");
	if (opciones[plazosOpc].value == 12) {
		$("#tasasSeleccion").html(3.95);
	} else if (opciones[plazosOpc].value == 24) {
		$("#tasasSeleccion").html(4.19);
	} else if (opciones[plazosOpc].value == 36) {
		$("#tasasSeleccion").html(4.36);
	}
	return $("#tasasSeleccion").val();
}
$(document).on("change", cambiarValorTasas);

//visibilizar tabla y tasas
var planesVisible = false;
function mostrarTabla(nombre, visibilidad) {
	let mostrar = document.getElementById(nombre);
	if (visibilidad == false) {
		if (mostrar.classList.contains("noMostrar")) {
			mostrar.classList.remove("noMostrar");
		}
		mostrar.className += " mostrar";
	} else {
		if (mostrar.classList.contains("mostrar")) {
			mostrar.classList.remove("mostrar");
		}
		mostrar.className += " noMostrar";
	}
}
//generar PDF



//Sincronia Input Range/Input Valor Prestamo
$(document).on("change", "#inputRange", function (e) {
	e.preventDefault();
	$("#aSolicitar").val($(this).val());
});
$(document).on("change", "#aSolicitar", function (e) {
	e.preventDefault();
	$("#inputRange").val($(this).val());
});
//Eventos boton Calc
$("#botonCalc").on("click", (e) => {
	e.preventDefault();
	mostrarTabla("tasasSeleccion", planesVisible);
	mostrarTabla("tasasLabel", planesVisible);
	mostrarTabla("botonEnviar", planesVisible);
	planesVisible = !planesVisible;
	client.calcularCuotas($("#aSolicitar").val(), tasas, $("#menuPlazos").val());
});

//Eventos boton enviar
$("#botonEnviar").on("click", (e) => {
	e.preventDefault();
	client.creacionClientes(
		$("#nombre").val(),
		$("#apellido").val(),
		$("#mail").val(),
		parseInt($("#aSolicitar").val()),
		parseInt($("#menuPlazos").val()),
		parseFloat(tasas),
		parseFloat($(".valorCuota").text()).toFixed(2)
	);
    function generatePdf() {
        var doc = new jspdf.jsPDF();
        var offsetY = 4.797777777777778;
        var lineHeight = 6.49111111111111;
        var fontSize = 12;
        doc.text(85, 10, "Tabla de Prestamo");
        doc.autoTable({startY: 15,html: '.tftable', styles : { halign : 'center'}, headStyles :{fillColor : [124, 95, 240]}, alternateRowStyles: {fillColor : [231, 215, 252]}, tableLineColor: [124, 95, 240], tableLineWidth: 0.1,});
        doc.setFontSize(fontSize);
        var img = new Image();
        img.src = 'images/signaturePDF.png'
        doc.addImage(img, 'png', 100, doc.autoTable.previous.finalY + lineHeight * 1.5 + offsetY, 20, 20)
        doc.text(90, doc.autoTable.previous.finalY + lineHeight * 5 + offsetY, "Juan Jose Urquiza")
        doc.text(89, doc.autoTable.previous.finalY + lineHeight * 6 + offsetY, "Gerente FinanceAR")
        doc.save ("detallePrestamo.pdf");

    }
    generatePdf();      
 
});
