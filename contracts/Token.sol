// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    address public owner;
    uint256 public decimals = 18;
    // Multiply by 10^18 to get the total Supply in wei, not eth
    uint256 public totalSupply;
    uint256 freeTokenAmount = (500 * (10**decimals));

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function getFreeTokens() public returns(bool success) {
        require(balanceOf[msg.sender] < freeTokenAmount);
        _transfer(owner, msg.sender, freeTokenAmount);
        return true;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);

        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(_to != address(0));
        balanceOf[_from] -= _value;

        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        // the exchange (msg.sender) would call this function to transfer from deployer to receiver
        require(_value <= allowance[_from][msg.sender]);
        // Reset allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;
        
        // Spend tokens
        _transfer(_from, _to, _value);
        return true;
    }
}
