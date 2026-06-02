let clientesGlobal = [];

async function cargarClientes(){

const contenedor =
document.getElementById(
"listaClientes"
);

contenedor.innerHTML =
"<p>Cargando clientes...</p>";

try{

const { data, error } =

await supabaseClient
.from("clientes")
.select("*")
.order(
"total_compras",
{
ascending:false
}
);

if(error){

throw error;

}

clientesGlobal =
data || [];

document.getElementById(
"totalClientes"
).innerText =
clientesGlobal.length;

let totalFacturado = 0;

let totalPedidos = 0;

let mejorCliente = "-";

let mejorCompra = 0;

clientesGlobal.forEach(
cliente=>{

totalFacturado +=

Number(
cliente.total_compras || 0
);

totalPedidos +=

Number(
cliente.cantidad_pedidos || 0
);

if(
Number(
cliente.total_compras || 0
)
>
mejorCompra
){

mejorCompra =

Number(
cliente.total_compras || 0
);

mejorCliente =
cliente.nombre;

}

}
);

document.getElementById(
"clienteTop"
).innerText =
mejorCliente;

document.getElementById(
"totalFacturado"
).innerText =

"$" +

totalFacturado.toLocaleString(
"es-CO"
);

document.getElementById(
"totalPedidos"
).innerText =
totalPedidos;
  
mostrarClientes(
clientesGlobal
);

activarBusqueda();
mostrarRanking();
}catch(ex){

console.error(ex);

contenedor.innerHTML =

`

<div class="card">

<h3>

Error cargando clientes

</h3>

<p>

${ex.message}

</p>

</div>

`;

}

}

function mostrarClientes(
clientes
){

const contenedor =
document.getElementById(
"listaClientes"
);

contenedor.innerHTML = "";

if(
clientes.length===0
){

contenedor.innerHTML =

`

<div class="card">

<h3>

No se encontraron clientes

</h3>

</div>

`;

return;

}

clientes.forEach(
cliente=>{

contenedor.innerHTML += `

<div class="card">

<h3>

${cliente.nombre || "-"}

</h3>

<p>

📱 ${cliente.telefono || "-"}

</p>

<p>

📦 Pedidos:
${cliente.cantidad_pedidos || 0}

</p>

<p>

💰 Total:

$${Number(
cliente.total_compras || 0
).toLocaleString("es-CO")}

</p>

<button
onclick='verCliente(${JSON.stringify(cliente)})'>

Ver detalle

</button>

</div>

`;

});

}

function activarBusqueda(){

const buscador =
document.getElementById(
"busquedaCliente"
);

if(!buscador)return;

buscador.addEventListener(
"input",

e=>{

const texto =
e.target.value
.toLowerCase();

const filtrados =

clientesGlobal.filter(
c=>

(c.nombre || "")
.toLowerCase()
.includes(texto)

||

(c.telefono || "")
.toLowerCase()
.includes(texto)

);

mostrarClientes(
filtrados
);

}

);

}

function verCliente(
cliente
){

let html =

`

<h2>

${cliente.nombre}

</h2>

<p>

📱 ${cliente.telefono || "-"}

</p>

<p>

📧 ${cliente.correo || "-"}

</p>

<p>

🏙️ ${cliente.ciudad || "-"}

</p>

<p>

📍 ${cliente.direccion || "-"}

</p>

<hr>

<p>

📦 Pedidos:

${cliente.cantidad_pedidos || 0}

</p>

<p>

💰 Total Comprado:

$${Number(
cliente.total_compras || 0
).toLocaleString("es-CO")}

</p>

<p>

🕒 Última Compra:

${cliente.ultima_compra || "-"}

</p>

`;

document.getElementById(
"modalContenido"
).innerHTML =
html;

document.getElementById(
"modal"
).style.display =
"flex";

}

function cerrarModal(){

document.getElementById(
"modal"
).style.display =
"none";

}

window.onclick =
function(e){

const modal =
document.getElementById(
"modal"
);

if(
e.target===modal
){

cerrarModal();

}

};

cargarClientes();
function mostrarRanking(){

const contenedor =
document.getElementById(
"rankingClientes"
);

if(!contenedor)return;

const topClientes =

[...clientesGlobal]
.sort(
(a,b)=>

Number(
b.total_compras || 0
)

-

Number(
a.total_compras || 0
)

)
.slice(0,5);

let html = "";

topClientes.forEach(
(cliente,index)=>{

let medalla = "🏅";

if(index===0)
medalla="🥇";

if(index===1)
medalla="🥈";

if(index===2)
medalla="🥉";

html += `

<div class="card">

<h3>

${medalla}
${cliente.nombre}

</h3>

<p>

📱 ${cliente.telefono}

</p>

<p>

📦 ${cliente.cantidad_pedidos} pedidos

</p>

<p>

💰 $${Number(
cliente.total_compras || 0
).toLocaleString("es-CO")}

</p>

</div>

`;

});

contenedor.innerHTML =
html;

}

function obtenerCategoria(cliente){

const pedidos =

Number(
cliente.cantidad_pedidos || 0
);

if(pedidos >= 5){

return "🔵 VIP";

}

if(pedidos >= 2){

return "🟡 Frecuente";

}

return "🟢 Nuevo";

}
