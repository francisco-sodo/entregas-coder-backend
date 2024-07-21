import { expect } from "chai";
import { createHash } from "../../src/utils.js";


describe('Test de la libreria de encriptacion de Utils', () => {

    // ----------- test 01
    it('La funcion createHash debe generar un password encriptado', async function () {
        //Given - la data que entrego al Then
        const passwordMock = '123qwe';

        //Then - 
        const result = createHash(passwordMock)
        console.log(result)
        
        //Assert - la validacion
        expect(result).not.to.be.undefined
        expect(result).not.to.be.NaN
        expect(result).not.to.be.null
        expect(result).not.to.be.empty
        expect(result).not.equal(passwordMock)
    });


})



 //? npx mocha test/utils/Utils.test.js


