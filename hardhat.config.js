require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: './.env'});


const alchemy_url = "https://eth-rinkeby.alchemyapi.io/v2/kPJSqlXGFLxT3DFZ0LWLqaxx2Vhnz1kp";
const private_key = "b47efed4ff48b66102367ba5c592f182325913961bc84eee4bf1c20d440dcc2e";


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
