import mongoose from 'mongoose';
import config from '../src/config/config.js'
import supertest from 'supertest';
import { expect } from 'chai';



const requester = supertest('http://localhost:8080')


// ? -----  ST - G L O B A L  ----- ? //
describe("Test Coder e-commerce App", () =>{

             before(function (done) {
               this.timeout(5000);
        
              (async () => {
                try {
                  
                    await mongoose.connect(config.mongoUrlTest);
                    await mongoose.connection.collection('products').deleteMany({});
                    await mongoose.connection.collection('carts').deleteMany({});
                    await mongoose.connection.collection('users').deleteMany({});
                  
                  done();
                } catch (error) {
                  done(error);
                }
              })();
            });

    


    /*=============================================
    =             Section 01 - PRODUCTS           =
    =============================================*/
    describe("Testing API Products", () =>{


    

        it("Crear Producto: El API POST /api/products debe crear un producto correctamente", async () => {
            // Given
            const productMock = {
                title: "Mesa",
                description: "Mesa de madera de Pino",
                code: "1114",
                price: 412,
                status: true,
                stock: 10,
                category: "Usado",
                thumbnails: ["https://loremflickr.com/pic1/640/480","https://loremflickr.com/pic2/640/480"]
            }

            // Then
           const { _body, statusCode } = await requester.post("/api/products/").send(productMock)
           //console.log(_body, statusCode)

            // Asserts
            expect(statusCode).is.equal(201)
            expect(_body.payload).to.ok.and.to.have.property('_id') // si existe un payload y si tiene la propiedad id
            expect(_body.payload.status).to.be.equal(true)
        })


        it("Crear Producto cuyo precio sea igual o menor a $0: El API POST /api/products debe retornar un estado HTTP 400 con error de solicitud", async () => {

             // Given
             const productMock = {
                title: "Mesa",
                description: "Mesa de madera de Pino",
                code: "2224",
                price: 0,
                status: true,
                stock: 10,
                category: "Usado",
                thumbnails: ["https://loremflickr.com/pic1/640/480","https://loremflickr.com/pic2/640/480"]
            }

             // Then
            const { _body, statusCode } = await requester.post("/api/products/").send(productMock)
            //console.log( _body, statusCode, productMock)
       

           // Asserts
           expect(statusCode).is.equal(400)
           expect(statusCode).to.be.ok
           expect(_body).to.ok.and.to.have.property('error')
           expect(productMock.price).to.be.equal(0)
           expect(productMock.price).not.to.be.undefined
           expect(productMock.price).not.to.be.NaN
           expect(productMock.price).not.to.be.null
           expect(productMock.price).to.be.at.least(0)
        })


        it("Crear Producto: El API POST /api/products debe crear un producto con un Título válido", async () => {

            // Given
            const productMock = {
                title: "Este es el Nombre de un Título válido",
                description: "Testeando que el título sea válido ",
                code: "3335",
                price: 120,
                status: true,
                stock: 10,
                category: "Nuevo",
                thumbnails: ["https://loremflickr.com/pic1/640/480","https://loremflickr.com/pic2/640/480"]
            }

            // Then
            const { _body, statusCode } = await requester.post("/api/products/").send(productMock)
            //console.log( "body",_body.payload.title, statusCode)


            // Asserts
            expect(statusCode).to.be.ok
            expect(statusCode).is.equal(201)
            expect(_body.payload).to.have.property('title');
            expect(_body).not.to.have.property('error')

            const { title } = _body.payload;
            expect(title).not.to.be.undefined
            expect(title).to.be.a('string');
            expect(title.length).to.be.at.most(60);
            expect(title).to.not.be.empty;
            expect(title.length).to.be.at.least(2);
            expect(title).to.match(/[a-zA-Z]/);
        })
       
    })


    /*=============================================
    =              Section 02 - CARTS            =
    =============================================*/
    describe("Testing API Carts", () =>{

    
            let productId;
            let cartId;
        

            before(async function () {
                
                   // producto de prueba
                   const productMock = await requester.post('/api/products').send({
                     title: "Producto para test",
                     description: "este es el nuevo Producto para test",
                     code: "4446",
                     price: 120,
                     status: true,
                     stock: 10,
                     category: "Nuevo",
                     thumbnails: ["https://loremflickr.com/pic1/640/480"]
                   });
         
                   productId = productMock.body.payload._id;
                   //console.log("PID:", productId);
         
                   // carrito de prueba
                   const cartMock = await requester.post('/api/carts').send({ products: [] });
                   cartId = cartMock.body.payload._id;
                   //console.log("CID:", cartId);
         
             });
        


            it("Crear Carrito: El API POST /api/carts/ debe corroborar que el carrito se creó correctamente", async () => {
                //Given
                const cartMock = {
                products: []
                };
        
                //Then
                const { _body, statusCode } = await requester.post("/api/carts/").send(cartMock);
        
                //Assert
                expect(statusCode).is.equal(201);
                expect(_body.payload).to.ok.and.to.have.property('_id');
                expect(_body.payload).to.have.deep.property('products').and.to.be.empty;
                });
        
            it("Colocar un Producto en un Carrito: El API PUT /api/carts/:cid/products/:pid debe agregar un producto al carrito correctamente", async () => {
              
                // then
                const  { _body, statusCode } = await requester.put(`/api/carts/${cartId}/product/${productId}`).send();
                //console.log("BODY",_body)
                
                // Asserts
                expect(statusCode).to.equal(200);
                expect(_body).to.have.property('_id').that.equals(cartId);
                expect(_body).to.have.property('products').that.is.an('array');
                expect(_body.products.some(p => p.product.status === true)).to.be.true;
                });

            
            it("Borrar un Producto del Carrito: El API DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito correctamente ", async () => {
                
                // then
                const  { _body, statusCode } = await requester.delete(`/api/carts/${cartId}/product/${productId}`).send();
                //console.log("BODY",_body.payload.products)
               
                // Asserts
                expect(statusCode).to.equal(200);
                expect(_body.payload.products).to.not.deep.include({ product: productId })
            })

    })



   /*=============================================
    =             Section 03 - SESSIONS           =
    =============================================*/
    describe("Testing Sessions con cookies", () =>{

        before(function () {
            this.cookie;
            this.mockUser = {
                first_name: "Usuario Test33",
                last_name: "Apellido Test33",
                email: "email_test33@mail.com",
                age: 33,
                password: "123qwe",
            }
        })

        
        

        it("Test Registro Usuario: Debe poder registrar correctamente un usuario", async function () {

            //then
            const { statusCode } = await requester.post('/api/extend/users/register').send(this.mockUser)

            //assert
            expect(statusCode).is.eql(200);
        })



        // obtenemos la info de la cookie. necesitamos el jwt
        it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {

            //given
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password
            }

            //then
            const result = await requester.post('/api/extend/users/login').send(mockLogin)
            const cookieResult = result.headers['set-cookie'][0]
            const cookieData = cookieResult.split('=')
            
            this.cookie = {
                name: cookieData[0],
                value : cookieData[1]
            }
            
            //assert
            expect(result.statusCode).is.eqls(200)
            expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken')
            expect(this.cookie.value).to.be.ok
        })




        it("Test Ruta Protegida: Debe enviar la cookie que contiene el usuario y destructurarla correctamente.", async function () {

            //then
            const {_body} = await requester.get('/api/extend/users/current').set('Cookie', `${this.cookie.name}=${this.cookie.value}`)
            //console.log('BODY',_body)

            //assert
            const user = _body.payload.user
            expect(user.email).to.be.ok.and.eql(this.mockUser.email)

        })


    })

})

 //? npm run test
    


