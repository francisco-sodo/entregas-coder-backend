export const generateUserErrorInfoESP = (user) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        -> first_name: type String, recibido: ${user.first_name}
        -> mail: type String, recibido: ${user.email}
        -> password: type String, recibido: ${user.password}
`;
}



export const generateUserErrorInfoENG = (user) => {
    return `One or more properties were sent incomplete or are not valid.
    List of required properties:
        -> first_name: type String, recibido: ${user.first_name}
        -> mail: type String, received: ${user.email}
        -> password: type String, received: ${user.password}
`;
}