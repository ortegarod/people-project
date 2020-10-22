const People = artifacts.require("People");
const AssertionError = require("assertion-error");
const TruffleAssert = require("truffle-assertions");

contract("People", async function(accounts){

    // RUNS BEFORE EACH TEST
    // let instance;
    // beforeEach(async function(){
    //     instance = await People.new();
    // })

    // RUNS ONCE BEFORE WE START ANY TESTS
    let instance;
    before(async function(){
        instance = await People.deployed();
    })

    // OTHER FUNCTIONS AVAILABLE
    // after()
    // afterEach()

    it("shouldn't create a person with age over 150 years", async function(){
    // let instance = await People.deployed();
    // tests a require statement using truffle-assertions
    // will return "AssertionError: Did not fail" if test fails
    await TruffleAssert.fails(instance.createPerson("Bob", 200, 190, {value: web3.utils.toWei("1", "ether"), from: accounts[0]}), TruffleAssert.ErrorType.REVERT);
    })
    it("shouldn't create a person without payment", async function(){
        // let instance = await People.deployed();
        await TruffleAssert.fails(instance.createPerson("Bob", 50, 190, {value: web3.utils.toWei("0.5", "ether"), from: accounts[0]}), TruffleAssert.ErrorType.REVERT);
    })
    it("should set senior status correctly", async function(){
        // let instance = await People.deployed();
        await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei("1", "ether"), from: accounts[0]});
        let result = await instance.getPerson();
        assert(result.senior === true, "senior level not set");
        // can also combine "assert(result.senior === true && ..., "...");""
    })
    it("should set age correctly", async function(){
        // let instance = await People.deployed();
        let result = await instance.getPerson();
        assert(result.age.toNumber() === 65, "age not set correctly");
    })
    it("should not allow non-owner to delete people (solution #1)", async function(){
        // let instance = await People.deployed();
        await TruffleAssert.fails(instance.deletePerson(accounts[0], {from: accounts[1]}), TruffleAssert.ErrorType.REVERT);
    })
    it("should not allow non-owner to delete people (solution #2)", async function(){
        // let instance = await People.deployed();
        await instance.createPerson("Lisa", 35, 160, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await TruffleAssert.fails(instance.deletePerson(accounts[1], {from: accounts[1]}), TruffleAssert.ErrorType.REVERT);
    });
    it("should allow the owner to delete people (solution #2)", async function(){
        let instance = await People.new(); // creates a new contract instance
        await instance.createPerson("Lisa", 35, 160, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await TruffleAssert.passes(instance.deletePerson(accounts[1], {from: accounts[0]}));
    });
    it("should allow the owner to withdraw balance of contract)", async function(){
        let instance = await People.new(); // creates a new contract instance
        await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        await TruffleAssert.passes(instance.withdrawAll({from: accounts[0]}));
    });
    it("should not allow the non-owner to withdraw balance of contract)", async function(){
        let instance = await People.new(); // creates a new contract instance
        await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        await TruffleAssert.fails(instance.withdrawAll({from: accounts[2]}), TruffleAssert.ErrorType.REVERT);
    });
    it("owners balance should increase after withdraw)", async function(){
        let instance = await People.new(); // creates a new contract instance
        await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        let balanceBefore = parseFloat(await web3.eth.getBalance(accounts[0]));
        await instance.withdrawAll();
        let balanceAfter = parseFloat(await web3.eth.getBalance(accounts[0]));
        assert(balanceBefore < balanceAfter, "owners balance was not increase after withdrawl");
    });
    it("should reset balance to 0 after withdraw and balance should match balance on blockchain)", async function(){
        let instance = await People.new(); // creates a new contract instance
        await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        await instance.withdrawAll();
        let balance = await instance.balance();
        let floatBalance = parseFloat(balance);
        let realBalance = await web3.eth.getBalance(instance.address);
        assert(floatBalance == web3.utils.toWei("0", "ether") && floatBalance == realBalance, "contract balance does is not zero");
    });
});