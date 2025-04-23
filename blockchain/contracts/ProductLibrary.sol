// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ProductLibrary {
    enum PurchaseStatus { Available, Consumed }

    struct Product {
        string code;
        uint256 price; // Price in Gwei
        string name;
        string imageCID;
    }

    struct Purchase {
        address buyer;
        string productId;
        uint timestamp;
        PurchaseStatus status;
    }

    struct ProductPurchase {
        Product product;
        Purchase purchase;
    }

    struct PurchaseInfo {
        uint256 id;
        string name;
        string image;
        uint256 price;
        uint256 purchaseDate;
        bool consumed;
    }
}

