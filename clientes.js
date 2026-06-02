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
mostrarOportunidades();
mostrarClientesInactivos();
mostrarPotencialesDistribuidores();
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

🏷️ ${obtenerCategoria(cliente)}

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

🏷️ Categoría:

${obtenerCategoria(cliente)}

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


function mostrarOportunidades(){

const contenedor =
document.getElementById(
"oportunidades"
);

if(!contenedor)return;

let html = "";

/* CLIENTES VIP */

const vip =

clientesGlobal.filter(
c=>

Number(
c.cantidad_pedidos || 0
) >= 5

);

html += `

<div class="card">

<h3>

🔵 Clientes VIP

</h3>

<p>

${vip.length}

</p>

</div>

`;

/* CLIENTES FRECUENTES */

const frecuentes =

clientesGlobal.filter(
c=>{

const pedidos =

Number(
c.cantidad_pedidos || 0
);

return pedidos >=2 && pedidos <5;

});

html += `

<div class="card">

<h3>

🟡 Clientes Frecuentes

</h3>

<p>

${frecuentes.length}

</p>

</div>

`;

/* CLIENTES NUEVOS */

const nuevos =

clientesGlobal.filter(
c=>

Number(
c.cantidad_pedidos || 0
) === 1

);

html += `

<div class="card">

<h3>

🟢 Clientes Nuevos

</h3>

<p>

${nuevos.length}

</p>

</div>

`;

contenedor.innerHTML =
html;

}


function mostrarClientesInactivos(){

const contenedor =
document.getElementById(
"clientesInactivos"
);

if(!contenedor)return;

const hoy =
new Date();

let html = "";

const inactivos =

clientesGlobal.filter(
cliente=>{

if(
!cliente.ultima_compra
)return false;

const ultima =
new Date(
cliente.ultima_compra
);

const dias =

(hoy - ultima)

/

(1000*60*60*24);

return dias > 30;

});

if(
inactivos.length===0
){

contenedor.innerHTML =

`

<div class="card">

<h3>

🎉 No hay clientes inactivos

</h3>

</div>

`;

return;

}

inactivos.forEach(
cliente=>{

html += `

<div class="card">

<h3>

${cliente.nombre}

</h3>

<p>

📱 ${cliente.telefono}

</p>

<p>

📦 ${cliente.cantidad_pedidos}

pedidos

</p>

<p>

💰 $${Number(
cliente.total_compras || 0
).toLocaleString("es-CO")}

</p>

<a
target="_blank"
href="https://wa.me/57${cliente.telefono}?text=Hola%20${encodeURIComponent(cliente.nombre)},%20quería%20contarte%20sobre%20las%20novedades%20de%20FuXion.">

Contactar

</a>

</div>

`;

});

contenedor.innerHTML =
html;

}

function mostrarPotencialesDistribuidores(){

const contenedor =
document.getElementById(
"potencialesDistribuidores"
);

if(!contenedor)return;

let html = "";

const candidatos =

clientesGlobal.filter(
cliente=>{

const pedidos =

Number(
cliente.cantidad_pedidos || 0
);

const total =

Number(
cliente.total_compras || 0
);

return (

pedidos >= 3

||

total >= 300000

);

});

if(
candidatos.length===0
){

contenedor.innerHTML =

`

<div class="card">

<h3>

No hay candidatos todavía

</h3>

</div>

`;

return;

}

candidatos.forEach(
cliente=>{

html += `

<div class="card">

<h3>

💎 ${cliente.nombre}

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

<a
target="_blank"
href="https://wa.me/57${cliente.telefono}?text=Hola%20${encodeURIComponent(cliente.nombre)},%20he%20notado%20tu%20interés%20en%20los%20productos%20FuXion.%20Quisiera%20contarte%20sobre%20los%20beneficios%20de%20ser%20Cliente%20Preferente%20o%20Distribuidor.">

Invitar

</a>

</div>

`;

});

contenedor.innerHTML =
html;

}
