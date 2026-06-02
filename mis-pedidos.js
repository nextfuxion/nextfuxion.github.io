async function cargarPedidos(){

const contenedor =
document.getElementById(
"listaPedidos"
);

contenedor.innerHTML =
"<p>Cargando pedidos...</p>";

try{

const { data, error } =

await supabaseClient
.from("pedidos")
.select("*")
.order(
"created_at",
{
ascending:false
}
);

if(error){

throw error;

}

if(
!data ||
data.length===0
){

contenedor.innerHTML =

`

<div class="card">

<h3>

No tienes pedidos registrados

</h3>

<p>

Cuando realices tu primera compra aparecerá aquí.

</p>

</div>

`;

return;

}

contenedor.innerHTML = "";

data.forEach(
pedido=>{

contenedor.innerHTML += `

<div class="card">

<h3>

${pedido.numero}

</h3>

<p>

📅 ${pedido.fecha}

</p>

<p>

👤 ${pedido.cliente_nombre}

</p>

<p>

📦 ${pedido.productos?.length || 0} productos

</p>

<p>

💰 $${Number(pedido.total).toLocaleString("es-CO")}

</p>

<p>

Estado:

<strong>

${pedido.estado}

</strong>

</p>

<button
onclick='verDetalle(${JSON.stringify(pedido)})'>

Ver detalle

</button>

</div>

`;

});

}catch(ex){

console.error(ex);

contenedor.innerHTML =

`

<div class="card">

<h3>

Error cargando pedidos

</h3>

<p>

${ex.message}

</p>

</div>

`;

}

}

function verDetalle(
pedido
){

let html =

`

<h2>

${pedido.numero}

</h2>

<p>

📅 ${pedido.fecha}

</p>

<p>

👤 ${pedido.cliente_nombre}

</p>

<p>

📱 ${pedido.cliente_telefono || ""}

</p>

<p>

📍 ${pedido.ciudad || ""}

</p>

<hr>

<h3>

Productos

</h3>

`;

if(
pedido.productos
){

pedido.productos.forEach(
p=>{

html += `

<p>

${p.cantidad} x ${p.nombre}

</p>

`;

});

}

html += `

<hr>

<h3>

💰 Total:

$${Number(pedido.total).toLocaleString("es-CO")}

</h3>

<p>

Estado:

${pedido.estado}

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

cargarPedidos();
