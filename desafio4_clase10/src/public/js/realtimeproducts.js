//configuracion del socket de lado del cliente
const socket = io();

const cardsContainer = document.getElementById('cards-container')

//mensajes del front para el back
socket.emit("logMessage", "Conectado con el Cliente por socketServer");
socket.on("status", (data) => {
  console.log(data);
});


// funcion para dibujar producto(card)
const printCard = (prod) => {

  cardsContainer.innerHTML += `
    <div class="card" id="card">
    <div class="img-card-container">
    <img src=${prod.thumbnail} alt=${prod.title}></p>
    </div>
    <ul>
    <li><h2>${prod.title}</h2></li>
    <li><h4><b>Precio: </b>$${prod.price}</h4></li>
    <li><b>Descripción:</b> ${prod.description}</li>
    <li><b>Código:</b> ${prod.code}</li>
    <li><b>Status:</b> ${prod.status}</li>
    <li><b>Stock:</b> ${prod.stock}</li>
    <li><b>Categoría:</b> ${prod.category}</li>
    <li><b>ID:</b> ${prod.id}</li>
    </ul>
    </div>
    `;
  
}


//! PRODUCT GET DESDE EL FRONT
const formGet = document.getElementById("formGet");
const msgGet = document.getElementById("msgGet");

//cliente peticiona servidor
formGet.addEventListener("submit", (e) => {
  e.preventDefault();
  let getProductInput = document.getElementById('getProductId-input').value
  socket.emit("getProduct", getProductInput);
  msgGet.innerHTML = "";
});

//servidor responde cliente
socket.on("getProduct", (data) => {
  msgGet.innerHTML = data.message;
  cardsContainer.innerHTML = "";
  data.products.forEach((prod) => {
    printCard(prod);
  });
  document.getElementById('getProductId-input').value = ""
});


//! PRODUCT POST DESDE EL FRONT
const formPost = document.getElementById("formPost");
const msgPost = document.getElementById("msgPost");

//del cliente al servidor
formPost.addEventListener("submit", (e) => {
  e.preventDefault();
  let postProduct = document.getElementById('postProduct-input').value.trim();

  // no enviar formulario vacio
  if (postProduct.length == 0) return msgPost.innerHTML = "Debe agregar un producto";
  // no enviar letras o numeros
  if (/^\d+$/.test(postProduct) || /^[a-zA-Z]+$/.test(postProduct)) {
   return msgPost.innerHTML = "Debe introducir un producto en formato JSON";
  }
  // asegurarme que solo envie formato json
  try {
    JSON.parse(postProduct);
    socket.emit("addProduct", postProduct);
    msgPost.innerHTML = "";
  }
  catch (error) {
    msgPost.innerHTML = "Debe introducir un producto en formato JSON";
  }
})
  // del servidor al cliente
  socket.on("addProduct", (data) => {
  msgPost.innerHTML = data.message;
  cardsContainer.innerHTML = "";

  data.products.forEach((prod) => {
    printCard(prod);
    
  });
  document.getElementById('postProduct-input').value = ""

});




//! PRODUCT DELETE DESDE EL FRONT
const formDel = document.getElementById("formDel");
const msgDel = document.getElementById("msgDel");

//del cliente al servidor
formDel.addEventListener("submit", (e) => {
  e.preventDefault();
  let delProductById = document.getElementById('delProduct-input').value.trim()

  // no enviar formulario vacio
  if (delProductById.length == 0) return msgDel.innerHTML = "Debe agregar un id";

  socket.emit("deleteProduct", delProductById);
  msgDel.innerHTML = "";
});

//del servidor al cliente
socket.on("deleteProduct", (data) => {
  msgDel.innerHTML = data.message;
  cardsContainer.innerHTML = "";
  data.products.forEach((prod) => {
    printCard(prod);
  });
  document.getElementById('delProduct-input').value = ""

});
