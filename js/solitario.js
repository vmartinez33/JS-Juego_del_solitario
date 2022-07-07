/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes				
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial   = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

var mazos_receptores = {"receptor1": mazo_receptor1, "receptor2": mazo_receptor2, "receptor3": mazo_receptor3, "receptor4": mazo_receptor4};

// Contadores de cartas
let cont_inicial     = document.getElementById("contador_inicial");
let cont_sobrantes   = document.getElementById("contador_sobrantes");
let cont_receptor1   = document.getElementById("contador_receptor1");
let cont_receptor2   = document.getElementById("contador_receptor2");
let cont_receptor3   = document.getElementById("contador_receptor3");
let cont_receptor4   = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");

var contadores_receptores = {"receptor1": cont_receptor1, "receptor2": cont_receptor2, "receptor3": cont_receptor3, "receptor4": cont_receptor4};


// Tiempo
var cont_tiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

 
// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo de juego
function comenzar_juego() {
	/* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazo_inicial. 
	*/

	// Vaciar todos los mazos, tanto arrays como los tapetes (eliminar childs <img>)
	vaciar_mesa();

	// Se crean las cartas y se añaden al array del mazo inicial
	crear_mazo_inicial(mazo_inicial);
	
	// Barajar
	barajar(mazo_inicial);

	// Dejar mazo_inicial en tapete inicial
	cargar_tapete_inicial(mazo_inicial);

	// Puesta a cero de contadores de mazos
	inicializar_contadores();
	
	// Arrancar el conteo de tiempo
	arrancar_tiempo();

	// Configurar los eventos para las cartas y los tapetes
	configurar_eventos();
} // comenzar_juego

function vaciar_mesa() {
	mazo_inicial.length = 0;
	mazo_sobrantes.length = 0;
	mazo_receptor1.length = 0;
	mazo_receptor2.length = 0;
	mazo_receptor3.length = 0;
	mazo_receptor4.length = 0;

	tapete_inicial.replaceChildren(cont_inicial);
	tapete_sobrantes.replaceChildren(cont_sobrantes);
	tapete_receptor1.replaceChildren(cont_receptor1);
	tapete_receptor2.replaceChildren(cont_receptor2);
	tapete_receptor3.replaceChildren(cont_receptor3);
	tapete_receptor4.replaceChildren(cont_receptor4);
}

function inicializar_contadores() {
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);
}

function crear_mazo_inicial(mazo){
	for (i=0; i<numeros.length; i++){
		for (j=0; j<palos.length; j++){
			let id = + numeros[i] + "-" + palos[j];
			let source = "imagenes/baraja/" + id + ".png";
			let carta_nueva = document.createElement("img");
			carta_nueva.setAttribute("src", source);
			carta_nueva.setAttribute("data-numero", numeros[i]);
			carta_nueva.setAttribute("data-palo", palos[j]);
			carta_nueva.setAttribute("class", "carta");
			carta_nueva.setAttribute("id", id);
			mazo.push(carta_nueva);
		}
	}
}

/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

function arrancar_tiempo(){
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	
	if (temporizador) clearInterval(temporizador);
	let hms = function (){
			let seg = Math.trunc( segundos % 60 );
			let min = Math.trunc( (segundos % 3600) / 60 );
			let hor = Math.trunc( (segundos % 86400) / 3600 );
			let tiempo = ( (hor<10)? "0"+hor : ""+hor ) 
						+ ":" + ( (min<10)? "0"+min : ""+min )  
						+ ":" + ( (seg<10)? "0"+seg : ""+seg );
			set_contador(cont_tiempo, tiempo);
            segundos++;
		}
	segundos = 0;
    hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);
    	
} // arrancar_tiempo


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
*/
function barajar(mazo) {
	mazo.sort(()=> Math.random() - 0.5);
} // barajar



/**
 	En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(mazo) {	
	for(i=0; i<mazo.length; i++){
		let carta = mazo[i];
		carta.style.width = "50px";
		carta.style.position = "absolute";
		carta.style.boxSizing = "content-box";
		carta.style.paddingLeft = i*5 + "px"; 
		carta.style.paddingTop = i*5 + "px";
		carta.setAttribute("draggable", "false");
		tapete_inicial.appendChild(carta);
	}
	mazo[mazo.length-1].setAttribute("draggable", "true");
	set_contador(cont_inicial, mazo.length);
} // cargar_tapete_inicial


/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function inc_contador(contador){
    contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando 
*/
function dec_contador(contador){
	contador.innerHTML = +contador.innerHTML - 1;
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function set_contador(contador, valor) {
	contador.innerHTML = valor;
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // set_contador


function configurar_eventos() {
	configurar_eventos_cartas();
	configurar_eventos_tapetes();
}

function configurar_eventos_cartas() {
	for (i=0; i< mazo_inicial.length; i++) {
		let carta = mazo_inicial[i];
		carta.ondragstart = al_mover;
		carta.ondrag = function(){};
		carta.ondragend = function(){};
	}
}

function al_mover(e) {
	e.dataTransfer.setData( "text/plain/numero", e.target.dataset["numero"] ); 
	e.dataTransfer.setData( "text/plain/palo", e.target.dataset["palo"] ); 
	e.dataTransfer.setData( "text/plain/id", e.target.id );
}

function configurar_eventos_tapetes() {
	conectar_eventos_tapete(tapete_sobrantes);
	conectar_eventos_tapete(tapete_receptor1);
	conectar_eventos_tapete(tapete_receptor2);
	conectar_eventos_tapete(tapete_receptor3);
	conectar_eventos_tapete(tapete_receptor4);
}

function conectar_eventos_tapete(tapete) {
	tapete.ondragenter = function(e) { e.preventDefault(); }; 
	tapete.ondragover = function(e) { e.preventDefault(); }; 
	tapete.ondragleave = function(e) { e.preventDefault(); }; 
	tapete.ondrop = drop_event;
}

function drop_event(e) {

	e.preventDefault();
	let id_carta = e.dataTransfer.getData("text/plain/id");
	let numero_carta = e.dataTransfer.getData("text/plain/numero");
	let palo_carta = e.dataTransfer.getData("text/plain/palo");
	let color_carta = (palo_carta == "cua" || palo_carta == "viu")? "naranja" : "gris";
	let carta = document.getElementById(id_carta);
	let tapete_origen = carta.parentNode.id;

	if (this.id == "sobrantes") {
		gestionar_sobrantes(this, tapete_origen, carta);
	} else {
		gestionar_receptores(this, tapete_origen, carta, color_carta, numero_carta);
	}

}

function gestionar_sobrantes(tapete_sobrantes, tapete_origen, carta) {

	if (tapete_origen != "sobrantes") {
		inc_contador(cont_movimientos);
		dejar_carta(carta, tapete_sobrantes);
		inc_contador(cont_sobrantes);
		dec_contador(cont_inicial);
	
		mazo_sobrantes.push(mazo_inicial.pop());
		
		console.log(mazo_inicial.length == 0 && mazo_sobrantes.length != 0);

		if (mazo_inicial.length == 0 && mazo_sobrantes.length != 0) {
			volver_a_barajar();
		}

		mazo_inicial[mazo_inicial.length-1].setAttribute("draggable", "true");		

		comprobar_victoria()
	}

}


function volver_a_barajar() {
	for (i=0; i<mazo_sobrantes.length; i++) {
		mazo_inicial.push(mazo_sobrantes.pop());
	}

	barajar(mazo_inicial);
	cargar_tapete_inicial(mazo_inicial);
	tapete_sobrantes.replaceChildren(cont_sobrantes);
	set_contador(cont_sobrantes, 0);
}


function gestionar_receptores(receptor_destino, tapete_origen, carta, color_carta, numero_carta) {

	let mazo = mazos_receptores[receptor_destino.id];
	let contador = contadores_receptores[receptor_destino.id];

	let ultima_carta = mazo[mazo.length-1];

	let condicion1 = (numero_carta == "12" && ultima_carta === undefined);
	
	if (ultima_carta) {
		let palo_ultima_carta = ultima_carta.dataset["palo"];
		let color_ultima_carta = (palo_ultima_carta == "cua" || palo_ultima_carta == "viu")? "naranja" : "gris";
		var condicion2 = (numero_carta == ultima_carta.dataset["numero"]-1 && color_carta != color_ultima_carta);
	} 

	console.log("La condición es: " + (condicion1 || condicion2));

	if (condicion1 || condicion2) {
		dejar_carta(carta, receptor_destino);
		inc_contador(contador);
		inc_contador(cont_movimientos);
		carta.setAttribute("draggable", "false");

		if (tapete_origen == "inicial") {
			dec_contador(cont_inicial);
			mazo.push(mazo_inicial.pop());
			if (mazo_inicial.length > 0) {mazo_inicial[mazo_inicial.length-1].setAttribute("draggable", "true");}
		} else {
			dec_contador(cont_sobrantes)
			mazo.push(mazo_sobrantes.pop());
		}

		comprobar_victoria()
	}

}

function dejar_carta(carta, tapete){
	carta.style.padding = "0px 0px 0px 0px";
	carta.style.top = "50%";
	carta.style.left = "50%";
	carta.style.transform = "translate(-50%, -50%)";
	tapete.appendChild(carta);
}

function comprobar_victoria() {
	if (mazo_inicial.length==0 && mazo_sobrantes.length==0) {
		console.log("Has ganado");
	}
}

comenzar_juego();


