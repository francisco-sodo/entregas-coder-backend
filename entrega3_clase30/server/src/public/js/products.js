function addToCart(pid) {
    fetch(`/api/carts/addtocart/${pid}`, {
        method: 'POST',
        credentials: 'include' // Incluye las cookies de autenticación
    })
    .then(response => {
        if (response.ok) {
            // Producto agregado correctamente, redirige al carrito o muestra una confirmación
            window.location.href = '/carts/:cid'; // Redirige al carrito del usuario
        } else {
            // Manejar errores de respuesta
            console.error('Error al agregar el producto al carrito');
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
}