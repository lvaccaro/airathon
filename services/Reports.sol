pragma solidity ^0.4.18;

contract Reports {
    
    struct Report {
        string reply;
        uint start;
   		uint end;
   		string hash_video;
   		uint sec_video;
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
