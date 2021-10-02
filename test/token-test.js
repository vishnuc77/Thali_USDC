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

        it("should fail to mint tokens for a non owner address", async function () {
            await expect(
                token.connect(addr1).mint(addr1.address, 100)
                ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Transactions", function () {
        it("should transfer tokens between accounts", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            await token.transfer(addr1.address, 500);
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance - 500);
            expect(await token.balanceOf(addr1.address)).to.equal(500);
        });

        it("should not transfer tokens when balance is less", async function () {
            await expect(
                token.connect(addr1).transfer(addr2.address, 100)
                ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("should update balances after transfer", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            await token.transfer(addr1.address, 500);
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance - 500);
            expect(await token.balanceOf(addr1.address)).to.equal(500);
            await token.connect(addr1).transfer(addr2.address, 250);
            expect(await token.balanceOf(addr1.address)).to.equal(250);
            expect(await token.balanceOf(addr2.address)).to.equal(250);
        });

        it("should be able to add allowance", async function () {
            await token.approve(addr1.address, 10000);
            expect(await token.allowance(owner.address, addr1.address)).to.equal(10000);
        });

        it("should be able to spend the approved allowance", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            await token.approve(addr1.address, 10000);
            await token.connect(addr1).transferFrom(owner.address, addr2.address, 10000);
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance - 10000);
            expect(await token.balanceOf(addr2.address)).to.equal(10000);
        });

        it("should not be able to spend more than allocated allowance", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            await token.approve(addr1.address, 10000);
            await expect(
                token.connect(addr1).transferFrom(owner.address, addr2.address, 10001)
                ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
        });
    });

    describe("Pausing and unpausing", function () {
        it("should be able to pause transactions", async function () {
            await token.mint(owner.address, 1000);
            await token.pause();
            await expect(
                token.transfer(addr1.address, 100)
                ).to.be.revertedWith("Pausable: paused");
        });

        it("should be able to unpause after pausing", async function () {
            await token.mint(owner.address, 1000);
            await token.pause();
            await token.unpause();
            const ownerBalance = await token.balanceOf(owner.address);
            await token.transfer(addr1.address, 500);
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance - 500);
            expect(await token.balanceOf(addr1.address)).to.equal(500);
        });

        it("should fail to pause for a non owner address", async function () {
            await token.mint(owner.address, 1000);
            await expect(
                token.connect(addr1).pause()
                ).to.be.revertedWith("Ownable: caller is not the owner");
        })
    });
});