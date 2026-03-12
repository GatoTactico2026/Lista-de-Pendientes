const express = require('express'); // framework web
const app = express();
const path = require('path'); // utilidades de ruta

app.use(express.json()); // analiza JSON de peticiones

// Usamos path.join para evitar errores de rutas en Windows/Linux
app.use(express.static(path.join(__dirname, 'proyectos', 'public'))); // sirve archivos estáticos

let estado = { pendientes: "", realizadas: "" }; // estado guardado en memoria
let nombres = [];  // lista para prevenir duplicados

// Función para sincronizar el array de nombres con el HTML guardado
function sincronizarNombres() {
    nombres = [];
    const regex = /<span>(.*?)<\/span>/g;
    let match;
    
    // Extraer nombres de pendientes
    while ((match = regex.exec(estado.pendientes)) !== null) {
        nombres.push(match[1].toLowerCase()); // agrega en minúsculas
    }
    
    // Extraer nombres de realizadas
    regex.lastIndex = 0; 
    while ((match = regex.exec(estado.realizadas)) !== null) {
        nombres.push(match[1].toLowerCase()); // idem completadas
    }
}

// Ruta para servir el index.html explícitamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'proyectos', 'public', 'index.html')); // envía la página principal
});

app.get('/api/estado', (req, res) => res.json(estado));

app.post('/api/agregar', (req, res) => {
    const { nombre } = req.body; // recibe nombre de tarea
    if (!nombre || nombres.includes(nombre.toLowerCase())) return res.status(400).send(); // valida
    
    nombres.push(nombre.toLowerCase()); // añade para evitar duplicados
    res.status(201).send(); // responde creado
});

app.post('/api/guardar', (req, res) => {
    estado = req.body; // actualiza estado global
    sincronizarNombres(); 
    res.sendStatus(200); // confirmación
});

app.listen(8080, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://0.0.0.0:8080');
});