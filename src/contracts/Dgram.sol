pragma solidity ^0.5.0;

contract Dgram{
    string public name = "Dgram";

    // store images
    uint public imageCount = 0;
    mapping(uint => Image) public images;

    //event creation
    struct Image{
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    // create images
    function uploadImage(string memory _imgHash, string memory _imgDescription) public {
        
        // make sure image hash exists
        require(bytes(_imgHash).length > 0);
        
        // make sure image description exists
        require(bytes(_imgDescription).length > 0);
        
        // make sure sender address exists
        require(msg.sender!=address(0x0));

        // increment image id
        imageCount ++;

        // add image to contract
        images[imageCount] = Image(imageCount, _imgHash, _imgDescription, 0, msg.sender);

        //emit event 
        emit ImageCreated(imageCount, _imgHash, _imgDescription, 0, msg.sender);
    }

    // tip images
    function tipImageOwner(uint _id) public payable {

        //check if id is valid 
        require(_id > 0 && _id <= imageCount);
        
        // fetch the image
        Image memory _image = images[_id]; //Image is the struct, _image is the variable, images is the mapping 
        
        // fetch the author 
        address payable _author = _image.author;
        
        // pay the author some ether 
        address(_author).transfer(msg.value);
        
        // increment the tip amount 
        _image.tipAmount = _image.tipAmount + msg.value;
        
        // update the image
        images[_id] = _image;

        //emit event 
        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
}
