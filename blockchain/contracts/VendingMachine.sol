// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ProductLibrary.sol";

contract VendingMachine {
    address public immutable owner;
    bool private locked;

    // Events
    event FundsAdded(address indexed sender, uint256 amount);
    event ProductPurchased(address indexed buyer, string productId, uint256 price, uint256 timestamp);
    event PurchaseConsumed(address indexed consumer, uint256 purchaseIndex);
    event Withdrawal(address indexed owner, uint256 amount);
    event ProductInitialized(string code, string name, uint256 price, string imageCID);
    event ReentrancyAttempt(address indexed attacker);

    ProductLibrary.Product[] private products;
    mapping(address => uint) private balances;
    ProductLibrary.Purchase[] private purchases;

    string private constant IPFS_REFERENCE = "QmfRFRaboP3M48eexvnQkiwgUDPaPHJiFnDcKcuEuLBbf1/";
    uint256 private constant GWEI_MULTIPLIER = 10**8;
    uint256 private constant SMALL_GWEI_MULTIPLIER = 10**7;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier noReentrant() {
        if (locked) {
            emit ReentrancyAttempt(msg.sender);
        }
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
        initializeProducts();
    }

    function concatIPFSReference(string memory _key) pure private returns (string memory) {
        return string.concat(IPFS_REFERENCE, _key);
    }

    function initializeProducts() private {
        _addProduct("A1", 15 * GWEI_MULTIPLIER, "Lays", "lays.png");
        _addProduct("A2", 175 * SMALL_GWEI_MULTIPLIER, "Coca Cola", "coca-cola.png");
        _addProduct("A3", 15 * GWEI_MULTIPLIER, "Pringles", "pringles.png");
        _addProduct("A4", 175 * SMALL_GWEI_MULTIPLIER, "Water", "water.png");
        _addProduct("A5", 15 * GWEI_MULTIPLIER, "Energy Drink", "red-bull.png");
        _addProduct("B1", 20 * GWEI_MULTIPLIER, "Sandwich", "sandwich.png");
        _addProduct("B2", 175 * SMALL_GWEI_MULTIPLIER, "Oreo", "oreo.png");
        _addProduct("B3", 15 * GWEI_MULTIPLIER, "Sprite", "sprite.png");
        _addProduct("B4", 175 * SMALL_GWEI_MULTIPLIER, "Granola Bar", "granola-bar.png");
        _addProduct("B5", 175 * SMALL_GWEI_MULTIPLIER, "Doritos", "doritos.png");
        _addProduct("C1", 15 * GWEI_MULTIPLIER, "Snicker Bar", "snickers.png");
        _addProduct("C2", 15 * GWEI_MULTIPLIER, "M&Ms", "m&ms.png");
        _addProduct("C3", 125 * SMALL_GWEI_MULTIPLIER, "Bubble Tap Gum", "bubble-tap.png");
        _addProduct("C4", 175 * SMALL_GWEI_MULTIPLIER, "Fruit Nut Bar", "fruit-nut.png");
        _addProduct("C5", 175 * SMALL_GWEI_MULTIPLIER, "Beef Jerky", "beef-jerky.png");
        _addProduct("D1", 125 * SMALL_GWEI_MULTIPLIER, "KitKat Biscuit", "kitkat.png");
        _addProduct("D2", 125 * SMALL_GWEI_MULTIPLIER, "Pop Corn", "popcorn.png");
        _addProduct("D3", 150 * SMALL_GWEI_MULTIPLIER, "Twix Bar", "twix.png");
        _addProduct("D4", 125 * SMALL_GWEI_MULTIPLIER, "Donut", "donut.png");
        _addProduct("D5", 125 * SMALL_GWEI_MULTIPLIER, "Red Apple", "apple.png");
    }

    function _addProduct(string memory code, uint256 price, string memory name, string memory imageKey) private {
        string memory imageCID = concatIPFSReference(imageKey);
        products.push(ProductLibrary.Product(code, price, name, imageCID));
        emit ProductInitialized(code, name, price, imageCID);
    }

    function getProductByCode(string memory _productId) private view returns (ProductLibrary.Product memory) {
        for (uint i = 0; i < products.length; i++) {
            if (keccak256(abi.encodePacked(products[i].code)) == keccak256(abi.encodePacked(_productId))) {
                return products[i]; 
            }
        }
        revert("Product not found");
    }

    function getAllProducts() public view returns (ProductLibrary.Product[] memory) {
        return products;
    }

    function addFunds() public payable {
        require(msg.value > 0, "Missing required amount");
        balances[msg.sender] += msg.value;
        emit FundsAdded(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    
    function purchaseProduct(string memory _productId) public {
        uint productPrice = getProductByCode(_productId).price;
        require(balances[msg.sender] >= productPrice, "Insufficient funds");

        balances[msg.sender] -= productPrice;
        purchases.push(ProductLibrary.Purchase(
            msg.sender, 
            _productId, 
            block.timestamp, 
            ProductLibrary.PurchaseStatus.Available
        ));
        
        emit ProductPurchased(
            msg.sender, 
            _productId, 
            productPrice, 
            block.timestamp
        );
    }

    function getAllPurchases(address _buyer) public view returns (ProductLibrary.PurchaseInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer) {
                count++;
            }
        }

        ProductLibrary.PurchaseInfo[] memory result = new ProductLibrary.PurchaseInfo[](count);
        uint index = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer) {
                ProductLibrary.Product memory product = getProductByCode(purchases[i].productId);
                result[index] = ProductLibrary.PurchaseInfo({
                    id: i,
                    name: product.name,
                    image: product.imageCID,
                    price: product.price,
                    purchaseDate: purchases[i].timestamp,
                    consumed: purchases[i].status == ProductLibrary.PurchaseStatus.Consumed
                });
                index++;
            }
        }
        return result;
    }

    function consumePurchase(uint _purchaseIndex) public {
        require(_purchaseIndex < purchases.length, "Invalid index");
        require(purchases[_purchaseIndex].buyer == msg.sender, "Not your purchase");
        require(purchases[_purchaseIndex].status == ProductLibrary.PurchaseStatus.Available, "Purchase already consumed");

        purchases[_purchaseIndex].status = ProductLibrary.PurchaseStatus.Consumed;
        emit PurchaseConsumed(msg.sender, _purchaseIndex);
    }

    function withdraw() public onlyOwner noReentrant {
        uint amount = balances[msg.sender];
        require(amount > 0, "You do not have any balance.");
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
        emit Withdrawal(msg.sender, amount);
    }

    receive() external payable { 
        addFunds();
    }

    fallback() external payable { 
        addFunds();
    }
}