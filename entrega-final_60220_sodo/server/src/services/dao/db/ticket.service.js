import ticketModel from './models/ticket.model.js';



export default class TicketService {
    constructor(){
    }


    generateTicket = async (purchaseDetails) => {

        try {
            const code = generateUniqueCode();
            
            //Crear un nuevo ticket con los detalles de la compra
            const newTicket = new ticketModel({
                code: code,
                purchase_datetime: new Date(),
                amount: purchaseDetails.amount,
                purchaser: purchaseDetails.purchaser,
                products: purchaseDetails.products,
            });

            // Guardar el ticket en la base de datos
            const savedTicket = await newTicket.save();
    
            return savedTicket;
        } catch (error) {
            throw Error('Error al generar el ticket:', error);
        }
    }
}



// código único para el ticket
const generateUniqueCode = () => {
    const randomNumber = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    return randomNumber.toString(); 
};