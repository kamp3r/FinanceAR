//funciones menu hamburguesa
function mostrarMenu(){
	$('.navigationContainer').css({display: "flex"})
	$('.navigationContainer').css({top: "0"})
}
function cerrarMenu(){
	$('.navigationContainer').css({top: "-110%"})
}

$('.menuAbierto').on('click', mostrarMenu)
$('.menuCerrado').on('click', cerrarMenu)
$('.linkItem').on('click', cerrarMenu)

//Scroll
function animarLinks (link, haciaDonde){
	link.click(function (e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: haciaDonde.offset().top}, 2000)
		})
}
animarLinks($('#linkInicio'), $("#inicio"));
animarLinks($("#linkConfiar"), $("#confiarEn"));
animarLinks($("#linkServicios"), $("#servicios"));
animarLinks($("#linkSimulador"), $("#contenedorSimulador"));

//paso 1 a 2
function nextBackFormulario(boton,primerFormulario,segundoFormulario,width,paso,saturacion,valorOpacidad){
	boton.on("click", () => {
	primerFormulario.toggleClass('active animacionIzq');
	segundoFormulario.toggleClass('active');
    $('#progreso').width(width)
    paso.css({ filter: saturacion , opacity: valorOpacidad})
})
}

nextBackFormulario($("#siguiente1"), $("#paso-1"),$("#paso-2"),"23%",$('.paso1'),"invert(0) sepia(8) saturate(30) hue-rotate(260deg)" ,"1")
nextBackFormulario($("#anterior0"), $("#paso-1"),$("#paso-2"),'-23%',$('.paso1'),"invert(0) sepia(8) saturate(0) hue-rotate(260deg)","0.9")


//Paso 2 en adelante con validaciones

$("#paso-2").validate({
	rules: {
		nombre: { required: true, minlength: 2},
		apellido: { required: true, minlength: 2},
		mail: { required:true, email: true},
	},
	messages: {
		nombre: "El campo es obligatorio.",
		apellido: "El campo es obligatorio.",
		mail : "El campo es obligatorio y debe tener formato de email correcto.",
	}
});

function formulariosValidados(boton,primerFormulario,segundoFormulario,width,paso,saturacion,valorOpacidad){
	boton.on("click", () => {
	if (!primerFormulario.valid()) return false;	
	primerFormulario.toggleClass('active animacionIzq');
	segundoFormulario.toggleClass('active');
    $('#progreso').width(width)
    paso.css({ filter: saturacion , opacity: valorOpacidad})
})
}

formulariosValidados($("#siguiente2"), $('#paso-2'), $("#paso-3"),"50%",$('.paso2'),"invert(0) sepia(8) saturate(30) hue-rotate(260deg)","1")
nextBackFormulario($("#anterior1"), $('#paso-2'),$("#paso-3"),"25%",$('.paso2'),"invert(0) sepia(8) saturate(0) hue-rotate(260deg)","0.9")

//paso 3 a paso 4
$("#paso-3").validate({
	rules: {
		empleo: { required: true, minlength: 4},
		antiguedad: { required: true, number: true, digits:true, minlength: 1, min: 1},
		sueldo: { required:true, number: true, minlength: 5, min: 1},
	},
	messages: {
		empleo: "El campo es obligatorio.",
		antiguedad: "Ingresa un valor correcto, por encima de 1",
		sueldo: "Coloca un valor valido, por encima de los 10000 pesos",
	}
});
formulariosValidados($("#siguiente3"), $('#paso-3'), $("#paso-4"),"75%",$('.paso3'),"invert(0) sepia(8) saturate(30) hue-rotate(260deg)","1")
nextBackFormulario($("#anterior2"), $('#paso-3'), $("#paso-4"),"50%",$('.paso3'),"invert(0) sepia(8) saturate(0) hue-rotate(260deg)","0.9")

//meotodo validador para el Select
$.validator.addMethod("valorNoIgual", function(value, element, arg){
	return arg !== value;
   }, "Valor debe ser diferente al default.");

//paso 4 a 5
$("#paso-4").validate({
	rules: {
		monto: { required: true, minlength: 5, maxlength: 6, min: 1},
		menuPlazos: { required: true, valorNoIgual: "default"},
	},
	messages: {
		monto: "El campo es obligatorio. Recorda que aprobamos prestamos hasta $999.999 pesos",
		menuPlazos: {valorNoIgual: "Debes elegir una opcion del menu"}
	}
});
formulariosValidados($("#siguiente4"), $('#paso-4'), $("#paso-5"),"100%",$('.paso4'),"invert(0) sepia(8) saturate(30) hue-rotate(260deg)","1");


//finalizar el formulario y retornar a primer estadio
$('#botonEnviar').on('click', () =>{
	$('#paso-1').toggleClass('animacionIzq active')
	$('#paso-2').toggleClass('animacionIzq')
	$('#paso-3').toggleClass('animacionIzq')
	$('#paso-4').toggleClass('animacionIzq')
	$('#paso-5').toggleClass('active')
	$('#progreso').width('0%')
	$('.paso1').css({filter: "invert(0) sepia(8) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
	$('.paso2').css({filter: "invert(0) sepia(8) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
	$('.paso3').css({filter: "invert(0) sepia(8) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
	$('.paso4').css({filter: "invert(0) sepia(8) saturate(0) hue-rotate(260deg)", opacity: "0.9"})
}
)

