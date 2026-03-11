const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
// Sirve automáticamente los archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Almacenamiento en memoria (Simula base de datos)
let estado = {
    pendientes: "",
    realizadas: ""
};

// API: Obtener estado actual
app.get('/api/estado', (req, res) => {
    res.json(estado);
});

// API: Guardar nuevo estado
app.post('/api/guardar', (req, res) => {
    estado.pendientes = req.body.pendientes;
    estado.realizadas = req.body.realizadas;
    res.sendStatus(200);
});

// Escuchar en 0.0.0.0 para acceso por red local
app.listen(8080, '0.0.0.0', () => {
    console.log("Servidor distribuido corriendo en http://0.0.0.0:8080");
});