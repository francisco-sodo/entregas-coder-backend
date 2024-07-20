//QUITAR UN PRODUCTO DEL CARRITO
function deleteProduct(pid) {
    const productElement = document.querySelector(`.product[data-pid="${pid}"]`);
    const cid = productElement.getAttribute('data-cid');
    const productContainer = productElement.closest('.product-container');
  
try {
    fetch(`/api/carts/${cid}/product/${pid}`, {
  
        method: 'DELETE',
        credentials: 'include', // Incluye las cookies de autenticación
        headers: {'Content-Type': 'application/json'}

    })
    .then(response => {
        if (response.ok) {
            productContainer.remove();
        } else {
            console.error('Error al eliminar un producto del carrito');
        }
    })
    
} catch (error) {
    console.error('Error al realizar la solicitud:', error);
    
}}

// LIMPIAR CARRITO
function clearCart() {

    const cartId = document.querySelector('.cart-header').getAttribute('data-cid');
    const container = document.querySelector('#products-list-container');

    try {
            fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                if (response.ok) {
                    container.remove();
                    location.reload()
                } else {
                    console.error('Error al vaciar el carrito');
                }
            })
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}


// COMPRAR PRODUCTO DENTRO DEL CARRITO
function purchase(cid, pid) {
    try {
        fetch(`/api/carts/${cid}/product/${pid}/purchase`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.text())
        .then(text => {
            return JSON.parse(text);
        })
        .then(data => {
            if (data.error) {
                console.error('Error al comprar el producto:', data.error);
            } else {
                //todo-  redirigir a vista compra exitosa y sacar el alert.
                alert('Compra realizada con éxito. \nRevisa tu correo para ver los detalles en el Ticket.');
                location.reload()
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}




