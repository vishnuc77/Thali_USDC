const { ethers } = require("hardhat")
const { expect } = require("chai");

describe("Stake contract", function () {

    let stakeContract;
    let stake;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        tokenContract = await ethers.getContractFactory("Token")
        token = await tokenContract.deploy();
        stakeContract = await ethers.getContractFactory("Stake")
        stake = await stakeContract.deploy(token.address);
    });

    describe("Deployment", function () {
        it("should set the right owner", async function () {
            expect(await stake.owner()).to.equal(owner.address);
        });

        it("should be able to stake", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            await token.approve(stake.address, 1000000);
            await stake.stake(100000);
            expect(await token.balanceOf(owner.address)).to.equal(ownerBalance-100000);
        });

        it("should not be able to withdraw before 2 hours", async function () {
            await token.approve(stake.address, 1000000);
            await stake.stake(100000);
            await expect(
                stake.withdraw(10000)
                ).to.be.revertedWith("Cannot unlock before 2 hours");
        });

        it("should calculate fee", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            await token.approve(stake.address, 1000000);
            await stake.stake(100000);
            expect(await token.balanceOf(stake.address)).to.equal(100000);
            expect(await stake.totalFee()).to.equal(100000*2/1000);
        });

        it("should be able to set treasury address", async function () {
            await stake.setTreasury(owner.address);
            expect(await stake.treasury()).to.equal(owner.address);
        });

        it("should be able to collect fee", async function () {
            await token.transfer(addr1.address, 100000);
            const ownerBalance = await token.balanceOf(owner.address);
            await token.connect(addr1).approve(stake.address, 100000);
            await stake.setTreasury(owner.address);
            await stake.connect(addr1).stake(100000);
            await stake.collectFee();
            expect(await token.balanceOf(owner.address)).to.equal(99900200);
        })
    });
});