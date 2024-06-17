// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ProofDropCore} from "../src/ProofDropCore.sol";

contract ProofDropCoreTest is Test {
    ProofDropCore public proofDropCore;

    function setUp() public {
        proofDropCore = new ProofDropCore();
    }

    function test_Register() public {
        uint256 starknetAddress = 0x0098765d44582b1c0de43abe75541a7cd862660d1164b195350fba33d29cc3b4;
        proofDropCore.register(starknetAddress);
        assertEq(proofDropCore.getMyAddressRegistry(), starknetAddress);
    }
}
