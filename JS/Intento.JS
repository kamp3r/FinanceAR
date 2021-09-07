
//inicio paso 1
$("#siguiente1").on("click", () => {
    $("#formSimulador0").animate({left: '-1000px'});
    $("#formSimulador1").animate({left: '100px'});
    $('#progreso').width("120px")
    $('.paso1').css({ filter: "invert(0) sepia(8) saturate(30) hue-rotate(260deg)" , opacity: "1"})
})
$("#anterior0").on("click", () => {
    $("#formSimulador0").animate({left: '100px'});
    $("#formSimulador1").animate({left: '1000px'});
    $('#progreso').width("-120px")
    $('.paso1').css({ filter: "invert(0) sepia(1) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
})

//paso 1 a paso 2
$("#siguiente2").on("click", () => {
    $("#formSimulador1").animate({left: '-1000px'});
    $("#formSimulador2").animate({left: '100px'});
    $('#progreso').width("240px")
    $('.paso2').css({ filter: "invert(0) sepia(8) saturate(30) hue-rotate(260deg)" , opacity: "1"})
})
$("#anterior1").on("click", () => {
    $("#formSimulador1").animate({left: '100px'});
    $("#formSimulador2").animate({left: '1000px'});
    $('#progreso').width("120px")
    $('.paso2').css({ filter: "invert(0) sepia(1) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
})
//paso 2 a paso 3
$("#siguiente3").on("click", () => {
    $("#formSimulador2").animate({left: '-1000px'});
    $("#formSimulador3").animate({left: '100px'});
    $('#progreso').width("360px")
    $('.paso3').css({ filter: "invert(0) sepia(8) saturate(30) hue-rotate(260deg)" , opacity: "1"})
})
$("#anterior2").on("click", () => {
    $("#formSimulador2").animate({left: '100px'});
    $("#formSimulador3").animate({left: '1000px'});
    $('#progreso').width("240px")
    $('.paso3').css({ filter: "invert(0) sepia(1) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
})
//paso 3 a paso 4
$("#siguiente4").on("click", () => {
    $("#formSimulador3").animate({left: '-1000px'});
    $("#formSimulador4").animate({left: '100px'});
    $('#progreso').width("500px")
    $('.paso4').css({ filter: "invert(0) sepia(8) saturate(30) hue-rotate(260deg)" , opacity: "1"})
})

//

//Array datosClientes - Class Clientes
const datosClientes = [];

class Clientes {
	constructor() {
		this.client = {};
	}
	creacionClientes(nombre, apellido, email, empleo, antiguedad, sueldo, monto, plazo, tasas, cuota) {
		this.client = {
			id: Date.now(),
			nombre: nombre,
			apellido: apellido,
			email: email,
			empleo: empleo,
			antiguedad: antiguedad,
			sueldo: sueldo,
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
    if (opciones[plazosOpc].value == "0") {
		$("#tasasSeleccion").attr("placeholder", "TEM(Tasa Efectiva Mensual)").val("").focus().blur();
	} else if(opciones[plazosOpc].value == 12) {
		parseFloat($("#tasasSeleccion").attr("placeholder", 3.95));
	} else if (opciones[plazosOpc].value == 24) {
		parseFloat($("#tasasSeleccion").attr("placeholder", 4.19));
	} else if (opciones[plazosOpc].value == 36) {
		parseFloat($("#tasasSeleccion").attr("placeholder", 4.36));
	}
	parseFloat($("#tasasSeleccion").attr("placeholder"));
}

$(document).on("change", cambiarValorTasas);

;


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
$(".botonCalc").on("click", (e) => {
	e.preventDefault();
	client.calcularCuotas($("#aSolicitar").val(), parseFloat($("#tasasSeleccion").attr("placeholder")), $("#menuPlazos").val());
});

//Eventos boton enviar
$("#botonEnviar").on("click", (e) => {
	e.preventDefault();
	client.creacionClientes(
		$("#nombre").val(),
		$("#apellido").val(),
		$("#mail").val(),
		$("#empleo").val(),
		$("#antiguedad").val(),
		$("#sueldo").val(),
		parseInt($("#aSolicitar").val()),
		parseInt($("#menuPlazos").val()),
		parseFloat($("#tasasSeleccion").attr("placeholder")),
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
