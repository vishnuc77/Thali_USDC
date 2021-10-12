require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: './.env'});
require("solidity-coverage");


const alchemy_url = "https://eth-rinkeby.alchemyapi.io/v2/kPJSqlXGFLxT3DFZ0LWLqaxx2Vhnz1kp";


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: alchemy_url,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
