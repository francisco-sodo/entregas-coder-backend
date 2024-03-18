//? LADO DEL CLIENTE
// LADO DEL SERVIDOR EN /dao/db/MessageManager.js



const socket = io()
let user;
const chatBox = document.getElementById('chatBox') //capturamos lo que escriba el usuario
const msgsContainer = document.getElementById('mensajes')

// Función para hacer scroll hacia abajo automáticamente
function scrollToBottom() {
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
}


/*=============================================
=              Aplicando SweetAlert           =
=============================================*/

Swal.fire({
    title: "Ingresa un nickname!",
    input: 'text',
    color: "#716add",
    customClass: "swalId",
    inputValidator: (value) => {
        if (!value) {
            return "Necesitas escribir tu nickname para continuar!!"
        } else {
            socket.emit('userConnected', { user: value })
            scrollToBottom()
        }
    },
    allowOutsideClick: false,
    showConfirmButton: false,
}).then(result => {
    //usamos la variable global user que declaramos arriba
    user = result.value

    // Cargamos Nombre en el Navegador
    const myName = document.getElementById('myName')
    myName.innerHTML = user
})






//? Guardar mensajes por usuario y mostrarlo en nuesto log de mensajes.
//  Francisco : "Hola como estas?"
chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter') {
        // Se envia el mensaje al server
        if(chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value })
            chatBox.value = '';

        }else {
            Toastify({
                text: "Debes ingresar un mensaje",
                className: "info",
                duration: 2000,
                gravity: "bottom", 
                position: "right",
                style: {
                  background: "linear-gradient(to right, rgba(119,0,0,1) 0%, rgba(75,5,9,1) 100%)",
                }
              }).showToast();
        }
    }
})




// Escuchamos a todos los usuarios que estan conectados
// recivimos un array de objetos ---> [{ user: "Juan", message: "Hola" }, { user: "Elias", message: "Como estas?" }]
socket.on('messageLogs', data => {
    const messageLogs = document.getElementById('messageLogs')
    let logs = '';
    data.forEach(log => {
        logs += `<b>${log.user}</b> dice: ${log.message}<br/>`
        scrollToBottom()
    });
    messageLogs.innerHTML = logs

})




// 2da - parte
// Aqui escuchamos los nuevos usuarios que se conectan al chat\
socket.on('userConnected', data => {
    let message = `Se ha conectado ${data}`

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, rgba(31,189,228,1) 0%, rgba(7,157,73,1) 100%",
        }
      }).showToast();
})


/*=============================================
=                   Extras                   =
=============================================*/


// close chatBox
const closeChatBox = document.getElementById('closeChatBox');
closeChatBox.addEventListener('click', evt => {
    const messageLogs = document.getElementById('messageLogs')
   // notificacion has salido del chat. Solo la ve quien ha salido
    Toastify({
        text: "Has salido del chat",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, rgba(228,67,31,1) 0%, rgba(255,175,0,1) 100%)",
        }
      }).showToast();
    
    socket.emit('closeChat', { close: "close", user: user })
    messageLogs.innerHTML = ''

    //sweet alert preguntando si desea volver a entrar. 
    Swal.fire({
        title: 'Has salido del chat',
        text: 'Desea volver a entrar?',
        allowOutsideClick: false,
        showConfirmButton: true,
        showDenyButton: true,
    }).then((result) => {
        if(result.isConfirmed){
            //refresh forzado
            location.reload()
        } else{
            Swal.fire({
                title: 'NOS VIMO'
                //todo/-- salir del chat y dirigir a otra pantalla... 
            })
        }
    }) 



})

//escuchamos quien ha abandonado el chat y pintamos alerta
socket.on('closeMsg', data =>{
    
    let message = `${data} ha salido del chat`

    // notificacion alguien ha salido del chat. Lo ven todos menos quien ha salido
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, rgba(228,31,187,1) 0%, rgba(255,145,0,1) 100%)",
        }
      }).showToast();
})








//* keys emitidas al back: 'userConnected', 'message', 'closeChat'
//* keys escuchadas del back: 'messageLogs', 'userConnected'