document.addEventListener("DOMContentLoaded", () => { // espera que se cargue el DOM
    const input = document.getElementById("input-box"); // campo de texto de nueva tarea
    const pendientes = document.getElementById("pendientes"); // lista de pendientes
    const realizado = document.getElementById("realizadas"); // lista de completadas

    document.getElementById("btn-agregar").addEventListener("click", agregar);
    document.getElementById("btn-mover").addEventListener("click", mover);
    document.getElementById("btn-remover").addEventListener("click", remover); // boton borra realizadas

//Cargar mis archivos
    async function cargar() { // obtiene el estado guardado en el servidor
        const res = await fetch('/api/estado');
        const data = await res.json(); // parsea JSON recibido
        pendientes.innerHTML = data.pendientes; // rellena pendientes
        realizado.innerHTML = data.realizadas; // rellena realizadas
    }

    async function agregar() {
        const texto = input.value.trim(); // obtiene texto y quita espacios
        if (!texto) { alert("Debes escribir algo"); return; } // valida no vacío

        const res = await fetch('/api/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: texto })
        });

        if (res.status === 400) {
            alert("El servidor rechazó la tarea: Ya existe o está vacía");
        } else {
            input.value = "";

            const li = document.createElement("li"); // crea elemento lista
            li.style.marginBottom = "8px"; // separacion

            li.innerHTML = `
                <label>
                    <input type="checkbox" style="margin-right:8px; cursor:pointer;"> <!-- casilla -->
                    <span>${texto}</span> <!-- texto tarea -->
                </label>
            `;

            pendientes.appendChild(li);
            salvar();
        }
    }

    async function mover() { // mueve tareas seleccionadas a completadas
        const seleccionadas = pendientes.querySelectorAll(".marcada"); // items marcados

        seleccionadas.forEach(li => {
            li.classList.remove("marcada");
            li.style.textDecoration = "line-through";
            li.style.color = "gray";

            const checkbox = li.querySelector("input");
            checkbox.checked = false;

            realizado.appendChild(li);
        });

        salvar();
    }

    async function remover() { // borra tareas marcadas de realizadas
        realizado.querySelectorAll(".marcada").forEach(li => li.remove());
        salvar(); // guarda cambios
    }

    document.addEventListener("change", (e) => { // captura cambios en checkbox
        if (e.target.type === "checkbox") {
            const li = e.target.closest("li"); // item contenedor

            if (e.target.checked) {
                li.classList.add("marcada"); // marca para mover/borrar
            } else {
                li.classList.remove("marcada");
            }

            salvar(); // cada cambio se guarda
        }
    });

    async function salvar() { // envía HTML actual al servidor
        await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pendientes: pendientes.innerHTML, // contenido de la lista
                realizadas: realizado.innerHTML
            })
        });
    }

    cargar();
});