//? CAPTURAMOS LOS DATOS DEL FORMULARIO login MEDIANTE EL ID


const form = document.getElementById('loginForm')

form.addEventListener('submit', e =>{
    e.preventDefault()
    // transformamos toda la data del formulario con FormData
    const data = new FormData(form)

    const obj = {}
    data.forEach((value, key)=> obj[key] = value)
    // En las 2 lineas anteriores estoy iterando la data que viene del formulario y me generan este mismo obj json:
    // {
    //     "email": "berni@mail.com",
    //     "password": "123qwe" 
    // }

    // generamos el obj. Ahora hay queenviarlo mediante fetch
// el fetch me permite hacer request a las APIS
    fetch('/api/sessions/login', {
        method: 'POST', //especificamos metodo
        body:  JSON.stringify(obj),// pasamos el contenido en json stringify
        headers: {'Content-Type': 'application/json'}
    }).then(result => { //aca capturmos la respuesta del send de la api
        if(result.status === 200){
            window.location.replace('/products')// si es exitoso, redireccionamos a la pagina products
            //* en nuestro proyecto, laredireccion aca sera para la vista de productos
        } 
    })
})