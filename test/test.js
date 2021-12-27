const { assert } = require('chai');

const Dgram = artifacts.require("../src/contracts/Dgram.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Dgram',([developer, author, tipper]) => {
    let dgram;

    before(async () => {
        dgram = await Dgram.deployed();
    })
    // contract deployment
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
    // image deployment
    describe('Image deployed', async () => {
        let result, imageCount;
        const hash = 'abcddd12333' 

        before(async () => {
            result = await dgram.uploadImage(hash,'Img desc',{ from: author})
            imageCount = await dgram.imageCount();
        })

        it('image created', async () => {
        //SUCCESS
        assert.equal(imageCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'hash is correct')
        assert.equal(event.description, 'Img desc', 'description is correct')
        assert.equal(event.tipAmount, '0', 'tip amt is correct')
        assert.equal(event.author, author, 'author is correct')

        //FAILURE: Image must have a hash
        await dgram.uploadImage('','Img desc', { from: author }).should.be.rejected;

        //FAILURE: Image must have a description
        await dgram.uploadImage(hash,'', { from: author }).should.be.rejected;
        })

        // list images deployment
        it('list images', async () => {
        const image = await dgram.images(imageCount)
        assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(image.hash, hash, 'hash is correct')
        assert.equal(image.description, 'Img desc', 'description is correct')
        assert.equal(image.tipAmount, '0', 'tip amt is correct')
        assert.equal(image.author, author, 'author is correct')
        })

        //image tipping 
        it('tip images', async () => {
            // track the author balance before tipping 
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await dgram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1','Ether')})
        
        //SUCCESS
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'hash is correct')
        assert.equal(event.description, 'Img desc', 'description is correct')
        // assert.equal(event.tipAmount, '1000000000000000000', 'tip amt is correct')
        assert.equal(event.author, author, 'author is correct')
        

        // check that author recieved funds
        let newAuthorBalance
        newAuthorBalance = await web3.eth.getBalance(author)
        newAuthorBalance = new web3.utils.BN(newAuthorBalance)

        let tipImageAmount
        tipImageAmount = web3.utils.toWei('1','Ether')
        tipImageAmount = new web3.utils.BN(tipImageAmount)

        const expectedBalance = oldAuthorBalance.add(tipImageAmount)

        assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
        
        // FAILURE: tries to tip an image that does not exist 
        await dgram.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
})
})