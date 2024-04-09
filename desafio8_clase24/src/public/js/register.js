//? CAPTURAMOS LOS DATOS DEL FORMULARIO register MEDIANTE EL ID


const form = document.getElementById('registerForm')

form.addEventListener('submit', e =>{
    e.preventDefault()
    // transformamos toda la data del formulario con FormData
    const data = new FormData(form)

    const obj = {}
    data.forEach((value, key)=> obj[key] = value)
   
    // generamos el obj. Ahora hay queenviarlo mediante fetch
// el fetch me permite hacer request a las APIS
    // fetch('/api/jwt/register', {
    fetch('/api/extend/users/register', {
        method: 'POST', //especificamos metodo
        body:  JSON.stringify(obj),// pasamos el contenido en json stringify
        headers: {'Content-Type': 'application/json'}
    }).then(result => { //aca capturmos la respuesta del send de la api
        if(result.status === 201){
            result.json()
            alert("Usuario creado con exito! Ingrese credenciales para entrar");
            window.location.replace('/user/login')// si es exitoso, redireccionamos a la pagina del login para que se loguee.
        } else {
            alert("No se pudo crear el usuario!");
        }
    }).then(
        json => console.log(json));
    })


/*
FormData es un objeto en JavaScript que se utiliza para construir fácilmente conjuntos de datos clave-valor que representan los campos y valores de un formulario HTML. Esto es útil cuando deseas enviar datos de formulario a través de una solicitud HTTP, como una petición AJAX o una solicitud de formulario.

Cuando creas una instancia de FormData y le pasas un formulario como argumento, la instancia de FormData automáticamente recopila todos los campos y sus valores del formulario y los organiza en un objeto que puedes manipular y enviar fácilmente.
*/
