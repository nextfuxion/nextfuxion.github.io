function cargarBarraAdmin(){

const usuario =

localStorage.getItem(
"adminUser"
) || "Administrador";

const barra =
document.getElementById(
"adminBar"
);

if(!barra)return;

barra.innerHTML = `

<div class="admin-bar">

<span>

👤 ${usuario}

</span>

<button onclick="cerrarSesion()">

🚪 Salir

</button>

</div>

`;

}

function cerrarSesion(){

localStorage.removeItem(
"adminAuth"
);

localStorage.removeItem(
"adminUser"
);

window.location.href =
"login.html";

}

cargarBarraAdmin();
