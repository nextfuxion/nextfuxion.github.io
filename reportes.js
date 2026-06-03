async function cargarReportes(){

const contenedor =
document.getElementById(
"reportes"
);

const { data: pedidos } =

await supabaseClient
.from("pedidos")
.select("*");

const { data: clientes } =

await supabaseClient
.from("clientes")
.select("*");

let ventas = 0;

const productos = {};

(pedidos || []).forEach(
pedido=>{

ventas +=
Number(
pedido.total || 0
);

if(
pedido.productos
){

pedido.productos.forEach(
producto=>{

productos[
producto.nombre
] =

(productos[
producto.nombre
] || 0
)

+

Number(
producto.cantidad || 0
);

});

}

});

const ticketPromedio =

(pedidos || []).length

?

ventas /

pedidos.length

:

0;

let productoTop =
"Sin datos";

let cantidadTop =
0;

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

contenedor.innerHTML = `

<div class="card">

<h2>

💰 Ventas Totales

</h2>

<p>

$${ventas.toLocaleString("es-CO")}

</p>

</div>

<div class="card">

<h2>

📦 Pedidos

</h2>

<p>

${(pedidos || []).length}

</p>

</div>

<div class="card">

<h2>

👥 Clientes

</h2>

<p>

${(clientes || []).length}

</p>

</div>

<div class="card">

<h2>

🧾 Ticket Promedio

</h2>

<p>

$${ticketPromedio.toLocaleString("es-CO")}

</p>

</div>

<div class="card">

<h2>

🏆 Producto Más Vendido

</h2>

<p>

${productoTop}

</p>

</div>

`;

}

cargarReportes();
