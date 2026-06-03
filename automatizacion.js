async function generarTareasAutomaticas(){

const { data: clientes } =

await supabaseClient
.from("clientes")
.select("*");

const { data: tareas } =

await supabaseClient
.from("tareas")
.select("*");

const hoy =
new Date();

for(const cliente of clientes){

/*
CLIENTES INACTIVOS
*/

if(cliente.ultima_compra){

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

const existe =

tareas.find(
t=>

t.tipo ===
"INACTIVO"

&&

t.cliente_nombre ===
cliente.nombre

);

if(!existe){

await supabaseClient
.from("tareas")
.insert([{

titulo:
"Llamar cliente inactivo",

descripcion:
`${dias} días sin comprar`,

cliente_nombre:
cliente.nombre,

cliente_telefono:
cliente.telefono,

tipo:
"INACTIVO"

}]);

}

}

}

/*
CLIENTES VIP
*/

if(

Number(
cliente.cantidad_pedidos || 0
)>=5

){

const existe =

tareas.find(
t=>

t.tipo ===
"VIP"

&&

t.cliente_nombre ===
cliente.nombre

);

if(!existe){

await supabaseClient
.from("tareas")
.insert([{

titulo:
"Invitar programa VIP",

descripcion:
"Cliente frecuente",

cliente_nombre:
cliente.nombre,

cliente_telefono:
cliente.telefono,

tipo:
"VIP"

}]);

}

}

}

}
