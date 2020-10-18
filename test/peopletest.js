const People = artifacts.require("People");
const AssertionError = require("assertion-error");
const TruffleAssert = require("truffle-assertions");

contract("People", async function(){
    it("shouldn't create a person with age over 150 years", async function(){
    let instance = await People.deployed();
    // tests a require statement using truffle-assertions
    // will return "AssertionError: Did not fail" if test fails
    await TruffleAssert.fails(instance.createPerson("Bob", 200, 190, {value: web3.utils.toWei("1", "ether")}), TruffleAssert.ErrorType.REVERT);
    })
    it("shouldn't create a person without payment", async function(){
        let instance = await People.deployed();
        await TruffleAssert.fails(instance.createPerson("Bob", 50, 190, {value: web3.utils.toWei("0.5", "ether")}), TruffleAssert.ErrorType.REVERT);
    })
    it("should set senior status correctly", async function(){
        let instance = await People.deployed();
        await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei("1", "ether")});
        let result = await instance.getPerson();
        assert(result.senior === true, "senior level not set");
        // can also combine "assert(result.senior === true && ..., "...");""
    })
    it("should set age correctly", async function(){
        let instance = await People.deployed();
        let result = await instance.getPerson();
        assert(result.age.toNumber() === 65, "age not set correctly");
    })
});