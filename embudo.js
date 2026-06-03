async function cargarEmbudo(){

const contenedor =
document.getElementById(
"embudo"
);

const { data, error } =

await supabaseClient
.from("clientes")
.select("*");

if(error){

console.error(error);

return;

}

const clientes =
data || [];

const nuevos =

clientes.filter(
c=>

Number(
c.cantidad_pedidos || 0
) === 1
).length;

const frecuentes =

clientes.filter(
c=>{

const pedidos =

Number(
c.cantidad_pedidos || 0
);

return pedidos >=2 &&
pedidos <5;

}).length;

const vip =

clientes.filter(
c=>

Number(
c.cantidad_pedidos || 0
)>=5
).length;

const distribuidores =

clientes.filter(
c=>{

const pedidos =

Number(
c.cantidad_pedidos || 0
);

const total =

Number(
c.total_compras || 0
);

return pedidos >=3 ||
total >=300000;

}).length;

contenedor.innerHTML = `

<div class="card">

<h2>

🟢 Nuevos

</h2>

<p>

${nuevos}

</p>

</div>

<div class="card">

<h2>

🟡 Frecuentes

</h2>

<p>

${frecuentes}

</p>

</div>

<div class="card">

<h2>

🔵 VIP

</h2>

<p>

${vip}

</p>

</div>

<div class="card">

<h2>

💎 Potenciales Distribuidores

</h2>

<p>

${distribuidores}

</p>

</div>

`;

}

cargarEmbudo();
