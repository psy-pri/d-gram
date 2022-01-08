import React, { Component } from 'react';
import Main from './Main';
import Navbar from './Navbar';
import './App.css';
import Web3 from 'web3';
import Dgram from '../abis/Dgram.json'

// Declare IPFS
const projectId = 'enter_project_id'
const projectSecret = 'enter project_secret'
const ipfsClient = require('ipfs-http-client')
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
const ipfs = ipfsClient({ 
  host: 'ipfs.infura.io', 
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
}) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //method to connect to metamask 
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

    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Dgram.networks[networkId]
    if(networkData) {
      const dgram = new web3.eth.Contract(Dgram.abi, networkData.address)
      this.setState({ dgram })
      const imagesCount = await dgram.methods.imageCount().call()
      this.setState({ imagesCount })
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await dgram.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('Dgram contract not deployed to detected network.')
    }
  }
captureFile = event => {

  event.preventDefault()
  const file = event.target.files[0]
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)

  reader.onloadend = () => {
    this.setState({ buffer: Buffer(reader.result) })
    console.log('buffer', this.state.buffer)
  }
}

uploadImage = description => {
  console.log("Submitting file to ipfs...")

  //adding file to the IPFS
  ipfs.add(this.state.buffer, (error, result) => {
    console.log('Ipfs result', result)
    if(error) {
      console.error(error)
      return
    }

    this.setState({ loading: true })
    this.state.dgram.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  })
}

tipImageOwner(id, tipAmount) {
  this.setState({ loading: true })
  this.state.dgram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
    this.setState({ loading: false })
  })
}

constructor(props) {
  super(props)
  this.state = {
    account: '',
    dgram: null,
    images: [],
    loading: true
  }

  this.uploadImage = this.uploadImage.bind(this)
  this.tipImageOwner = this.tipImageOwner.bind(this)
  this.captureFile = this.captureFile.bind(this)
}

render() {
  return (
    <div>
      <Navbar account={this.state.account} />
      { this.state.loading
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
          />
      }
    </div>
  );
}
}

export default App;
