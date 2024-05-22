
const form = document.getElementById('registerForm')

form.addEventListener('submit', e =>{
    e.preventDefault()
    // transformamos toda la data del formulario con FormData
    const data = new FormData(form)

    const obj = {}
    data.forEach((value, key)=> obj[key] = value)
   
// generamos el obj. Ahora hay queenviarlo mediante fetch para hacer request a las APIS
    fetch('/api/extend/users/register', {
        method: 'POST', //especificamos metodo
        body:  JSON.stringify(obj),// pasamos el contenido en json stringify
        headers: {'Content-Type': 'application/json'}
    }).then(result => { //aca capturmos la respuesta del send de la api
        if(result.status === 200){
            result.json()
            alert("Usuario creado con exito! Ingrese credenciales para entrar");
            window.location.replace('/user/login')// si es exitoso, redireccionamos a la pagina del login para que se loguee.
        } else {
            alert("No se pudo crear el usuario!");
        }
    }).then(
        json => console.log(json));
    })

