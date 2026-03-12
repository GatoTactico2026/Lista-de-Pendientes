const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// Usamos path.join para evitar errores de rutas en Windows/Linux
app.use(express.static(path.join(__dirname, 'proyectos', 'public')));

let estado = { pendientes: "", realizadas: "" };
let nombres = []; 

// Función para sincronizar el array de nombres con el HTML guardado
function sincronizarNombres() {
    nombres = [];
    const regex = /<span>(.*?)<\/span>/g;
    let match;
    
    // Extraer nombres de pendientes
    while ((match = regex.exec(estado.pendientes)) !== null) {
        nombres.push(match[1].toLowerCase());
    }
    
    // Extraer nombres de realizadas
    regex.lastIndex = 0; 
    while ((match = regex.exec(estado.realizadas)) !== null) {
        nombres.push(match[1].toLowerCase());
    }
}

// Ruta para servir el index.html explícitamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'proyectos', 'public', 'index.html'));
});

app.get('/api/estado', (req, res) => res.json(estado));

app.post('/api/agregar', (req, res) => {
    const { nombre } = req.body;
    if (!nombre || nombres.includes(nombre.toLowerCase())) return res.status(400).send();
    
    nombres.push(nombre.toLowerCase());
    res.status(201).send();
});

app.post('/api/guardar', (req, res) => {
    estado = req.body;
    sincronizarNombres(); 
    res.sendStatus(200);
});

app.listen(8080, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://0.0.0.0:8080');
});