
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

let currencyUnit = {
  "PENNY": 1.01,
  "NICKEL": 2.05,
  "DIME": 3.1,
  "QUARTER": 4.25,
  "ONE": 90,
  "FIVE": 55,
  "TEN": 20,
  "TWENTY": 60,
  "ONE HUNDRED": 100
};

let currencyValue = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

    

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
  if (cashGiven < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  let amountDue = cashGiven - price;
  const amountBack = giveChange([...cid], amountDue); 

  if (amountDue === 0) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  }

  if (!amountBack) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  if (amountBack && amountBack.length > 0) {
    changeDue.textContent = "Status: OPEN " + amountBack.map(item => `${item[0]}: $${item[1]}`).join(" ");
    return;
  }

  changeDue.textContent = "Status: CLOSED " + cid.map(item => `${item[0]}: $${item[1]}`).join(" ");
};

const giveChange = (cid, amountDue) => {
  const amountBack = [];
  cid.reverse();
  let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0);

  if (totalCid < amountDue) return false;

  cid.forEach(([denom, amount]) => {
    let denomValue = formatCurrency(denom);
    let value = 0;
    while (amountDue >= denomValue && amount > 0) {
      amount -= denomValue;
      amountDue -= denomValue;
      value += denomValue;
      if (amountDue < 0.01) break; 
    }
    if (value > 0) amountBack.push([denom, parseFloat(value.toFixed(2))]);
  });

  if (amountDue > 0) return false; 
  return amountBack;
};

purchaseBtn.addEventListener('click', () => {
  let cashGiven = Number(cash.value);
  checkCash(price, cashGiven, cid);
});