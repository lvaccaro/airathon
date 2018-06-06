var Web3 = require('web3');
var fs = require('fs');
var sleep = require('sleep');
var solc = require('solc');
var express = require('express');
var router = express.Router();

if (typeof window !== 'undefined' && typeof window.Web3 === 'undefined') {
   window.Web3 = Web3;
}
module.exports = Web3;
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


// BOOT TIME
const main = async () => {

var accounts = await web3.eth.getAccounts();
rootAccount  = accounts[0];
videoAccount = accounts[1];
userAccount = accounts[2];
console.log('rootAccount',rootAccount);
console.log('videoAccount',videoAccount);
console.log('userAccount',userAccount);

await web3.eth.personal.unlockAccount(rootAccount, "delta", 1000);
await web3.eth.personal.unlockAccount(videoAccount, "delta", 1000);
await web3.eth.personal.unlockAccount(userAccount, "delta", 1000);


let source = fs.readFileSync('Storage.sol', 'utf8');
console.log("Compiling Source Code")
let compiled = solc.compile(source,1);
abi = JSON.parse(compiled.contracts[":Storage"].interface);
bytecode = '0x'+compiled.contracts[":Storage"].bytecode;
gasEstimate = await web3.eth.estimateGas({data: bytecode});

console.log('abi',abi);
//console.log('bytecode',bytecode);
//console.log('gasEstimate',gasEstimate);

} 
main()


// GLOBAL
var abi = 0x00;
var contractAddress = '0x71b1AfB93e5827B7989cF5dd060Df37cbB3E537D';
var bytecode = 0x00;
var gasEstimate = 0x00;
var rootAccount = 0x00;
var videoAccount = 0x00;
var userAccount = 0x00;

/*
DEPLOY
*/
router.get('/deploy', function(req, res, next) {

var myContract = new web3.eth.Contract(abi, videoAccount, {
    from: rootAccount, // default from address
    gasPrice: gasEstimate, // default gas price in wei, 20 gwei in this case
    data: bytecode,
    gas: 1000000
});

console.log('myContract.options',myContract.options);


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

});




router.get('/count_access', function(req, res, next) {
  	console.log("count_access")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
	var count = myContract.methods.countAccess().call().then(count => {
		console.log(count);
		res.send(count);
	})
})



router.get('/get_commitment', function(req, res, next) {
  	console.log("get_commitment")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
    var code_user = req.query.code_user;
	myContract.methods.getCommitment(code_user).call().then(commitment => {
		console.log('commitment',commitment);
		res.send(commitment);
	
	})
})


router.get('/get_access', function(req, res, next) {
  	console.log("get_access")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
    var commitment = req.query.commitment;
	myContract.methods.getAccess(commitment).call().then(data => {
		console.log('data',data);
		res.send({code_user: data._code_user, description: data._description});
	
	})
})


router.get('/new_access', function(req, res, next) {
  	console.log("new_access")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
	
  var code_user = req.query.code_user;
  var description = req.query.description;
  
  myContract.methods
  .newAccess(code_user, description)
  .send({
    from: userAccount,
     gas: 100000
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('confirmation: ' + confirmationNumber);
    if (confirmationNumber == 1){
    	res.send("ok");
    }
  })
  .on('transactionHash', hash => {
      console.log('hash');
      console.log(hash);
  })
  .on('receipt', receipt => {
      console.log('receipt');
      console.log(receipt);
  })
})



/*
router.get('/add', function(req, res, next) {
var myContract = new web3.eth.Contract(abi,contractAddress);

console.log("add video")
console.log('contractAddress',contractAddress);

var _name = "blue-angels-diamond"
var _sec = 223
var _hash = '0x3a10daefdebf77db98aa91f9ad5425036eba193bc46da6c5431d89f865f58220'
  
  myContract.methods
  .add(_name, _sec)
  .send({
    from: userAccount,
     gas: 100000
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('confirmation: ' + confirmationNumber);
  })
  .on('transactionHash', hash => {
      console.log('hash');
      console.log(hash);
  })
  .on('receipt', receipt => {
      console.log('receipt');
      console.log(receipt);
  });
});



router.get('/count', async function(req, res, next) {
	console.log("count video")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
	var count = await myContract.methods.count().call();
	console.log(count);
	res.send(count);
});
*/
module.exports = router;