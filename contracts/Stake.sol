//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract Stake is Ownable {
    Token token;
    mapping(address => uint256) amount;
    mapping(address => uint256) depositTime;
    address public treasury;
    uint256 public totalFee;

    event StakeEvent(address, uint256);
    event WithdrawEvent(address, uint256);

    /**
     * @dev Constructor for Stake contract
     * @param _addr Adress of the ERC20 token smart contract
     */
    constructor(address _addr) {
        token = Token(_addr);
    }

    /**
     * @dev Function for users to stake tokens
     * @param _amount Amount to be staked
     */
    function stake(uint256 _amount) public {
        uint256 fee = (_amount*2)/1000;
        totalFee += fee;
        depositTime[msg.sender] = block.timestamp;
        amount[msg.sender] += _amount-fee;
        token.transferFrom(msg.sender, address(this), _amount);
        emit StakeEvent(msg.sender, _amount);
    }

    /**
     * @dev Function for users to withdraw staked tokens
     * @param _amount Amount to be withdrawn
     */
    function withdraw(uint256 _amount) public {
        require(_amount <= amount[msg.sender], "Insufficient balance");
        require(block.timestamp - depositTime[msg.sender] >= 2 hours, "Cannot unlock before 2 hours");
        amount[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
        emit WithdrawEvent(msg.sender, _amount);
    }

    /**
     * @dev Function to be used by owner to set treasury address
     * @param _addr Address of the treasury
     */
    function setTreasury(address _addr) public onlyOwner {
        require(_addr != address(0), "Treasury address cannot be zero address");
        treasury = _addr;
    }

    /**
     * @dev Function to be used by owner to collect fee
     */
    function collectFee() external onlyOwner {
        token.transfer(treasury,totalFee);
    }
}