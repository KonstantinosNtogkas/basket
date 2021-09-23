let items = [["Milk", 2.20], ["Bread", 3.00], ["Honey", 10.00]];
window.onload = addItems();
var alertFlag = 0;

if(localStorage.getItem("basket") != null){
    let basketObj = JSON.parse(localStorage.getItem("basket"));
    for(let key in basketObj){
        addToBasket(parseInt(key), basketObj[key]);
    }
    calculateTotalPrice();
}

function addItems(){
    const itemsDiv = document.getElementById("items");
    for (let i = 0; i < items.length; i++){
        let itemDiv = document.createElement("div");
        itemDiv.id = "item" + i.toString();
        itemDiv.style.display = "flex";
        itemDiv.style.margin = "5px";

        let itemName = document.createElement("p");
        itemName.style.marginRight = "5px";
        let itemNameText = document.createTextNode(items[i][0]);
        itemName.appendChild(itemNameText);
        itemDiv.appendChild(itemName);

        let itemPrice = document.createElement("p");
        itemPrice.style.marginRight = "5px";
        let itemPriceText = document.createTextNode(items[i][1].toFixed(2)+" $");
        itemPrice.appendChild(itemPriceText);
        itemDiv.appendChild(itemPrice);

        let itemButtonAdd = document.createElement("button");
        let itemButtonAddText = document.createTextNode("Add to Basket");
        itemButtonAdd.appendChild(itemButtonAddText);
        itemButtonAdd.setAttribute("onclick",`addToBasket(${i}, 1)`);
        itemDiv.appendChild(itemButtonAdd);

        itemsDiv.appendChild(itemDiv);
    }
}

function addToBasket(itemId, qt){
    const basketDiv = document.getElementById("basket");
    if(!document.getElementById("basket" + itemId.toString())){
        if(localStorage.getItem("basket") == null){
            let basketObj = {};
            basketObj[itemId] = qt;
            localStorage.setItem("basket", JSON.stringify(basketObj));
        }
        else{
            let basketObj = JSON.parse(localStorage.getItem("basket"));
            basketObj[itemId] = qt;
            localStorage.setItem("basket", JSON.stringify(basketObj));
        }

        let itemDiv = document.createElement("div");
        itemDiv.id = "basket" + itemId.toString();
        itemDiv.style.display = "flex";
        itemDiv.style.margin = "5px";

        let itemName = document.createElement("p");
        itemName.style.marginRight = "5px";
        let itemNameText = document.createTextNode(items[itemId][0]);
        itemName.appendChild(itemNameText);
        itemDiv.appendChild(itemName);

        let itemPrice = document.createElement("p");
        itemPrice.style.marginRight = "5px";
        let itemPriceText = document.createTextNode(items[itemId][1].toFixed(2) +" $");
        itemPrice.appendChild(itemPriceText);
        itemDiv.appendChild(itemPrice);

        let itemQuantity = document.createElement("p");
        itemQuantity.style.marginRight = "5px";
        let itemQuantityText = document.createTextNode("Quantity: " + qt);
        itemQuantity.appendChild(itemQuantityText);
        itemDiv.appendChild(itemQuantity);

        let itemButtonPlus = document.createElement("button");
        itemButtonPlus.style.marginRight = "5px";
        let itemButtonPlusText = document.createTextNode("+");
        itemButtonPlus.appendChild(itemButtonPlusText);
        itemButtonPlus.setAttribute("onclick",`updateQuantity(${itemId}, true)`);
        itemDiv.appendChild(itemButtonPlus);

        let itemButtonMinus = document.createElement("button");
        itemButtonMinus.style.marginRight = "5px";
        let itemButtonMinusText = document.createTextNode("-");
        itemButtonMinus.appendChild(itemButtonMinusText);
        itemButtonMinus.setAttribute("onclick",`updateQuantity(${itemId}, false)`);
        itemDiv.appendChild(itemButtonMinus);
        
        let itemPriceOfItems = document.createElement("p");
        itemPriceOfItems.style.marginRight = "5px";
        let itemPriceOfItemsText = document.createTextNode("Price of Items: " + (items[itemId][1] * qt).toFixed(2) +" $")
        itemPriceOfItems.appendChild(itemPriceOfItemsText);
        itemDiv.appendChild(itemPriceOfItems);

        let itemButtonRemove = document.createElement("button");
        itemButtonRemove.style.marginRight = "5px";
        let itemButtonRemoveText = document.createTextNode("Remove");
        itemButtonRemove.appendChild(itemButtonRemoveText);
        itemButtonRemove.setAttribute("onclick",`removeFromBasket(${itemId})`);
        itemDiv.appendChild(itemButtonRemove);

        basketDiv.appendChild(itemDiv);
        calculateTotalPrice();
    }
}

function removeFromBasket(itemId){
    itemDiv = document.getElementById("basket" + itemId.toString());
    itemDiv.remove();
    var basketObj = JSON.parse(localStorage.getItem("basket"));
    delete basketObj[itemId];
    localStorage.setItem("basket", JSON.stringify(basketObj))
    calculateTotalPrice();
}

function updateQuantity(itemId, add){
    var basketObj = JSON.parse(localStorage.getItem("basket"));
    if(add){
        basketObj[itemId] = basketObj[itemId] + 1;
        localStorage.setItem("basket", JSON.stringify(basketObj));
    }
    else{
        basketObj[itemId] = basketObj[itemId] - 1;
        if(!basketObj[itemId]){
            removeFromBasket(itemId);
            return;
        }
        else{
            localStorage.setItem("basket", JSON.stringify(basketObj));
        }
    }
    document.getElementById("basket" + itemId.toString()).childNodes[2].firstChild.nodeValue = "Quantity: " + basketObj[itemId];
    document.getElementById("basket" + itemId.toString()).childNodes[5].firstChild.nodeValue = "Price of Items: " + (basketObj[itemId]*items[itemId][1]).toFixed(2) +" $";
    calculateTotalPrice();
}

function calculateTotalPrice(){
    let basketObj = JSON.parse(localStorage.getItem("basket"));
    let totalPrice = 0;
    for(let key in basketObj){
        totalPrice += basketObj[key]*items[key][1];
    }
    const totalPricePar = document.getElementById("totalPrice");
    if(totalPrice >= 100){
        if(!alertFlag){
            alert("You have a 10% discount on your order!")
            alertFlag = 1;
        }
        let discount = totalPrice * 10 / 100;
        totalPrice = totalPrice * 90 / 100;
        totalPricePar.firstChild.nodeValue = totalPrice.toFixed(2) + " $ (-10% " + discount + "$ )";
    }
    else{
        totalPricePar.firstChild.nodeValue = totalPrice.toFixed(2) + " $";
        alertFlag = 0;
    }
}

function buyItems(){
    if(localStorage.getItem("basket") != null){
        let basketObj = JSON.parse(localStorage.getItem("basket"));
        var basketXML = "<basket>"
        for(let key in basketObj){
            basketXML += `<${key}>${basketObj[key]}</${key}>`
        }
        basketXML += "</basket>"
    }
    console.log(basketXML);
}