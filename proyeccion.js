async function cargarProyeccion(){

const panel =
document.getElementById(
"proyeccion"
);

const { data: pedidos } =

await supabaseClient
.from("pedidos")
.select("*");

const hoy =
new Date();

const anio =
hoy.getFullYear();

const mes =
hoy.getMonth();

const diaActual =
hoy.getDate();

const diasMes =

new Date(
anio,
mes + 1,
0
).getDate();

let ventasMes = 0;

(pedidos || []).forEach(
pedido=>{

const fecha =
new Date(
pedido.fecha
);

if(

fecha.getFullYear() === anio

&&

fecha.getMonth() === mes

){

ventasMes +=

Number(
pedido.total || 0
);

}

});

const promedioDiario =

diaActual

?

ventasMes / diaActual

:

0;

const proyeccion =

promedioDiario *
diasMes;

panel.innerHTML = `

<div class="card">

<h2>

💰 Ventas actuales

</h2>

<p>

$${ventasMes.toLocaleString("es-CO")}

</p>

</div>

<div class="card">

<h2>

📅 Promedio diario

</h2>

<p>

$${Math.round(
promedioDiario
).toLocaleString("es-CO")}

</p>

</div>

<div class="card">

<h2>

🚀 Proyección fin de mes

</h2>

<p>

$${Math.round(
proyeccion
).toLocaleString("es-CO")}

</p>

</div>

</div>

`;

}

cargarProyeccion();
