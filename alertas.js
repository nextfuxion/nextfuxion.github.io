async function cargarAlertas(){

const contenedor =
document.getElementById(
"alertas"
);

const { data: clientes } =

await supabaseClient
.from("clientes")
.select("*");

let html = "";

const hoy =
new Date();

clientes.forEach(
cliente=>{

if(
!cliente.ultima_compra
)return;

const ultima =
new Date(
cliente.ultima_compra
);

const dias =

Math.floor(

(hoy - ultima)

/

(1000*60*60*24)

);

if(dias > 30){

html += `

<div class="card">

<h3>

⏰ Cliente Inactivo

</h3>

<p>

${cliente.nombre}

</p>

<p>

${dias} días sin comprar

</p>

<a
target="_blank"
href="https://wa.me/57${cliente.telefono}">

Contactar

</a>

</div>

`;

}

if(
Number(
cliente.cantidad_pedidos || 0
)>=5
){

html += `

<div class="card">

<h3>

🔥 Cliente VIP

</h3>

<p>

${cliente.nombre}

</p>

</div>

`;

}

if(

Number(
cliente.cantidad_pedidos || 0
)>=3

||

Number(
cliente.total_compras || 0
)>=300000

){

html += `

<div class="card">

<h3>

💎 Posible Distribuidor

</h3>

<p>

${cliente.nombre}

</p>

</div>

`;

}

});

if(html===""){

html = `

<div class="card">

<h3>

🎉 No hay alertas pendientes

</h3>

</div>

`;

}

contenedor.innerHTML =
html;

}

cargarAlertas();
