const People = artifacts.require("People");
const TruffleAssert = require("truffle-assertions");

contract("People", async function(){
    it("shouldn't create a person with age over 150 years", async function(){
    let instance = await People.deployed();
    // tests a require statement using truffle-assertions
    // will return "AssertionError: Did not fail" if test fails
    await TruffleAssert.fails(instance.createPerson("Bob", 200, 190, {value: web3.utils.toWei("1", "ether")}), TruffleAssert.ErrorType.REVERT);
    })
});