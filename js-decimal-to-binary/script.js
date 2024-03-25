// ottiene il riferimento all'input numerico dall'HTML
const numberInput = document.getElementById("number-input");
// ottiene il riferimento al bottone di conversione dall'HTML
const convertBtn = document.getElementById("convert-btn");
// ottiene il riferimento all'elemento per visualizzare il risultato dall'HTML
const result = document.getElementById("result");
// ottiene il riferimento al contenitore per l'animazione dall'HTML
const animationContainer = document.getElementById("animation-container");
// definisce i dati per l'animazione, ogni oggetto rappresenta un frame dell'animazione
const animationData = [
  {
    inputVal: 5,
    marginTop: 300,
    addElDelay: 1000,
    msg: 'decimalToBinary(5) returns "101" + 1 (5 % 2). Then it pops off the stack.',
    showMsgDelay: 15000,
    removeElDelay: 20000,
  },
  {
    inputVal: 2,
    marginTop: -200,
    addElDelay: 1500,
    msg: 'decimalToBinary(2) returns "10" + 0 (2 % 2) and gives that value to the stack below. Then it pops off the stack.',
    showMsgDelay: 10000,
    removeElDelay: 15000,
  },
  {
    inputVal: 1,
    marginTop: -200,
    addElDelay: 2000,
    msg: 'decimalToBinary(1) returns "1" (base case) and gives that value to the stack below. Then it pops off the stack.',
    showMsgDelay: 5000,
    removeElDelay: 10000,
  }
];

// converte un numero decimale in binario ricorsivamente
const decimalToBinary = (input) => {
  if (input === 0 || input === 1) {
    return String(input);
  } else {
    return decimalToBinary(Math.floor(input / 2)) + (input % 2);
  }
};

// mostra l'animazione basata sui dati definiti
const showAnimation = () => {
  result.innerText = "Animazione dello stack di chiamate";

  animationData.forEach((obj) => {
    setTimeout(() => {
      animationContainer.innerHTML += `
        <p id="${obj.inputVal}" style="margin-top: ${obj.marginTop}px;" class="animation-frame">
          decimalToBinary(${obj.inputVal})
        </p>
      `;
    }, obj.addElDelay);

    setTimeout(() => {
      document.getElementById(obj.inputVal).textContent = obj.msg;
    }, obj.showMsgDelay);

    setTimeout(() => {
      document.getElementById(obj.inputVal).remove();
    }, obj.removeElDelay);
  });

  setTimeout(() => {
    result.textContent = decimalToBinary(5);
  }, 20000);
};

// controlla l'input dell'utente e decide se mostrare l'animazione o il risultato della conversione
const checkUserInput = () => {
  const inputInt = parseInt(numberInput.value);

  if (!numberInput.value || isNaN(inputInt)) {
    alert("Inserisci un numero decimale");
    return;
  }

  if (inputInt === 5) {
    showAnimation();
    return;
  }

  result.textContent = decimalToBinary(inputInt);
  numberInput.value = "";
};

// aggiunge un listener per il click sul bottone di conversione
convertBtn.addEventListener("click", checkUserInput);

// aggiunge un listener per la pressione del tasto 'Enter' nell'input numerico
numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});
