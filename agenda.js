async function cargarTareas(){

const contenedor =
document.getElementById(
"listaTareas"
);

const { data, error } =

await supabaseClient
.from("tareas")
.select("*")
.order("fecha", {
ascending:false
});

if(error){

console.error(error);

return;

}

if(!data.length){

contenedor.innerHTML =

`

<div class="card">

No hay tareas registradas

</div>

`;

return;

}

let html = "";

data.forEach(
tarea=>{

html += `

<div class="card">

<h3>

${tarea.titulo}

</h3>

<p>

${tarea.descripcion || ""}

</p>

<p>

👤 ${tarea.cliente_nombre || "-"}

</p>

<p>

📱 ${tarea.cliente_telefono || "-"}

</p>

<p>

Estado:

<b>

${tarea.estado}

</b>

</p>

<button
onclick="completarTarea(${tarea.id})">

✅ Completar

</button>

<button
onclick="eliminarTarea(${tarea.id})">

🗑️ Eliminar

</button>

</div>

`;

});

contenedor.innerHTML =
html;

}

async function crearTarea(){

const titulo =
document.getElementById(
"titulo"
).value;

if(!titulo){

alert(
"Debes ingresar un título."
);

return;

}

const descripcion =
document.getElementById(
"descripcion"
).value;

const clienteNombre =
document.getElementById(
"clienteNombre"
).value;

const clienteTelefono =
document.getElementById(
"clienteTelefono"
).value;

const { error } =

await supabaseClient
.from("tareas")
.insert([{

titulo,

descripcion,

cliente_nombre:
clienteNombre,

cliente_telefono:
clienteTelefono

}]);

if(error){

console.error(error);

alert(
"Error creando tarea."
);

return;

}

document.getElementById(
"titulo"
).value = "";

document.getElementById(
"descripcion"
).value = "";

document.getElementById(
"clienteNombre"
).value = "";

document.getElementById(
"clienteTelefono"
).value = "";

cargarTareas();

}

async function completarTarea(id){

await supabaseClient
.from("tareas")
.update({

estado:
"Completada"

})
.eq("id", id);

cargarTareas();

}

async function eliminarTarea(id){

if(
!confirm(
"¿Eliminar tarea?"
)
){

return;

}

await supabaseClient
.from("tareas")
.delete()
.eq("id", id);

cargarTareas();

}

cargarTareas();

generarTareasAutomaticas()
.then(
()=>cargarTareas()
);
