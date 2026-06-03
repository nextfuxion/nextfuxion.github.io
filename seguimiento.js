async function cargarSeguimientos(){

const contenedor =
document.getElementById(
"seguimientos"
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

let html = "";

clientes.forEach(
cliente=>{

const pedidos =

Number(
cliente.cantidad_pedidos || 0
);

let tipo = "";
let mensaje = "";

if(pedidos === 1){

tipo =
"🟢 Primera Compra";

mensaje =

`Hola ${cliente.nombre}, gracias por tu primera compra en NextFuXion. ¿Cómo te has sentido con los productos?`;

}
else if(pedidos >= 2 && pedidos < 5){

tipo =
"🟡 Cliente Frecuente";

mensaje =

`Hola ${cliente.nombre}, gracias por seguir confiando en NextFuXion. Tenemos novedades que podrían interesarte.`;

}
else{

tipo =
"🔵 Cliente VIP";

mensaje =

`Hola ${cliente.nombre}, eres uno de nuestros mejores clientes. Queremos compartir contigo beneficios especiales.`;

}

html += `

<div class="card">

<h3>

${cliente.nombre}

</h3>

<p>

${tipo}

</p>

<p>

📱 ${cliente.telefono}

</p>

<a
target="_blank"
href="https://wa.me/57${cliente.telefono}?text=${encodeURIComponent(mensaje)}">

Enviar WhatsApp

</a>

</div>

`;

});

contenedor.innerHTML =
html;

}

cargarSeguimientos();
