const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    const obj = {};
    data.forEach((value, key) => obj[key] = value);

   
    fetch('/api/extend/users/reset-password', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' }
    }).then(result => {
        if(result.status === 200) {
            alert("Contraseña restablecida con éxito. Inicie sesión con su nueva contraseña.");
            window.location.replace('/user/login'); 
        } else {
            alert("No se pudo restablecer la contraseña.");
        }
    }).then(json => console.log(json));
});