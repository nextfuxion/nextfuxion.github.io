async function cargarAdmin(){

const contenedor =
document.getElementById(
"ultimosPedidos"
);

contenedor.innerHTML =
"<p>Cargando...</p>";

try{

const { data: pedidos, error } =

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

let totalVentas = 0;

const clientes = {};

const productos = {};

let ventasHoy = 0;

const hoy =
new Date()
.toLocaleDateString();

pedidos.forEach(
pedido=>{

totalVentas +=
Number(
pedido.total || 0
);

if(
pedido.fecha &&
pedido.fecha.includes(hoy)
){

ventasHoy +=
Number(
pedido.total || 0
);

}

if(
pedido.cliente_nombre
){

clientes[
pedido.cliente_nombre
] =

(
clientes[
pedido.cliente_nombre
] || 0
)

+ 1;

}

if(
pedido.productos
){

pedido.productos.forEach(
p=>{

productos[
p.nombre
] =

(
productos[
p.nombre
] || 0
)

+

Number(
p.cantidad
);

});

}

}
);

document.getElementById(
"totalPedidos"
).innerText =
pedidos.length;

document.getElementById(
"totalVentas"
).innerText =

"$" +

totalVentas.toLocaleString(
"es-CO"
);

document.getElementById(
"ventasHoy"
).innerText =

"$" +

ventasHoy.toLocaleString(
"es-CO"
);

document.getElementById(
"totalClientes"
).innerText =

Object.keys(
clientes
).length;

const ticketPromedio =

pedidos.length

?

totalVentas /
pedidos.length

:

0;

document.getElementById(
"ticketPromedio"
).innerText =

"$" +

ticketPromedio.toLocaleString(
"es-CO"
);

let productoTop = "-";
let cantidadTop = 0;

for(
const nombre in productos
){

if(
productos[nombre] >
cantidadTop
){

cantidadTop =
productos[nombre];

productoTop =
nombre;

}

}

document.getElementById(
"productoTop"
).innerText =
productoTop;

let clienteTop = "-";
let comprasTop = 0;

for(
const nombre in clientes
){

if(
clientes[nombre] >
comprasTop
){

comprasTop =
clientes[nombre];

clienteTop =
nombre;

}

}

document.getElementById(
"clienteTop"
).innerText =
clienteTop;

contenedor.innerHTML = "";

pedidos
.slice(0,10)
.forEach(
pedido=>{

contenedor.innerHTML += `

<div class="card">

<h3>

${pedido.numero}

</h3>

<p>

👤 ${pedido.cliente_nombre}

</p>

<p>

📅 ${pedido.fecha}

</p>

<p>

💰 $${Number(pedido.total).toLocaleString("es-CO")}

</p>

<p>

Estado:
${pedido.estado}

</p>

</div>

`;

});

window.exportarCSV =
function(){

let csv =

"Pedido;Fecha;Cliente;Telefono;Total\n";

pedidos.forEach(
p=>{

csv +=

`${p.numero};`

+

`${p.fecha};`

+

`${p.cliente_nombre};`

+

`${p.cliente_telefono};`

+

`${p.total}\n`;

});

const blob =
new Blob(
[csv],
{
type:
"text/csv;charset=utf-8;"
}
);

const enlace =
document.createElement(
"a"
);

enlace.href =
URL.createObjectURL(
blob
);

enlace.download =
"pedidos-nextfuxion.csv";

enlace.click();

};

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

cargarAdmin();
