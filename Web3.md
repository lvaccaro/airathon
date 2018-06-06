Deploy & Interact with smart contract on web3
===

Import requirements libs:

```
var Web3 = require('web3');
var fs = require('fs');
var sleep = require('sleep');
var solc = require('solc');
```
Setup web3:

```
if (typeof window !== 'undefined' && typeof window.Web3 === 'undefined') {
   window.Web3 = Web3;
}
module.exports = Web3;
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
```

Get accounts and unlock wanted address, for example:

```
var accounts = await web3.eth.getAccounts();
var rootAccount  = accounts[0];
var userAccount = accounts[2];
await web3.eth.personal.unlockAccount(rootAccount, "delta", 1000);
await web3.eth.personal.unlockAccount(userAccount, "delta", 1000);
```

Read a smart-contract from `Reports.sol` file:

```
let source = fs.readFileSync('Reports.sol', 'utf8');
let compiled = solc.compile(source,1);
let abi = JSON.parse(compiled.contracts[":Reports"].interface);
let bytecode = '0x'+compiled.contracts[":Reports"].bytecode;
let gasEstimate = await web3.eth.estimateGas({data: bytecode});

console.log('abi',abi);
console.log('bytecode',bytecode);
console.log('gasEstimate',gasEstimate);
```

#### Deploy a new contract
Build a contract instance:

```
var myContract = new web3.eth.Contract(abi, userAccount, {
    from: rootAccount, // default from address
    gasPrice: gasEstimate, 
    data: bytecode,
    gas: 1000000
});
console.log('myContract.options',myContract.options);
```

Deploy a contract: at the end the `contractAddress` var contains the real contract address); look at the geth interface to verify the mining process.

```
var contractAddress = 0x00;
myContract.deploy({
    data: bytecode,
    arguments: []
})
.send(myContract.options, function(error, transactionHash){ 
 })
.on('error', function(error){ console.log('error',error) })
.on('transactionHash', function(transactionHash){ console.log('transactionHash',transactionHash) })
.on('receipt', function(receipt){
	//console.log('receipt',receipt)
	console.log(receipt.contractAddress) // contains the new contract address
	contractAddress = receipt.contractAddress ;
})
.on('confirmation', function(confirmationNumber, receipt){ 
	console.log('confirmation',confirmationNumber) })
.then(function(newContractInstance){
	console.log('newContractInstance') 
    console.log(newContractInstance.options.address) // instance with the new contract address
});
```

#### Interact with an existence contract

Read an existence contract:

```
var myContract = new web3.eth.Contract(abi,contractAddress);
console.log('myContract.options',myContract.options);
```

Send a transaction with meta-information; for example to set the end of the video player:

```
  var commitment = 10;
  myContract.methods
  .end(commitment)
  .send({
    from: userAccount,
     gas: 100000
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('confirmationNumber',confirmationNumber);
   })
  .on('transactionHash', hash => {
      console.log('hash',hash);
  })
  .on('receipt', receipt => {
      console.log('receipt',receipt);
  })
})
```

Call an observer method, read-only function; for example to read start time and stop time of the played video.

```
	var commitment = 10;
    myContract.methods.getTime(commitment).call().then(data => {
		console.log('start',data.start);
		console.log('end',data.end);
	})
```

