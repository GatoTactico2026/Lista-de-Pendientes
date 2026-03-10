const http = require('http');
const fs = require('fs');
const path = require('path');

const servidor = http.createServer((req, res) => {
    const rutaArchivo = path.join(__dirname, 'index.html');

    fs.readFile(rutaArchivo, (error, data) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Error al cargar el archivo');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        }
    });
});

// Iniciamos el servidor
const PORT = 8080;
servidor.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});