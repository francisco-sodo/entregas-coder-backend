export const generateProductErrorInfoESP = (product) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        -> title: type String, recibido: ${product.productTitle}
        -> price: type Number, recibido: ${product.productPrice}
`;
}



export const generateProductErrorInfoENG = (product) => {
    return `One or more properties were sent incomplete or are not valid.
    List of required properties:
        -> ftitle: type String, received: ${product.productTitle}
        -> price: type Number, received: ${product.productPrice}
`;
}