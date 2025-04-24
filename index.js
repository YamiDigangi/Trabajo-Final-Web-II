const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let resultados = []; // guardamos partidas acá

app.post("/insertar_resultado", (req, res) => {
    const { nombre, respuestasCorrectas, tiempo, puntaje } = req.body;
    resultados.push({ nombre, respuestasCorrectas, tiempo, puntaje });
    res.status(201).json({ mensaje: "Resultado guardado con éxito" });
});

app.get("/ranking", (req, res) => {
    const top20 = resultados
        .sort((a, b) => b.puntaje - a.puntaje || a.tiempo.localeCompare(b.tiempo))
        .slice(0, 20);
    res.json(top20);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

