import mongoose from "mongoose";
import config from '../../src/config/config.js';
import UsersDao from '../../src/services/dao/db/user.service.js';
import { expect } from "chai";




mongoose.connect(config.mongoUrlTest)




describe('Testing User Dao', () => {

    before(function () {
        this.usersDao = new UsersDao();
    });


    beforeEach(function () {
        this.timeout(5000);
        mongoose.connection.collections.users.drop();
    });

    // ----------- test 01
    it('El dao debe devolver los usuarios en formato Array.', async function () {
        //Given - la data que entrego al Then
        const emptyArray = [];

        //Then - 
        const result = await this.usersDao.getAll();
        
        //Assert - la validacion
        expect(result).to.be.deep.equal(emptyArray)
        expect(Array.isArray(result)).to.be.ok
        expect(Array.isArray(result)).to.be.equal(true)
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });


     // ----------- test 02
     it('El dao debe agregar un usuario correctamente a la DB.', async function () {
        //Given - la data que entrego al Then
        let mockUser = {
            first_name: "UserName test-02",
            last_name: "UserLastName test-02",
            email: "test02@mail.com",
            password: "123qwe",
        }

        //Then - 
        const result = await this.usersDao.create(mockUser);

        //Assert - la validacion
        expect(result._id).to.be.ok
    });


// ----------- limpiamos DB al finalizar los tests
    afterEach(function () {
        mongoose.connection.collections.users.deleteMany();
    })


})

 //?  npx mocha test/dao/User.dao.test.js 