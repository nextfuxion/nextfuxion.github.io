async function cargarCampanas(){

const contenedor =
document.getElementById(
"campanas"
);

const { data } =

await supabaseClient
.from("clientes")
.select("*");

const clientes =
data || [];

const vip =

clientes.filter(
c=>

Number(
c.cantidad_pedidos || 0
)>=5
);

const frecuentes =

clientes.filter(
c=>{

const pedidos =

Number(
c.cantidad_pedidos || 0
);

return pedidos >=2 &&
pedidos <5;

});

const nuevos =

clientes.filter(
c=>

Number(
c.cantidad_pedidos || 0
)===1
);

contenedor.innerHTML = `

<div class="card">

<h2>

🔵 Campaña VIP

</h2>

<p>

${vip.length} clientes

</p>

<button
onclick="exportarGrupo('vip')">

Exportar

</button>

</div>

<div class="card">

<h2>

🟡 Campaña Frecuentes

</h2>

<p>

${frecuentes.length} clientes

</p>

<button
onclick="exportarGrupo('frecuentes')">

Exportar

</button>

</div>

<div class="card">

<h2>

🟢 Campaña Nuevos

</h2>

<p>

${nuevos.length} clientes

</p>

<button
onclick="exportarGrupo('nuevos')">

Exportar

</button>

</div>

`;

window.clientesCRM =
clientes;

}

function exportarGrupo(tipo){

let clientes =

window.clientesCRM || [];

if(tipo==="vip"){

clientes = clientes.filter(
c=>

Number(
c.cantidad_pedidos || 0
)>=5
);

}

if(tipo==="frecuentes"){

clientes = clientes.filter(
c=>{

const pedidos =

Number(
c.cantidad_pedidos || 0
);

return pedidos>=2 &&
pedidos<5;

});

}

if(tipo==="nuevos"){

clientes = clientes.filter(
c=>

Number(
c.cantidad_pedidos || 0
)===1
);

}

let csv =

"Nombre;Telefono;Correo\n";

clientes.forEach(
c=>{

csv +=

`${c.nombre};`

+

`${c.telefono};`

+

`${c.correo || ""}\n`;

});

const blob =
new Blob(
[csv],
{
type:
"text/csv"
}
);

const link =
document.createElement(
"a"
);

link.href =
URL.createObjectURL(
blob
);

link.download =
`${tipo}.csv`;

link.click();

}

cargarCampanas();
