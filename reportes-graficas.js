async function cargarGraficas(){

const { data: pedidos } =

await supabaseClient
.from("pedidos")
.select("*");

const ventasMes = {};
const pedidosMes = {};

(pedidos || []).forEach(
pedido=>{

let fecha;

try{

fecha = new Date(
pedido.fecha
);

}catch{

return;

}

const mes =

fecha.getFullYear()

+

"-"

+

String(
fecha.getMonth()+1
).padStart(2,"0");

ventasMes[mes] =

(ventasMes[mes] || 0)

+

Number(
pedido.total || 0
);

pedidosMes[mes] =

(pedidosMes[mes] || 0)

+

1;

});

const meses =

Object.keys(
ventasMes
).sort();

new Chart(

document.getElementById(
"ventasChart"
),

{

type:"line",

data:{

labels:meses,

datasets:[{

label:
"Ventas",

data:
meses.map(
m=>ventasMes[m]
)

}]

}

}

);

new Chart(

document.getElementById(
"pedidosChart"
),

{

type:"bar",

data:{

labels:meses,

datasets:[{

label:
"Pedidos",

data:
meses.map(
m=>pedidosMes[m]
)

}]

}

}

);

}

cargarGraficas();
