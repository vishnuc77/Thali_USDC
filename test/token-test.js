const { ethers } = require("hardhat")
const { expect } = require("chai");


describe("Token contract", function () {

    let tokenContract;
    let token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        tokenContract = await ethers.getContractFactory("Token")
        token = await tokenContract.deploy();
    });

    describe("Deployment", function () {
        it("should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        })
    
        it("should mint tokens and transfer to the owner", async function () {
            await token.mint(owner.address, 1000);
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        })
    });

    describe("Transactions", function () {
        it("should transfer tokens between accounts", async function () {
            await token.mint(owner.address, 1000);
            const ownerBalance = await token.balanceOf(owner.address);
            await token.transfer(addr1.address, 500);
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance - 500);
            expect(await token.balanceOf(addr1.address)).to.equal(500);
        });
    })
});