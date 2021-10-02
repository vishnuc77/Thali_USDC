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

    constructor(address _addr) {
        token = Token(_addr);
    }

    function stake(uint256 _amount) public {
        uint256 fee = (_amount*2)/1000;
        totalFee += fee;
        depositTime[msg.sender] = block.timestamp;
        amount[msg.sender] += _amount-fee;
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _amount) public {
        require(_amount <= amount[msg.sender], "Insufficient balance");
        require(block.timestamp - depositTime[msg.sender] >= 2 hours, "Cannot unlock before 2 hours");
        amount[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
    }

    function setTreasury(address _addr) public onlyOwner {
        require(_addr != address(0), "Treasury address cannot be zero address");
        treasury = _addr;
    }

    function collectFee() external onlyOwner {
        token.transfer(treasury,totalFee);
    }
}