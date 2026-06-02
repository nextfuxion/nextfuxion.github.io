let carrito =
JSON.parse(
localStorage.getItem("carrito")
) || [];

function precioNumero(precio){

return Number(

String(precio)

.replace("$","")

.replace(/\./g,"")

.replace(",", ".")

.replace(/[^\d.]/g,"")

) || 0;

}

function cargarCarrito(){

const contenedor =
document.getElementById(
"carritoProductos"
);

let html = "";

let total = 0;

carrito.forEach(
(producto,index)=>{

const subtotal =

precioNumero(
producto.precio
)

*

producto.cantidad;

total += subtotal;

html += `

<div class="card">

<img
src="${producto.imagen}"
style="width:120px;">

<h3>

${producto.nombre}

</h3>

<p>

${producto.precio}

</p>

<p>

Cantidad:
${producto.cantidad}

</p>

<p>

Subtotal:

$${subtotal.toLocaleString("es-CO")}

</p>

<button
onclick="sumar(${index})">

➕

</button>

<button
onclick="restar(${index})">

➖

</button>

<button
onclick="eliminar(${index})">

🗑️

</button>

</div>

`;

});

contenedor.innerHTML = html;

document.getElementById(
"totalCarrito"
).innerHTML =

"Total: $" +

total.toLocaleString(
"es-CO"
);

}

function guardar(){

localStorage.setItem(
"carrito",
JSON.stringify(carrito)
);

cargarCarrito();

}

function sumar(i){

carrito[i].cantidad++;

guardar();

}

function restar(i){

if(
carrito[i].cantidad > 1
){

carrito[i].cantidad--;

}else{

carrito.splice(i,1);

}

guardar();

}

function eliminar(i){

carrito.splice(i,1);

guardar();

}

function calcularTotal(){

let total = 0;

carrito.forEach(
p=>{

const precio =
precioNumero(
p.precio
);

total +=
precio *
p.cantidad;

}
);

return total;

}
async function enviarPedido(){

const nombre =
document.getElementById(
"nombre"
).value;

const telefono =
document.getElementById(
"telefono"
).value;

const correo =
document.getElementById(
"correo"
).value;

const ciudad =
document.getElementById(
"ciudad"
).value;

const direccion =
document.getElementById(
"direccion"
).value;

const observaciones =
document.getElementById(
"observaciones"
).value;

if(
!nombre ||
!telefono
){

alert(
"Debes ingresar nombre y teléfono."
);

return;

}

const numeroPedido =
"NFX-" + Date.now();

const pedido = {

numero:
numeroPedido,

fecha:
new Date()
.toLocaleString(),

estado:
"Pendiente",

total:
calcularTotal(),

cliente:{

nombre,
telefono,
correo,
ciudad,
direccion,
observaciones

},

productos:
carrito

};

let pedidos =

JSON.parse(
localStorage.getItem(
"pedidos"
)
) || [];

pedidos.push(
pedido
);

localStorage.setItem(

"pedidos",

JSON.stringify(
pedidos
)

);

try{

const { error } =

await supabaseClient
.from("pedidos")
.insert([{

numero:
numeroPedido,

fecha:
pedido.fecha,

estado:
"Pendiente",

total:
pedido.total,

cliente_nombre:
nombre,

cliente_telefono:
telefono,

cliente_correo:
correo,

ciudad:
ciudad,

direccion:
direccion,

observaciones:
observaciones,

productos:
carrito

}]);

if(error){

console.error(
"Supabase:",
error
);

alert(
"Pedido guardado localmente pero hubo un problema al guardar en la nube."
);

}

/* ==========================
   ACTUALIZAR CRM CLIENTES
========================== */

const { data: clienteExistente } =

await supabaseClient
.from("clientes")
.select("*")
.eq(
"telefono",
telefono
)
.limit(1);

if(
!clienteExistente ||
clienteExistente.length===0
){

await supabaseClient
.from("clientes")
.insert([{

nombre,
telefono,
correo,

ciudad,
direccion,

cantidad_pedidos:1,

total_compras:
calcularTotal(),

ultima_compra:
new Date()
.toISOString()

}]);

}
else{

const cliente =
clienteExistente[0];

await supabaseClient
.from("clientes")
.update({

cantidad_pedidos:

(cliente.cantidad_pedidos || 0)

+ 1,

total_compras:

Number(
cliente.total_compras || 0
)

+

calcularTotal(),

ultima_compra:
new Date()
.toISOString(),

correo,
ciudad,
direccion

})
.eq(
"id",
cliente.id
);

}

}catch(ex){

console.error(
ex
);

}

let mensaje =

`*Pedido ${numeroPedido}*%0A%0A`;

mensaje +=
`Cliente: ${nombre}%0A`;

mensaje +=
`Teléfono: ${telefono}%0A`;

mensaje +=
`Correo: ${correo}%0A`;

mensaje +=
`Ciudad: ${ciudad}%0A`;

mensaje +=
`Dirección: ${direccion}%0A`;

mensaje +=
`Observaciones: ${observaciones}%0A%0A`;

mensaje +=
`*Productos:*%0A`;

carrito.forEach(
p=>{

mensaje +=
`${p.cantidad} x ${p.nombre}%0A`;

}
);

mensaje +=
`%0A*Total:* $${calcularTotal().toLocaleString("es-CO")}`;

localStorage.removeItem(
"carrito"
);

window.open(

`https://wa.me/573002117268?text=${mensaje}`,

"_blank"

);

setTimeout(()=>{

location.reload();

},500);

}

function vaciarCarrito(){

if(

confirm(
"¿Deseas vaciar el carrito?"
)

){

localStorage.removeItem(
"carrito"
);

location.reload();

}

}

function guardarDatosCliente(){

const datos = {

nombre:
document.getElementById("nombre").value,

telefono:
document.getElementById("telefono").value,

correo:
document.getElementById("correo").value,

ciudad:
document.getElementById("ciudad").value,

direccion:
document.getElementById("direccion").value,

observaciones:
document.getElementById("observaciones").value

};

localStorage.setItem(

"cliente",

JSON.stringify(datos)

);

}

function cargarDatosCliente(){

const datos =

JSON.parse(

localStorage.getItem(
"cliente"
)

);

if(!datos) return;

document.getElementById("nombre").value =
datos.nombre || "";

document.getElementById("telefono").value =
datos.telefono || "";

document.getElementById("correo").value =
datos.correo || "";

document.getElementById("ciudad").value =
datos.ciudad || "";

document.getElementById("direccion").value =
datos.direccion || "";

document.getElementById("observaciones").value =
datos.observaciones || "";

}

setTimeout(()=>{

[
"nombre",
"telefono",
"correo",
"ciudad",
"direccion",
"observaciones"
]

.forEach(id=>{

const campo =
document.getElementById(id);

if(campo){

campo.addEventListener(
"input",
guardarDatosCliente
);

}

});

cargarDatosCliente();

},100);

cargarCarrito();
