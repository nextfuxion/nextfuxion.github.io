function login(){

const usuario =
document.getElementById(
"usuario"
).value;

const password =
document.getElementById(
"password"
).value;

/*
CAMBIA ESTOS DATOS
POR LOS TUYOS
*/

if(

usuario === "pedro"

&&

password === "NextFuxion2026"

){

localStorage.setItem(
"adminAuth",
"true"
);

localStorage.setItem(
"adminUser",
usuario
);

window.location.href =
"admin.html";

}
else{

alert(
"Usuario o contraseña incorrectos"
);

}

}
