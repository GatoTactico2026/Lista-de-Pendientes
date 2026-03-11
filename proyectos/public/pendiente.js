const elementos = document.getElementById("input-box");
const pendientes = document.getElementById("pendientes");
const realizado = document.getElementById("realizadas");

async function agregar() {
    const texto = elementos.value.trim();
    if (!texto) { alert("Debes escribir algo"); return; }
    
    const existente = pendientes.querySelectorAll("span");
    for (let p of existente) {
        if (p.textContent.toLowerCase() === texto.toLowerCase()) {
            alert("Esa tarea ya existe"); return;
        }
    }

    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center";
    li.innerHTML = `<i class="bi bi-square me-3" style="cursor:pointer"></i> <span>${texto}</span>`;
    pendientes.appendChild(li);
    elementos.value = "";
    await salvar();
}

async function mover() {
    const seleccionadas = pendientes.querySelectorAll(".marcada");
    seleccionadas.forEach(li => {
        li.classList.remove("marcada");
        li.classList.add("text-decoration-line-through", "text-muted");
        li.querySelector("i").className = "bi bi-square me-3";
        realizado.appendChild(li);
    });
    await salvar();
}

async function remover() {
    const seleccionadas = realizado.querySelectorAll(".marcada");
    seleccionadas.forEach(li => li.remove());
    await salvar();
}

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("bi-square") || e.target.classList.contains("bi-check-square-fill")) {
        const li = e.target.closest("li");
        const icono = li.querySelector("i");
        if (icono.classList.contains("bi-square")) {
            icono.className = "bi bi-check-square-fill me-3 text-primary";
            li.classList.add("marcada");
        } else {
            icono.className = "bi bi-square me-3";
            li.classList.remove("marcada");
        }
        await salvar();
    }
});

// Cargar estado desde el SERVIDOR al iniciar
async function cargar() {
    const res = await fetch('/api/estado');
    const data = await res.json();
    pendientes.innerHTML = data.pendientes;
    realizado.innerHTML = data.realizadas;
}

// Guardar estado en el SERVIDOR
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