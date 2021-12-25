const Dgram = artifacts.require("../src/contracts/Dgram.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Dgram',([developer, author, tipper]) => {
    let dgram;

    before(async () => {
        dgram = await Dgram.deployed();
    })

    describe('Contract deployed', async () => {

        it('Contract deployed successfully', async () => {
            const address = await dgram.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it("Contract has a name", async () => {
            const name = await dgram.name()
            assert.equal(name, 'Dgram')
        })
    })
    
    describe('Image deployed', async () => {
        let result; 

        it('image created', async () => {
            result = await dgram.uploadImage();
        let image = await dgram.images(1);
        console.log(image);
        })
})

})
