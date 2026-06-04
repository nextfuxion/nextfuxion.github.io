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

async function dashboardEjecutivo(){

const { data: metas } =

await supabaseClient
.from("metas")
.select("*");

const { data: tareas } =

await supabaseClient
.from("tareas")
.select("*");

const { data: pedidos } =

await supabaseClient
.from("pedidos")
.select("*");

const metaActual =

Number(
metas?.[0]?.meta || 0
);

let ventas = 0;

(pedidos || []).forEach(
p=>{
ventas +=
Number(
p.total || 0
);
});

document.getElementById(
"metaMensual"
).innerText =

"$" +

metaActual.toLocaleString(
"es-CO"
);

const cumplimiento =

metaActual

?

(
ventas /
metaActual
)*100

:

0;

document.getElementById(
"cumplimientoMeta"
).innerText =

cumplimiento.toFixed(1)

+

"%";

document.getElementById(
"totalAlertas"
).innerText = 0;

const pendientes =

(tareas || [])
.filter(
t=>
t.estado !==
"Completada"
)
.length;

document.getElementById(
"tareasPendientes"
).innerText =
pendientes;

const hoy =
new Date();

const diasMes =

new Date(
hoy.getFullYear(),
hoy.getMonth()+1,
0
).getDate();

const promedio =

ventas /

hoy.getDate();

const proyeccion =

promedio *
diasMes;

document.getElementById(
"proyeccionMes"
).innerText =

"$" +

Math.round(
proyeccion
).toLocaleString(
"es-CO"
);

const ventasPorDia = {};

(pedidos || []).forEach(
pedido=>{

let dia = 1;

// Si existe created_at usamos esa fecha
if(pedido.created_at){

const fecha =
new Date(
pedido.created_at
);

if(!isNaN(fecha)){

dia =
fecha.getDate();

}

}

ventasPorDia[dia] =

(ventasPorDia[dia] || 0)

+

Number(
pedido.total || 0
);

});

// ordenar los días
const dias =

Object.keys(
ventasPorDia
)
.sort(
(a,b)=>a-b
);

const valores =

dias.map(
dia=>
ventasPorDia[dia]
);

// evitar crear la gráfica dos veces
const canvas =
document.getElementById(
"ventasDashboard"
);

if(canvas){

new Chart(
canvas,
{
type:"line",

data:{
labels:dias,

datasets:[{
label:"Ventas",
data:valores
}]
},

options:{
responsive:true,
maintainAspectRatio:false
}
}
);

}
}

dashboardEjecutivo();
