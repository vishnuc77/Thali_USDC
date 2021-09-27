const { ethers } = require("hardhat")
const { expect } = require("chai");


describe("Token contract", function () {
    it("gets the instance of Token contract", async function () {
        const tokenContract = await ethers.getContractFactory("Token")
    })

    it("mints tokens and transfers to the owner", async function () {
        const [owner] = await ethers.getSigners();
        const tokenContract = await ethers.getContractFactory("Token")
        const token = await tokenContract.deploy();
        await token.mint(owner.address, 1000);
        const ownerBalance = await token.balanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalance);
    })
})