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


let source = fs.readFileSync('Reports.sol', 'utf8');
console.log("Compiling Source Code")
let compiled = solc.compile(source,1);
abi = JSON.parse(compiled.contracts[":Reports"].interface);
bytecode = '0x'+compiled.contracts[":Reports"].bytecode;
gasEstimate = await web3.eth.estimateGas({data: bytecode});

console.log('abi',abi);
//console.log('bytecode',bytecode);
//console.log('gasEstimate',gasEstimate);

} 
main()


// GLOBAL
var abi = 0x00;
var contractAddress = '0x5e4B2597982ef4f9418D0888598E46D933C0aeA8';
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





router.get('/get_report_time', function(req, res, next) {
  	console.log("get_report")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
    var commitment = req.query.commitment;
    myContract.methods.getTime(commitment).call().then(data => {
		console.log('data',data);
		res.send({start: data._start, end: data._end });
	
	})
})

router.get('/get_report_reply', function(req, res, next) {
  	console.log("get_report")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
    var commitment = req.query.commitment;
    myContract.methods.getReply(commitment).call().then(data => {
		console.log('data',data);
		res.send({reply: data+"" });
	})
})



router.get('/end', function(req, res, next) {
  	console.log("end")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
	
  var commitment = req.query.commitment;
  
  myContract.methods
  .end(commitment)
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


router.get('/reply', function(req, res, next) {
  	console.log("reply")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
	
  var commitment = req.query.commitment;
  var reply = req.query.reply;
  
  myContract.methods
  .reply(commitment,reply)
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

router.get('/selection', function(req, res, next) {
  	console.log("selection")
	console.log('contractAddress',contractAddress);
	var myContract = new web3.eth.Contract(abi,contractAddress);
	
  var commitment = req.query.commitment;
  var hash_video = req.query.hash_video;
  var sec_video = parseInt(req.query.sec_video);
  
  myContract.methods
  .selection(commitment, hash_video, sec_video)
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



module.exports = router;