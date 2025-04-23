// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "remix_tests.sol"; 
import "../contracts/VendingMachine.sol";

contract TestVendingMachine {
    VendingMachine vendingMachine;
    address owner;
    uint constant INIT_VALUE = 5 ether;

    function beforeAll() public {
        owner = address(this);
        vendingMachine = new VendingMachine();
    }

    function testInitialState() public {
        Assert.equal(vendingMachine.owner(), owner, "Owner mismatch");
        Assert.equal(vendingMachine.getBalance(), 0, "Balance not zero");
    }

    function testProductRetrieval() public {
        ProductLibrary.Product[] memory products = vendingMachine.getAllProducts();
        
        // Verify several sample products
        Assert.equal(products[1].code, "A2", "Product A2 missing");
        Assert.equal(products[1].name, "Coca Cola", "Product name mismatch");
        Assert.equal(products[10].code, "C1", "Product C1 missing");
        Assert.equal(products[10].price, 15 * 10**8, "Product price mismatch");
    }

    /// #value: 5000000000000000000
    function testFundOperations() public payable {
        // Test deposit
        vendingMachine.addFunds{value: INIT_VALUE}();
        Assert.equal(vendingMachine.getBalance(), INIT_VALUE, "Deposit failed");

        // Test purchase
        ProductLibrary.Product[] memory products = vendingMachine.getAllProducts();
        uint initialBalance = vendingMachine.getBalance();
        vendingMachine.purchaseProduct(products[0].code);
        Assert.lesserThan(vendingMachine.getBalance(), initialBalance, "Purchase failed");
    }

    /// #sender: owner
    function testPurchaseConsumption() public {
        // Ensure purchase exists
        if (vendingMachine.getAllPurchases(owner).length == 0) {
            vendingMachine.addFunds{value: 1 ether}();
            vendingMachine.purchaseProduct("A1");
        }

        vendingMachine.consumePurchase(0);
        ProductLibrary.PurchaseInfo[] memory purchases = vendingMachine.getAllPurchases(owner);
        Assert.ok(purchases[0].consumed, "Not consumed");
    }
   
}