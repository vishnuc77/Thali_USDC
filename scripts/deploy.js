async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    const ownerBalance = await token.balanceOf(deployer.address);
    stakeContract = await ethers.getContractFactory("Stake")
    stake = await stakeContract.deploy(token.address);
  
    console.log("Token smart contract address:", token.address);
    console.log("Balance of owner:", ownerBalance.toString());
    console.log("Stake smart contract address:", stake.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });