document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input-box");
    const pendientes = document.getElementById("pendientes");
    const realizado = document.getElementById("realizadas");

    document.getElementById("btn-agregar").addEventListener("click", agregar);
    document.getElementById("btn-mover").addEventListener("click", mover);
    document.getElementById("btn-remover").addEventListener("click", remover);

//Cargar mis archivos
    async function cargar() {
        const res = await fetch('/api/estado');
        const data = await res.json();
        pendientes.innerHTML = data.pendientes;
        realizado.innerHTML = data.realizadas;
    }

    async function agregar() {
        const texto = input.value.trim();
        if (!texto) { alert("Debes escribir algo"); return; }

        const res = await fetch('/api/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: texto })
        });

        if (res.status === 400) {
            alert("El servidor rechazó la tarea: Ya existe o está vacía");
        } else {
            input.value = "";

            const li = document.createElement("li");
            li.style.marginBottom = "8px";

            li.innerHTML = `
                <label>
                    <input type="checkbox" style="margin-right:8px; cursor:pointer;">
                    <span>${texto}</span>
                </label>
            `;

            pendientes.appendChild(li);
            salvar();
        }
    }

    async function mover() {
        const seleccionadas = pendientes.querySelectorAll(".marcada");

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

    async function remover() {
        realizado.querySelectorAll(".marcada").forEach(li => li.remove());
        salvar();
    }

    document.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            const li = e.target.closest("li");

            if (e.target.checked) {
                li.classList.add("marcada");
            } else {
                li.classList.remove("marcada");
            }

            salvar();
        }
    });

    async function salvar() {
        await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pendientes: pendientes.innerHTML,
                realizadas: realizado.innerHTML
            })
        });
    }

    cargar();
});