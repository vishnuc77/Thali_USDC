import { ethers } from 'ethers';
import Stake from './Stake.json';
import Token from './Token.json';
import { useState } from 'react';

function App() {
  const [ balance, setBalance ] = useState(0);
  const [ allowance, setAllowance ] = useState(0);
  const [ approveValue, setApproveValue ] = useState(0);
  const [ stakeValue, setStakeValue ] = useState(0);
  const [ withdrawValue, setWithdrawValue ] = useState(0);
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchBalance() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Token.address, Token.abi, signer);
      try {
        const balance = await contract.balanceOf(signer.getAddress());
        setBalance(balance.toString());
        console.log('balance: ', balance.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function setTreasury() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Stake.address, Stake.abi, signer);
      try {
        await contract.setTreasury(signer.getAddress());
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function getTreasury() {
    await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Stake.address, Stake.abi, provider);
      try {
        const treasury = await contract.treasury();
        console.log('address: ', treasury);
      } catch (err) {
        console.log('Error: ', err);
      }
  }

  async function approve() {
    if (!approveValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Token.address, Token.abi, signer);
      try {
        await contract.approve(Stake.address, approveValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function getAllowance() {
    await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Token.address, Token.abi, provider);
      try {
        const allowance = await contract.allowance(provider.getSigner().getAddress(), Stake.address);
        setAllowance(allowance.toString());
        console.log('allowance: ', allowance.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
  }

  async function stake() {
    if (!stakeValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Stake.address, Stake.abi, signer);
      try {
        await contract.stake(stakeValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function withdraw() {
    if (!withdrawValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Stake.address, Stake.abi, signer);
      try {
        await contract.withdraw(withdrawValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchBalance}>Get Balance</button><br />
        <p>Balance: {balance}</p>
        <button onClick={setTreasury}>Set Treasury Address</button><br />
        <button onClick={getTreasury}>Get Treasury Address</button><br />
        <input onChange={e => setApproveValue(e.target.value)} placeholder="Set approve value" />
        <button onClick={approve}>Approve</button><br />
        <button onClick={getAllowance}>Get Allowance</button><br />
        <p>Allowance: {allowance}</p>
        <input onChange={e => setStakeValue(e.target.value)} placeholder="Set stake value" />
        <button onClick={stake}>Stake</button><br />
        <input onChange={e => setWithdrawValue(e.target.value)} placeholder="Set withdraw value" />
        <button onClick={withdraw}>Withdraw</button><br />
      </header>
    </div>
  );
}

export default App;
