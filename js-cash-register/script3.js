
const cash = document.getElementById('cash');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDue = document.getElementById('change-due');
const priceScreen = document.getElementById('price-screen');
let price =19.50;
priceScreen.textContent =`$${ price}`;


let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const cidValues = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100] 
    

const formatCurrency = (name) =>{
    switch (name) {
        case "ONE HUNDRED": return "Hundreds";
        case "TWENTY": return "Twenties";
        case "TEN": return "Tens";
        case "FIVE": return "Fives";
        case "ONE": return "Ones";
        case "QUARTER": return "Quarters";
        case "DIME": return "Dimes";
        case "NICKEL": return "Nickels";
        case "PENNY": return "Pennies";
        default: return name; 
    }

   
    
}

 cid.forEach((item) =>{
    const currencyName = formatCurrency(item[0]);
    const value = item[1];

    const pElement = document.createElement('p');
    pElement.textContent = `${currencyName} : $${value}`;

    cashDrawerDisplay.appendChild(pElement);
});

const checkCash = (price, cashGiven, cid) => {
    let amountDue = cashGiven - price;
    amountDue = Number(amountDue.toFixed(2));
    console.log("amount due:", amountDue);
    const amountBack = giveChange(cid, amountDue);
    const balance = () => {
        let money = 0; 
        for (let denom of cid) {
            money += denom[1];
        }
        return Number(money.toFixed(2));
        
    };
    console.log("Balance:", balance());

    if (amountDue === 0) {
         updateCashDrawerDisplay(cid)
        changeDue.innerHTML = "No change due - customer paid with exact cash";
        return; 
    }

    if (amountDue > balance() || amountBack == false) {
         updateCashDrawerDisplay(cid)
        console.log("status: INSUFFICIENTS_FUNDS");
        changeDue.innerHTML = '';
        const pElement = document.createElement('p');
        pElement.textContent = "Status: INSUFFICIENT_FUNDS";
        changeDue.appendChild(pElement);
        return;
    }else if(balance() === 0){
        console.log("status: CLOSED");
        const pElement = document.createElement('p');
        pElement.textContent = "Status: CLOSED";
        changeDue.appendChild(pElement);
        amountBack.forEach((item) =>{
            const currName = item[0];
            const currValue = item[1]

            const cashDuePElem = document.createElement('p');
            cashDuePElem.textContent = `${currName}: $${currValue}`;
            changeDue.appendChild(cashDuePElem)
        })
        return;

    }else{
         updateCashDrawerDisplay(cid)
        // const amountBack = giveChange(cid, amountDue);
        console.log(amountBack, "amount back")
        
            updateCashDrawerDisplay(cid)
            changeDue.innerHTML = '';
            const statusElement = document.createElement('p');
            statusElement.textContent = "Status: OPEN";
            changeDue.appendChild(statusElement);
            amountBack.forEach((item) =>{
                const currName = item[0];
                const currValue = item[1]

                const cashDuePElem = document.createElement('p');
                cashDuePElem.textContent = `${currName}: $${currValue}`;
                changeDue.appendChild(cashDuePElem)

                    

            }) 
            console.log("status: OPEN");
        
        }
      
       
};

const giveChange = (cid, amountDue) => {
    const amountBack = [];

    amountDue = Math.round(amountDue * 100);

    for (let i = cidValues.length - 1; i >= 0; i--) {
        let denomName = cid[i][0];
        let denomValue = Math.round(cidValues[i] * 100);;
        let denomAmount = Math.round(cid[i][1] * 100);
        let amountFromDenom = 0;

        while (amountDue >= denomValue && denomAmount > 0) {
           denomAmount -= denomValue; 
            amountDue -= denomValue; 
            amountFromDenom += denomValue;
        }
        if (amountFromDenom > 0) {
            amountBack.push([denomName, amountFromDenom / 100]);
            cid[i][1] = denomAmount  / 100;
            console.log("cid", cid);
        }
    }

    if (amountDue > 0) {
       
        return false;
    } else {
        
        return amountBack;

        
    }
   
};

function updateCashDrawerDisplay(cid) {
   
    cashDrawerDisplay.innerHTML = '';
    cid.forEach((item) => {
        const currencyName = formatCurrency(item[0]); 
        const value = item[1]; 
        const pElement = document.createElement('p');
        pElement.textContent = `${currencyName} : $${value.toFixed(2)}`; 
        
        cashDrawerDisplay.appendChild(pElement);
    });
}

purchaseBtn.addEventListener('click', () => {
    console.log("cash given:",cash.value);
    let cashGiven =Number(cash.value);
    checkCash(price, cashGiven, cid);
    if(cashGiven < price){
        alert("Customer does not have enough money to purchase the item")
    }

    
    
});


