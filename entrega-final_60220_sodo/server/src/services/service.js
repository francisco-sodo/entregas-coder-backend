// importamos los servicios desde el dao de mongo
import CartsServiceMongo from './dao/db/cart.service.js';
import ProductServiceMongo from './dao/db/product.service.js';
import UserService from './dao/db/user.service.js';
import TicketService from './dao/db/ticket.service.js';


// importamos los repositorys dentro de la carpeta repository
import CartsRepository from './repository/cart.repository.js';
import ProductsRepository from './repository/products.repository.js';
import UsersRepository from './repository/users.repository.js';
import TicketsRepository from './repository/ticket.repository.js';

// instanciamos las clases de de los servicios del DAO
const cartsDao = new CartsServiceMongo();
const productsDao = new ProductServiceMongo()
const usersDao = new UserService()
const ticketsDao = new TicketService()

// instanciamos y exportamos los repositorys. Seran consumidos por los controllers
export const cartService = new CartsRepository(cartsDao)
export const productService = new ProductsRepository(productsDao)
export const userService = new UsersRepository(usersDao)
export const ticketService = new TicketsRepository(ticketsDao)