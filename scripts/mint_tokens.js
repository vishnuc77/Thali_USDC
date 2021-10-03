const { ethers } = require("hardhat")

const tokenAbi = require("../artifacts/contracts/Token.sol/Token.json");

async function main() {
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0x4EC920398BE9Ce420668E9b2C259f6b2D12B36f5";

    console.log(tokenAbi);
  
    const contract = new ethers.Contract(
        tokenAddress,
        tokenAbi.abi,
        deployer
    );

    await contract.mint(deployer.address, 100 * 10**5);
    const ownerBalance = await contract.balanceOf(deployer.address);
    
    console.log("Token smart contract address:", contract.address);
    console.log("Balance of owner:", ownerBalance.toString());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });