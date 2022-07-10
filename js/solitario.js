/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [8, 9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes				
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");
let tapete_extra     = document.getElementById("extra");

// Mazos
let mazo_inicial   = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];
let mazo_extra = [];

var mazos_receptores = {"receptor1": mazo_receptor1, "receptor2": mazo_receptor2, "receptor3": mazo_receptor3, "receptor4": mazo_receptor4};

// Contadores de cartas
let cont_inicial     = document.getElementById("contador_inicial");
let cont_sobrantes   = document.getElementById("contador_sobrantes");
let cont_receptor1   = document.getElementById("contador_receptor1");
let cont_receptor2   = document.getElementById("contador_receptor2");
let cont_receptor3   = document.getElementById("contador_receptor3");
let cont_receptor4   = document.getElementById("contador_receptor4");
let cont_extra       = document.getElementById("contador_extra");
let cont_movimientos = document.getElementById("contador_movimientos");

var contadores_receptores = {"receptor1": cont_receptor1, "receptor2": cont_receptor2, "receptor3": cont_receptor3, "receptor4": cont_receptor4};

// Tiempo
var cont_tiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;


comenzar_juego();


// Desarrollo del comienzo de juego
function comenzar_juego() {
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

	// Configurar los eventos para las cartas y los tapetes
	configurar_eventos();
	
	// Arrancar el conteo de tiempo
	arrancar_tiempo();

} // comenzar_juego


function vaciar_mesa() {

	mazo_inicial.length = 0;
	mazo_sobrantes.length = 0;
	mazo_receptor1.length = 0;
	mazo_receptor2.length = 0;
	mazo_receptor3.length = 0;
	mazo_receptor4.length = 0;
	mazo_extra.length = 0;

	tapete_inicial.replaceChildren(cont_inicial);
	tapete_sobrantes.replaceChildren(cont_sobrantes);
	tapete_receptor1.replaceChildren(cont_receptor1);
	tapete_receptor2.replaceChildren(cont_receptor2);
	tapete_receptor3.replaceChildren(cont_receptor3);
	tapete_receptor4.replaceChildren(cont_receptor4);
	tapete_extra.replaceChildren(cont_extra);

} // vaciar_mesa


function inicializar_contadores() {

	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_extra, 0);
	set_contador(cont_movimientos, 0);

} // inicializar_contadores


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

} // crear_mazo_inicial


function barajar(mazo) {

	mazo.sort(()=> Math.random() - 0.5);

} // barajar


function cargar_tapete_inicial(mazo) {

	for(i=0; i<mazo.length; i++){
		let carta = mazo[i];
		carta.style.top = i*paso + "px";
		carta.style.left = i*paso + "px"
		carta.style.transform = "";
		carta.setAttribute("draggable", false);
		tapete_inicial.appendChild(carta);
	}

	mazo[mazo.length-1].setAttribute("draggable", true);
	set_contador(cont_inicial, mazo.length);

} // cargar_tapete_inicial


function arrancar_tiempo(){

	if (temporizador) clearInterval(temporizador);

	let interval = function (){
			let tiempo = hms(segundos);
			set_contador(cont_tiempo, tiempo);
            segundos++;
		}

	segundos = 0;
    interval(); // Primera visualización 00:00:00
	temporizador = setInterval(interval, 1000);
    	
} // arrancar_tiempo


function hms (segundos) {

	let seg = Math.trunc( segundos % 60 );
	let min = Math.trunc( (segundos % 3600) / 60 );
	let hor = Math.trunc( (segundos % 86400) / 3600 );
	let tiempo = ( (hor<10)? "0"+hor : ""+hor ) 
				+ ":" + ( (min<10)? "0"+min : ""+min )  
				+ ":" + ( (seg<10)? "0"+seg : ""+seg );
	return tiempo;

} // hms


function inc_contador(contador){

    contador.innerHTML = +contador.innerHTML + 1;

} // inc_contador


function dec_contador(contador){

	contador.innerHTML = +contador.innerHTML - 1;

} // dec_contador


function set_contador(contador, valor) {

	contador.innerHTML = valor;

} // set_contador


function configurar_eventos() {

	configurar_eventos_cartas();
	configurar_eventos_tapetes();

} // configurar_eventos


function configurar_eventos_cartas() {

	for (i=0; i< mazo_inicial.length; i++) {
		let carta = mazo_inicial[i];
		carta.ondragstart = al_mover;
		carta.ondrag = function(){};
		carta.ondragend = function(){};
	}

} // configurar_eventos_cartas


function al_mover(e) {

	e.dataTransfer.setData( "text/plain/numero", e.target.dataset["numero"] ); 
	e.dataTransfer.setData( "text/plain/palo", e.target.dataset["palo"] ); 
	e.dataTransfer.setData( "text/plain/id", e.target.id );

} // al mover


function configurar_eventos_tapetes() {

	conectar_eventos_tapete(tapete_sobrantes);
	conectar_eventos_tapete(tapete_receptor1);
	conectar_eventos_tapete(tapete_receptor2);
	conectar_eventos_tapete(tapete_receptor3);
	conectar_eventos_tapete(tapete_receptor4);
	conectar_eventos_tapete(tapete_extra);

} // configurar_eventos_tapetes


function conectar_eventos_tapete(tapete) {

	tapete.ondragenter = function(e) { e.preventDefault(); }; 
	tapete.ondragover = function(e) { e.preventDefault(); }; 
	tapete.ondragleave = function(e) { e.preventDefault(); }; 
	tapete.ondrop = al_soltar;

} // conectar_eventos_tapetes


function al_soltar(e) {

	e.preventDefault();
	let id_carta = e.dataTransfer.getData("text/plain/id");
	let numero_carta = e.dataTransfer.getData("text/plain/numero");
	let palo_carta = e.dataTransfer.getData("text/plain/palo");
	let color_carta = (palo_carta == "cua" || palo_carta == "viu")? "naranja" : "gris";
	let carta = document.getElementById(id_carta);
	let tapete_origen = carta.parentNode.id;

	if (this.id == "sobrantes") {
		soltar_en_sobrantes(this, tapete_origen, carta);
	} else if (this.id == "extra") {
		soltar_en_extra(this, tapete_origen, carta, color_carta, numero_carta);
	} else {
		soltar_en_receptores(this, tapete_origen, carta, color_carta, numero_carta);
	}

} // al_soltar


function soltar_en_sobrantes(tapete_sobrantes, tapete_origen, carta) {

	if (tapete_origen == "inicial") {

		inc_contador(cont_movimientos);
		dejar_carta(carta, tapete_sobrantes);
		inc_contador(cont_sobrantes);
		dec_contador(cont_inicial);
	
		mazo_sobrantes.push(mazo_inicial.pop());
		if (mazo_inicial.length == 0) {volver_a_barajar();}
		mazo_inicial[mazo_inicial.length-1].setAttribute("draggable", true);		
	
	}

} // soltar_en_sobrantes


function soltar_en_extra(tapete_extra, tapete_origen, carta, color_carta, numero_carta) {

	let ultima_carta = mazo_extra[mazo_extra.length-1];

	let condicion_primera_carta = (ultima_carta === undefined);
	let condicion_numero_color = ver_condicion_numero_color(ultima_carta, numero_carta, color_carta);

	if (condicion_primera_carta || condicion_numero_color) {

		inc_contador(cont_movimientos);
		inc_contador(cont_extra);
		carta.setAttribute("draggable", condicion_primera_carta);
		dejar_carta_en_extra(carta, tapete_extra, mazo_extra.length);

		mover_cartas_entre_mazos(tapete_origen, mazo_extra);

	}

} // soltar_en_extra


function soltar_en_receptores(receptor_destino, tapete_origen, carta, color_carta, numero_carta) {

	let mazo_receptor = mazos_receptores[receptor_destino.id];
	let contador_receptor = contadores_receptores[receptor_destino.id];

	let ultima_carta = mazo_receptor[mazo_receptor.length-1];

	let condicion_primera_carta = (numero_carta == "12" && ultima_carta === undefined);
	let condicion_numero_color = ver_condicion_numero_color(ultima_carta, numero_carta, color_carta);

	if (condicion_primera_carta || condicion_numero_color) {

		console.log("Carta aceptada!");

		inc_contador(cont_movimientos);
		inc_contador(contador_receptor);
		carta.setAttribute("draggable", false);
		dejar_carta(carta, receptor_destino);

		mover_cartas_entre_mazos(tapete_origen, mazo_receptor, receptor_destino, contador_receptor);

		comprobar_victoria();

	}

} // soltar_en_receptores


function ver_condicion_numero_color(ultima_carta, numero_carta, color_carta) {

	if (ultima_carta) {
		let palo_ultima_carta = ultima_carta.dataset["palo"];
		let color_ultima_carta = (palo_ultima_carta == "cua" || palo_ultima_carta == "viu")? "naranja" : "gris";

		return numero_carta == ultima_carta.dataset["numero"]-1 && color_carta != color_ultima_carta;
	}

	return false;

} // ver_condicion_numero_color


function mover_cartas_entre_mazos(tapete_origen, mazo_destino, tapete_destino, contador_destino) {

	console.log("Tapete origen: " + tapete_origen);
	switch (tapete_origen) {
		case "inicial":
			mover_desde_inicial(mazo_destino);
			break;
		case "sobrantes":
			mover_desde_sobrantes(mazo_destino);
			break;
		case "extra":
			mover_desde_extras(mazo_destino, tapete_destino, contador_destino);
			break;
	}

} // mover_cartas_entre_mazos


function mover_desde_inicial(mazo_destino) {

	dec_contador(cont_inicial);
	mazo_destino.push(mazo_inicial.pop());
	if (mazo_inicial.length == 0 && mazo_sobrantes.length != 0) {volver_a_barajar();}
	if (mazo_inicial.length > 0) {mazo_inicial[mazo_inicial.length-1].setAttribute("draggable", "true");}

} // mover_desde_inicial


function mover_desde_sobrantes(mazo_destino) {

	dec_contador(cont_sobrantes);
	mazo_destino.push(mazo_sobrantes.pop());

} // mover_desde_sobrantes


function mover_desde_extras(mazo_receptor, receptor_destino, contador_receptor) {
	
	for (i=0; i<mazo_extra.length; i++) {
		let carta = mazo_extra[i];
		carta.setAttribute("dragabble", false);
		mazo_receptor.push(carta);
		dejar_carta(carta, receptor_destino);
	}

	set_contador(contador_receptor, mazo_receptor.length);
	set_contador(cont_extra, 0);
	mazo_extra.length = 0;
	tapete_extra.replaceChildren(cont_extra);

} // mover_desde_extras


function dejar_carta(carta, tapete){

	carta.style.top = "50%";
	carta.style.left = "50%";
	carta.style.transform = "translate(-50%, -50%)";
	tapete.appendChild(carta);

} // dejar_carta

function dejar_carta_en_extra(carta, tapete, i){

	carta.style.top = "50%";
	carta.style.left = 15 + paso*i + "%";
	carta.style.transform = "translate(-50%, -50%)";
	tapete.appendChild(carta);
	
} // dejar_carta_en_extra


function volver_a_barajar() {

	let cantidad_sobrantes = mazo_sobrantes.length;
	for (i=0; i<cantidad_sobrantes; i++) {
		mazo_inicial.push(mazo_sobrantes.pop());
	}

	barajar(mazo_inicial);
	cargar_tapete_inicial(mazo_inicial);
	tapete_sobrantes.replaceChildren(cont_sobrantes);
	set_contador(cont_sobrantes, 0);

} // volver_a_barajar


function comprobar_victoria() {
	
	if (mazo_inicial.length==0 && mazo_sobrantes.length==0 && mazo_extra.length==0) {
		clearInterval(temporizador);
		alert("¡Has ganado! Has tardado " + hms(segundos-1) + " en completarlo y has utilizado " + cont_movimientos.innerHTML + " movimientos. Reinicia si quieres volver a jugar.");
	}

} // comprobar_victoria