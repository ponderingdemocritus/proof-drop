// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract ProofDropCore {
    mapping(address => uint256) public addressRegistry;

    event AddressRegistration(address l1Address, uint256 starknetAddress);

    function register(uint256 starknetAddress) external payable {
        // Record the starknet address in the registry
        addressRegistry[msg.sender] = starknetAddress;

        // Emit the AddressRegistration event
        emit AddressRegistration(msg.sender, starknetAddress);
    }

    function getMyAddressRegistry() external view returns (uint256) {
        return addressRegistry[msg.sender];
    }

    function getRegisteredStarknetAddress(
        address l1Address
    ) external view returns (uint256) {
        return addressRegistry[l1Address];
    }
}
