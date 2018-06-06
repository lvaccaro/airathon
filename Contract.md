Smart-contract in solidity
====


We build two different smart-contract to provide:

* autentication of the user we access to the contents
* tracking of the user experiences with mobile app


## Autentication
The main idea is that a user access to the contents without a specify username/password, but fill some informations about (code request, reason, description and so on) related the operation to do; it could be a lesson in school or a real operation on remote-site.
The smart-contract keeps track of the filled information and build a unique random id for the specific request to committed on blockchain.

In the `Storage` smart-contract, `struct Access` contains the meta-information with the commitment.

Modifier methos change the current status of the blockchain through transactions:

* newAccess: track the meta-information of the user and generate a commitment

Observer methods are read-only functions to read the local memory inside the contract, and they don't change the status of the blockchain ( there are no transaction ):

* getAccess: get meta-information of an Access based on commitment
* getCommitment: get commitment of an user access
* countAccess: count the access
* random:  generate a random number

The `Storage` smart-contract is the following:


```
pragma solidity ^0.4.18;

contract Storage {
    struct Access {
        uint8 code_user;
        string description;
        uint8 commitment;
    }
    Access[] public accesses;
    address root_owner;
    
    constructor (){
    	root_owner = msg.sender;
    }    
    
    function newAccess(uint8 _code_user, string _description) public payable returns (uint8){
    	uint8 commitment = random();
    	accesses.push(Access({code_user: _code_user, description: _description, commitment: commitment}));
    	return commitment;
    }
    
     function random() private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%251);
    }
    
    function getCommitment(uint _code_user) public view returns (uint8 _commitment) {
    	_commitment = 0;
    	for (uint i = 0; i < accesses.length; i++){
    		if(accesses[i].code_user == _code_user){
    			_commitment = accesses[i].commitment;
    		}
    	}
    }
    
    function getAccess(uint _commitment) public view returns (uint8 _code_user, string _description) {
    	_code_user = 0;
    	_description = "";
    	for (uint i = 0; i < accesses.length; i++){
    		if(accesses[i].commitment == _commitment){
    			_code_user = accesses[i].code_user;
    			_description = accesses[i].description;
    		}
    	}
    }
   
    function countAccess() constant public returns (uint) {
        return accesses.length;
    }
}
```


## Tracking
This smart-contract needs to track the user experiences during the lesson or the operation. The default experience is the following: 

1. user select a video, 
2. play the video
3. look all video content
4. reply to one or more questions

For this purpouse `Reports` smart-contract is defined with a main `struct Report` which contains some information about :

* the video (hash, duration in sec)
* user experience (play time and stop time) 
* replies to questions (in this example only 1 reply)

Modifier methods allow to store information on the blockchain:

* selection: user select a specific content to see
* start: when the movie starts
* end: when the movie ends
* reply: set the a plain text as reply

Observer methods allow to read the stored information:

* getReply: read the reply of a specific experience
* getTime: read the start & end time of a specific experience

Note: if the delta time (between start and stop) is less then video duration, the user manipolate the video player in order to jump some video frames. 

```
pragma solidity ^0.4.18;

contract Reports {
    
    struct Report {
       uint start;
   		uint end;
   		string hash_video;
   		uint sec_video;
       string reply;
    }
    
    mapping(uint8 => Report) public reports;
    
    
   function selection(uint8 _commitment, string _hash_video, uint _sec_video) public payable{
  	 var report = reports[_commitment];
      report.start = now;
      report.end = 0;
      report.reply = "";
      report.hash_video = "";
      report.sec_video = 0;
   } 
   
   
   function start(uint8 _commitment) public payable{
      reports[_commitment].start = now;
   } 
   function end(uint8 _commitment) public payable{
      reports[_commitment].end = now;
   } 
   function reply(uint8 _commitment, string reply) public payable{
      reports[_commitment].reply = reply;
   } 
   
   function getReply(uint8 _commitment)  public view returns (string _reply) {
   	  _reply = reports[_commitment].reply;  
   }
   
    function getTime(uint8 _commitment)  public view returns (uint _start, uint _end) {
   	  _start = reports[_commitment].start;
   	  _end = reports[_commitment].end;
   	  }
}
```

