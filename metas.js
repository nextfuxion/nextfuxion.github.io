async function cargarMetas(){

const panel =
document.getElementById(
"panelMetas"
);

const hoy =
new Date();

const mesActual =

hoy.getFullYear()

+

"-"

+

String(
hoy.getMonth()+1
).padStart(2,"0");

const { data: metas } =

await supabaseClient
.from("metas")
.select("*")
.eq("mes", mesActual);

const { data: pedidos } =

await supabaseClient
.from("pedidos")
.select("*");

const metaMensual =

Number(
metas?.[0]?.meta || 0
);

let ventasMes = 0;

(pedidos || []).forEach(
pedido=>{

if(
pedido.fecha &&
pedido.fecha.includes(
mesActual
)
){

ventasMes +=
Number(
pedido.total || 0
);

}

});

const porcentaje =

metaMensual

?

(
ventasMes /
metaMensual
)

*100

:

0;

const faltante =

Math.max(
0,
metaMensual - ventasMes
);

panel.innerHTML = `

<div class="card">

<h2>

🎯 Meta

</h2>

<p>

$${metaMensual.toLocaleString("es-CO")}

</p>

</div>

<div class="card">

<h2>

💰 Ventas

</h2>

<p>

$${ventasMes.toLocaleString("es-CO")}

</p>

</div>

<div class="card">

<h2>

📈 Avance

</h2>

<p>

${porcentaje.toFixed(1)}%

</p>

</div>

<div class="card">

<h2>

🚀 Faltante

</h2>

<p>

$${faltante.toLocaleString("es-CO")}

</p>

</div>

`;

}

cargarMetas();
