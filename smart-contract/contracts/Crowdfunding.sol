// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(string memory _name, string memory _sym, uint _amount) ERC20(_name,_sym) {
        _mint(msg.sender, _amount*100);
    }
    function transfer(address from,address to,uint amount) external
    {
        _transfer( from, to, amount*100);
    }
}

contract Crowdfunding{
    struct Campaign{
        address owner;
        Token tk;
        string tokenName;
        string tokenSym;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256=>Campaign) public campaigns;

    uint256 public numberOfCampaigns=0;

    function createCampaign(address _owner,string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image, string memory _tkname, string memory _tksym) public returns (uint256){
        Campaign storage campaign=campaigns[numberOfCampaigns];

        require(campaign.deadline<block.timestamp, "The deadline should be a date in future");

        campaign.owner=_owner;
        campaign.title=_title;
        campaign.description=_description;
        campaign.target=_target;
        campaign.deadline=_deadline;
        campaign.amountCollected=0;
        campaign.image=_image;
        campaign.tokenName = _tkname;
        campaign.tokenSym = _tksym;
        
        numberOfCampaigns++;

        campaign.tk = new Token(_tkname,_tksym,_target);
        return numberOfCampaigns-1;
    }

    function donateToCampaign(uint256 _id)public payable{
        uint256 amount=msg.value;
        
        Campaign storage campaign=campaigns[_id];
        require(block.timestamp<=campaign.deadline,"Campign Expired");
        require(campaign.target-campaign.amountCollected>=amount, "Amount exceeds target");
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,)=payable(campaign.owner).call{value:amount}("");
        if(sent){
            campaign.amountCollected=campaign.amountCollected+amount;
            campaign.tk.transfer(address(this),msg.sender,(amount));
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory,uint256[] memory){
        return (campaigns[_id].donators,campaigns[_id].donations);
    }

    function getCampaigns()public view returns (Campaign[] memory){
        Campaign[] memory allCampaigns=new Campaign[](numberOfCampaigns);
        for(uint i=0;i<numberOfCampaigns;i++){
            Campaign storage item=campaigns[i];
            allCampaigns[i]=item;
        }
        return allCampaigns;
    }
}
 