const express = require("express");
const cors = require("cors");
const app = express();
const PUERTO = 3000;

app.use(cors());
app.use(express.json());

let resultados = []; // Guardamos las partidas

// Preguntas simuladas sobre capitales
const preguntas = [
    { pais: "Argentina", capital: "Buenos Aires" },
    { pais: "Francia", capital: "París" },
    { pais: "España", capital: "Madrid" },
    { pais: "Italia", capital: "Roma" },
    { pais: "Japón", capital: "Tokio" },
];

// Ruta para obtener una pregunta aleatoria
app.get("/obtener_pregunta", (req, res) => {
    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    res.json(preguntaAleatoria);
});

// Ruta para guardar los resultados
app.post("/guardar_resultado", (req, res) => {
    const { nombre, respuestasCorrectas, tiempo, puntaje } = req.body;
    resultados.push({ nombre, respuestasCorrectas, tiempo, puntaje });
    res.status(201).json({ mensaje: "Resultado guardado con éxito" });
});

// Ruta para obtener el ranking
app.get("/ranking", (req, res) => {
    const top20 = resultados
        .sort((a, b) => b.puntaje - a.puntaje || a.tiempo.localeCompare(b.tiempo))
        .slice(0, 20);
    res.json(top20);
});

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
