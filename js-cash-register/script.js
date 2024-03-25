
// ottiene il riferimento al campo di input per l'importo in contanti
const cash = document.getElementById('cash');
// ottiene il riferimento all'elemento che visualizza il contenuto del cassetto dei contanti
const cashDrawerDisplay = document.getElementById('cash-drawer-display');
// ottiene il riferimento al pulsante di acquisto
const purchaseBtn = document.getElementById('purchase-btn');
// ottiene il riferimento all'elemento che mostra il resto dovuto
const changeDue = document.getElementById('change-due');
// ottiene il riferimento all'elemento che mostra il prezzo sullo schermo
const priceScreen = document.getElementById('price-screen');
// imposta il prezzo iniziale e lo visualizza sullo schermo
let price = 19.50;
priceScreen.textContent = `$${price}`;

// definisce il contenuto iniziale del cassetto dei contanti
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

// array con i valori nominali delle monete e banconote
const cidValues = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100];
    
// funzione per formattare il nome della valuta
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
// aggiunge al display ogni valuta presente nel cassetto dei contanti
 cid.forEach((item) =>{
    const currencyName = formatCurrency(item[0]);
    const value = item[1];

    const pElement = document.createElement('p');
    pElement.textContent = `${currencyName} : $${value}`;

    cashDrawerDisplay.appendChild(pElement);
});
// la funzione principale che gestisce il processo di pagamento
const checkCash = (price, cashGiven, cid) => {
    // calcola il resto dovuto e aggiusta la precisione numerica
    let amountDue = cashGiven - price;
    amountDue = Number(amountDue.toFixed(2));
    console.log("amount due:", amountDue);
    const amountBack = giveChange([...cid], amountDue);
    // calcola il totale disponibile nel cassetto dei contanti
    const balance = () => Number(cid.reduce((sum, denom) => sum + denom[1], 0).toFixed(2));
        
    console.log("Balance:", balance());
    console.log(amountBack, "amount back")
 // logica per gestire diversi scenari in base al resto dovuto e al totale disponibile
    if (amountDue === 0) {
         updateCashDrawerDisplay(cid)
        changeDue.innerHTML = "No change due - customer paid with exact cash";
        return; 
    }

    if (amountDue > balance() || amountBack.length == 0) {
        if(balance() == 0 && amountBack.length >= 1){
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

        }
        if(amountBack.length == 0){
            updateCashDrawerDisplay(cid)
            console.log("status: INSUFFICIENTS_FUNDS");
            changeDue.innerHTML = '';
            const pElement = document.createElement('p');
            pElement.textContent = "Status: INSUFFICIENT_FUNDS";
            changeDue.appendChild(pElement);
        }

         
        return;
    }
    
    

         updateCashDrawerDisplay(cid)
      
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
    

};


const giveChange = (cid, amountDue) => {
    // array vuoto per tenere traccia delle denominazioni e delle quantità utilizzate per il resto
    const amountBack = [];
    
    // conversione 'amountDue' in centesimi per evitare problemi di floating point.
    amountDue = Math.round(amountDue * 100);

    // itera l'array delle denominazioni dal più grande al più piccolo
    for (let i = cidValues.length - 1; i >= 0; i--) {
        // assegna il nome della denominazione corrente e il suo valore in centesimi
        let denomName = cid[i][0];
        let denomValue = Math.round(cidValues[i] * 100);
        // calcola il totale disponibile per la denominazione corrente in centesimi
        let denomAmount = Math.round(cid[i][1] * 100);
        // inizializza una variabile per tenere traccia di quanto di quella denominazione viene usato
        let amountFromDenom = 0;

        // sottrarre il valore della denominazione da finché è possibile 
        while (amountDue >= denomValue && denomAmount > 0) {
           // decrementa
           denomAmount -= denomValue; 
           amountDue -= denomValue; 
           // aggiunge 'denomValue' ad 'amountFromDenom' per tenere traccia di quanto è stato usato.
           amountFromDenom += denomValue;
        }
        // se 'amountFromDenom' è maggiore di 0, significa che quella denominazione è stata utilizzata per il resto.
        if (amountFromDenom > 0) {
            // aggiunge al 'amountBack' il nome della denominazione e l'importo utilizzato convertito in dollari.
            amountBack.push([denomName, amountFromDenom / 100]);
            // aggiorna l'array 'cid' con il nuovo totale rimasto per quella denominazione.
            cid[i][1] = denomAmount / 100;
            
            console.log("cid", cid);
        }
    }

    // Se dopo aver esaurito tutte le denominazioni 'amountDue' è ancora maggiore di 0, significa che non è possibile restituire il resto esatto.
    if (amountDue > 0) {
        // restituisce un array vuoto 
        return [];
    } else {
        // altrimenti, restituisce l'array 'amountBack'
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
// gestisce il click sul pulsante di acquisto
purchaseBtn.addEventListener('click', () => {
    console.log("cash given:",cash.value);
     // logica per gestire l'acquisto, inclusa la verifica se il cliente ha abbastanza denaro
    let cashGiven = Number(cash.value);
    checkCash(price, cashGiven, cid);
    if(cashGiven < price){
        alert("Customer does not have enough money to purchase the item")
    }

    
    
});


