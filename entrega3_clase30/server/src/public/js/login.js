//? CAPTURAMOS LOS DATOS DEL FORMULARIO login MEDIANTE EL ID


const form = document.getElementById('loginForm')

form.addEventListener('submit', e =>{
    e.preventDefault()
    // transformamos toda la data del formulario con FormData
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key)=> obj[key] = value)
   
    // generamos el obj. Ahora hay queenviarlo mediante fetch para hacer request a las APIS
    fetch('/api/extend/users/login', {
        method: 'POST', //especificamos metodo
        body:  JSON.stringify(obj),// pasamos el contenido en json stringify
        headers: {'Content-Type': 'application/json'}
    }).then(result => { //aca capturmos la respuesta del send de la api
        if(result.status === 200){
            result.json()
            .then(json => {
                console.log("Cookies generadas:");
                console.log(document.cookie);
                window.location.replace('/user/current')// si es exitoso, redireccionamos a current
                //window.location.replace('/products')// si es exitoso, redireccionamos a products
            })
        } else if (result.status === 401) {
            console.log(result);
            alert("Login invalido revisa tus credenciales!");
        }
    })
})