//Array datosClientes - Class Clientes

const datosClientes = [];

class Clientes {
	constructor() {
		this.client = {};
	}
	creacionClientes(
		nombre,
		apellido,
		email,
		empleo,
		antiguedad,
		sueldo,
		monto,
		plazo,
		tasas,
		cuota
	) {
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
			cuota: cuota
		};
		datosClientes.push(this.client);
		localStorage.setItem("cliente", JSON.stringify(datosClientes));
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
		$("#tasasSeleccion")
			.attr("placeholder", "TEM(Tasa Efectiva Mensual)")
			.val("")
			.focus()
			.blur();
	} else if (opciones[plazosOpc].value == 12) {
		parseFloat($("#tasasSeleccion").attr("placeholder", 3.95));
	} else if (opciones[plazosOpc].value == 24) {
		parseFloat($("#tasasSeleccion").attr("placeholder", 4.19));
	} else if (opciones[plazosOpc].value == 36) {
		parseFloat($("#tasasSeleccion").attr("placeholder", 4.36));
	}
	parseFloat($("#tasasSeleccion").attr("placeholder"));
}

$(document).on("change", cambiarValorTasas);

//Eventos boton Calc
$(".botonCalc").on("click", (e) => {
	e.preventDefault();
	client.calcularCuotas(
		$("#aSolicitar").val(),
		parseFloat($("#tasasSeleccion").attr("placeholder")),
		$("#menuPlazos").val()
	);

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
});


//Eventos boton enviar
$("#botonEnviar").on("click", function(e){
	e.preventDefault()
	function generatePdf() {
		var doc = new jspdf.jsPDF();
		var offsetY = 4.797777777777778;
		var lineHeight = 6.49111111111111;
		var fontSize = 12;
		doc.text(85, 10, "Tabla de Prestamo");
		doc.autoTable({
			startY: 15,
			html: ".tftable",
			styles: { halign: "center" },
			headStyles: { fillColor: [124, 95, 240] },
			alternateRowStyles: { fillColor: [231, 215, 252] },
			tableLineColor: [124, 95, 240],
			tableLineWidth: 0.1,
		});
		doc.setFontSize(fontSize);
		var img = new Image();
		img.src = "images/signaturePDF.png";
		doc.addImage(
			img,
			"png",
			100,
			doc.autoTable.previous.finalY + lineHeight * 1.5 + offsetY,
			20,
			20
		);
		doc.text(
			90,
			doc.autoTable.previous.finalY + lineHeight * 5 + offsetY,
			"Juan Jose Urquiza"
		);
		doc.text(
			89,
			doc.autoTable.previous.finalY + lineHeight * 6 + offsetY,
			"Gerente FinanceAR"
		);
		doc.save("detallePrestamo.pdf");
	}
	generatePdf();
	const URL = 'https://jsonplaceholder.typicode.com/users'
	$.ajax({
		type: "POST",
		url: URL,
		data: client,
		success: function(result){     
			console.log(result);
		}
	});
	$('form').trigger("reset")
})

