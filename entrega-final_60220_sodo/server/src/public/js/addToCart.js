function addToCart(pid) {
    const cardElement = document.querySelector('.card');
    const cid = cardElement.getAttribute('data-cid');
 
    console.log("Cart ID:", cid);
    console.log("Product ID:", pid);   
    
    
try {
    fetch(`/api/carts/${cid}/product/${pid}`, {
  
        method: 'PUT',
        credentials: 'include', // Incluye las cookies de autenticación
        headers: {'Content-Type': 'application/json'}

    })
    .then(response => {
        if (response.ok) {
            // Producto agregado correctamente, redirigir al carrito o mostrar una confirmación
            console.log("COMPRA EXITOSAAAA")
            window.location.href = `/carts/${cid}`; 
        } else {
            console.error('Error al agregar el producto al carrito');
        }
    })
    
} catch (error) {
    console.error('Error al realizar la solicitud:', error);
    
}}




