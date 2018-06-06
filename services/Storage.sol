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
    	accesses.push(Access({description: "lezione1", code_user: 1 , commitment: 10}));
    	accesses.push(Access({description: "lezione2", code_user: 2 , commitment: 20}));
    	accesses.push(Access({description: "lezione3", code_user: 3 , commitment: 30}));
    }
    
    function countAccess() constant public returns (uint) {
        return accesses.length;
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
   
    
}
