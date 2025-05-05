const $nombreConteiner = document.getElementById("nombre-container");
const $nombre = document.getElementById("nombre");
const $button = document.getElementById("inicio");
const $tiempo = document.getElementById("timer");
const $pregunta = document.getElementById("pregunta");
const $img = document.getElementById("imagen");
const $opcion1 = document.getElementById("opcion-1");
const $opcion2 = document.getElementById("opcion-2");
const $opcion3 = document.getElementById("opcion-3");
const $opcion4 = document.getElementById("opcion-4");
const $tabla = document.getElementById("tabla");


let preguntasCorrectas = 0;
let preguntasIncorrectas = 0;
let respuestasCorrectas;
let promedioTiempoRespuestas;

let totalSegundos = 0;
let totalMinutos = 0;
let coronometro;




async function cargarPreguntaCapital() {
    const preguntasUtilizadasCapital = [];

    try {
    const res = await fetch("https://restcountries.com/v3.1/all")
    const data = await res.json();

        let paisAleatorio;  
        
        do{
        paisAleatorio = data[Math.floor(Math.random() * data.length)];
        } while (preguntasUtilizadasCapital.includes(paisAleatorio.name.common));

        preguntasUtilizadasCapital.push(paisAleatorio.name.common);

        const nombrePais = paisAleatorio.name.common;
        const capitalPais = paisAleatorio.capital[0];
        const opciones = [
            capitalPais,
            capitalNoRepetida(data, capitalPais),
            capitalNoRepetida(data, capitalPais),
            capitalNoRepetida(data, capitalPais),
        ];

        mezclarOpciones(opciones);

        $pregunta.textContent = `¿Cual es la capital de ${nombrePais}?`;
        $img.src = "";
        $img.style.display = "none";
        $opcion1.textContent = opciones[0];
        $opcion2.textContent = opciones[1];
        $opcion3.textContent = opciones[2];
        $opcion4.textContent = opciones[3];

        respuestasCorrectas = capitalPais;
        return data;

    }catch(error){
        console.log("Error al obtener datos: ", error)
    }; 

}


async function cargarPreguntaBandera() {
    const preguntasUtilizadasBandera = [];

    try {
     const res = await fetch("https://restcountries.com/v3.1/all")
    const data = await res.json();

    let paisAleatorio;  
        
    do{
    paisAleatorio = data[Math.floor(Math.random() * data.length)];
    } while (preguntasUtilizadasBandera.includes(paisAleatorio.name.common));

    preguntasUtilizadasBandera.push(paisAleatorio.name.common);

        const nombrePais = paisAleatorio.name.common;
        const banderaURL = paisAleatorio.flags.png;
        const opciones = [
            nombrePais,
            capitalNoRepetida(data, nombrePais),
            capitalNoRepetida(data, nombrePais),
            capitalNoRepetida(data, nombrePais),
        ];

        mezclarOpciones(opciones);

        $pregunta.textContent = `¿De que pais es esta bandera?`;
        $img.src = banderaURL;
        $img.style.display = "block";
        $opcion1.textContent = opciones[0];
        $opcion2.textContent = opciones[1];
        $opcion3.textContent = opciones[2];
        $opcion4.textContent = opciones[3];

        respuestasCorrectas = nombrePais;
        return data;
    }catch(error) {
        console.log("Error al obtener datos: ", error)
    };
}


function verificarRespuesta(e) {
    const $opcionSeleccionada = e.target.textContent;
    if($opcionSeleccionada === respuestasCorrectas) {
        preguntasCorrectas++;
        alert("¡Respuesta correcta!");
    } else {
        preguntasIncorrectas++;
        alert("Respuesta Incorrecta. La respuesta correcta es: " + respuestasCorrectas);
    }
    
    
    if(preguntasCorrectas + preguntasIncorrectas ===10) {
        promedioTiempoRespuestas = totalMinutos + totalSegundos / 10
        alert(`¡¡¡Juego Terminado!!!\nPreguntas correctas: ${preguntasCorrectas}\nPreguntas Incorrectas: ${preguntasIncorrectas}\nTiempo: ${totalMinutos}:${totalSegundos}\nPromedio de Tiempo Por Respuesta: ${promedioTiempoRespuestas} Seg`);

        solicitudPost();
        console.log(solicitudPost);
        
        console.log($nombre.value.trim(), preguntasCorrectas, `${totalMinutos}:${totalSegundos}`);
    
        const nombre = $nombre.value.trim();
        const respuestasCorrectas = preguntasCorrectas;
        const tiempo = `${totalMinutos}:${totalSegundos}`;
        $tabla.style.display = "block";
        datosTabla(nombre, respuestasCorrectas, tiempo);
        resetJuego();       

    } else {
        cargarPreguntasAleatorias();
    }
}

 async function solicitudPost() {
    try{
        const res = await fetch("http://localhost:3000/insertar_resultado", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: $nombre.value.trim(),
                respuestasCorrectas: preguntasCorrectas,
                tiempo: `${totalMinutos}:${totalSegundos}`,
            })
        })
        if(res.ok){
            return res.json();
        }else {
            throw new Error("Error al insertar datos");
        }
    }catch(error){
        console.log("Error al insertar datos: ", error);
    }
}




function datosTabla(nombre, respuestasCorrectas, tiempo) {
        const tablaResultados = document.getElementById('tabla-resultados');
        const nuevaFila = tablaResultados.insertRow();

        nombre = nuevaFila.insertCell(0);
        nombre.textContent = $nombre.value.trim();

        respuestasCorrectas = nuevaFila.insertCell(1);
        respuestasCorrectas.textContent = preguntasCorrectas;

        tiempo = nuevaFila.insertCell(2);
        tiempo.textContent = totalMinutos + ":" + totalSegundos;
}


function cargarPreguntasAleatorias() {
    const tipoPreguntas = Math.random() < 0.5 ? "capital" : "bandera";
    if(tipoPreguntas === "bandera") {
        cargarPreguntaBandera();
    } else {
        cargarPreguntaCapital();
    }
}
   
    
$button.addEventListener("click", comenzarJuego);
    


function capitalNoRepetida(data, capitalCorrecta) {
    let capitalAleatoria;
    do {
        const paisAleatorio = data[Math.floor(Math.random() * data.length)];
        capitalAleatoria = paisAleatorio.capital[0];
    } while (capitalAleatoria === capitalCorrecta);
    return capitalAleatoria;
} 

function mezclarOpciones(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function startTimer() {
    
    let seconds = 0;
   const s = document.getElementById("seg");
   const m = document.getElementById("min");
    
    coronometro = setInterval(() => {
        seconds++;
        
       let secs = seconds;
       let mins = 0;
        
        while(secs>=60) {
            mins++;
            secs-=60;
        }
        
        if(mins<10) m.textContent = 0 + mins;
        else m.innerHTML = mins;
        if(secs<10) s.textContent = 0 + secs;
        else s.innerHTML = secs;
        
        
        totalSegundos = secs;
        totalMinutos = mins;
        
        
    },1000);
}



function resetTimer() {
    clearInterval(coronometro);

}


function comenzarJuego() {
    const nombre = $nombre.value.trim();
    if(nombre === "") {
        alert("Por Favor, ingre su nombre para comenzar el juego");
    } else {
        $nombreConteiner.style.display = "none";
        $tiempo.style.display = "block";
        $pregunta.style.display = "block";
        $opcion1.style.display = "block";
        $opcion2.style.display = "block";
        $opcion3.style.display = "block";
        $opcion4.style.display = "block";
       
        cargarPreguntasAleatorias();
        startTimer();
            
    }
}


function resetJuego() {
    preguntasCorrectas = 0;
    preguntasIncorrectas = 0;
    totalSegundos = 0;
    totalMinutos = 0;
    promedioTiempoRespuestas = 0;
    resetTimer();


    $nombreConteiner.style.display = "block";
    $img.style.display = "none";
    $tiempo.style.display = "none";
    $pregunta.style.display = "none";
    $opcion1.style.display = "none";
    $opcion2.style.display = "none";
    $opcion3.style.display = "none";
    $opcion4.style.display = "none";

    $nombre.value = "";


}


$opcion1.addEventListener("click", verificarRespuesta);
$opcion2.addEventListener("click", verificarRespuesta);
$opcion3.addEventListener("click", verificarRespuesta);
$opcion4.addEventListener("click", verificarRespuesta);
