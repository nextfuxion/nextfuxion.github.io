async function cargarRankings(){

const { data: clientes } =

await supabaseClient
.from("clientes")
.select("*");

const { data: pedidos } =

await supabaseClient
.from("pedidos")
.select("*");

cargarTopClientes(
clientes || []
);

cargarTopProductos(
pedidos || []
);

cargarTopCiudades(
pedidos || []
);

}

function cargarTopClientes(clientes){

const top =

[...clientes]

.sort(
(a,b)=>

(b.total_compras || 0)

-

(a.total_compras || 0)

)

.slice(0,10);

let html = "";

top.forEach(
(cliente,index)=>{

html += `

<div class="card">

#${index+1}

${cliente.nombre}

<br>

💰 $${Number(
cliente.total_compras || 0
).toLocaleString("es-CO")}

</div>

`;

});

document.getElementById(
"topClientes"
).innerHTML =
html;

}

function cargarTopProductos(pedidos){

const productos = {};

pedidos.forEach(
pedido=>{

if(!pedido.productos)
return;

pedido.productos.forEach(
producto=>{

productos[
producto.nombre
] =

(productos[
producto.nombre
] || 0)

+

Number(
producto.cantidad || 0
);

});

});

const top =

Object.entries(
productos
)

.sort(
(a,b)=>

b[1]-a[1]

)

.slice(0,10);

let html = "";

top.forEach(
(item,index)=>{

html += `

<div class="card">

#${index+1}

${item[0]}

<br>

📦 ${item[1]} unidades

</div>

`;

});

document.getElementById(
"topProductos"
).innerHTML =
html;

}

function cargarTopCiudades(pedidos){

const ciudades = {};

pedidos.forEach(
pedido=>{

const ciudad =
pedido.ciudad;

if(!ciudad)
return;

ciudades[ciudad] =

(ciudades[ciudad] || 0)

+

Number(
pedido.total || 0
);

});

const top =

Object.entries(
ciudades
)

.sort(
(a,b)=>

b[1]-a[1]

)

.slice(0,10);

let html = "";

top.forEach(
(item,index)=>{

html += `

<div class="card">

#${index+1}

${item[0]}

<br>

💰 $${item[1].toLocaleString("es-CO")}

</div>

`;

});

document.getElementById(
"topCiudades"
).innerHTML =
html;

}

cargarRankings();
