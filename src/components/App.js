import React, { Component } from 'react';
import Header from './Header';
import './App.css';
import Web3 from 'web3';
import Dgram from '../abis/Dgram.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log(accounts)

    //network ID 
    const networkId = await web3.eth.net.getId()
    const networkData = Dgram.networks[networkId]
    if(networkData){
      const dgram = web3.eth.Contract(Dgram.abi, networkData.address)
      this.setState({ dgram })
      const imagesCount = await dgram.methods.imagesCount().call()
      this.setState({ imagesCount })
    
    //load images
    
    }
    else {
      window.alert('Dgram contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dgram: null,
      images: [],
      loading: true
    }
  }
  

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

export default App;
