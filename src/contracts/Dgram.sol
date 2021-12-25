pragma solidity ^0.5.0;

contract Dgram{
    string public name = "Dgram";

    //store images
    mapping(uint => Image) public images;

    struct Image{
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    //create images
    function uploadImage() public {
        images[1] = Image(1,'abc123', 'Hello Tanku', 0, address(0x0));
    }
}
