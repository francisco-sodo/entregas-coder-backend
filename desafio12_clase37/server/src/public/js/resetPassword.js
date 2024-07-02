const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    // transformamos toda la data del formulario con FormData
    const data = new FormData(form);

    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    // generamos el obj. Ahora hay que enviarlo mediante fetch para hacer request a las APIS
    fetch('/api/extend/users/reset-password', {
        method: 'POST', // especificamos método
        body: JSON.stringify(obj), // pasamos el contenido en json stringify
        headers: { 'Content-Type': 'application/json' }
    }).then(result => { // aquí capturamos la respuesta del send de la API
        if(result.status === 200) {
            //if(result) {
            alert("Contraseña restablecida con éxito. Inicie sesión con su nueva contraseña.");
            window.location.replace('/user/login'); // si es exitoso, redireccionamos a la página del login para que se loguee.
        } else {
            alert("No se pudo restablecer la contraseña.");
        }
    }).then(
        json => console.log(json)
    );
});