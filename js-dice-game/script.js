// seleziona tutti i dadi nella pagina
const listOfAllDice = document.querySelectorAll(".die");
// seleziona tutti gli input nelle opzioni di punteggio
const scoreInputs = document.querySelectorAll("#score-options input");
// seleziona tutti gli span nelle opzioni di punteggio
const scoreSpans = document.querySelectorAll("#score-options span");
// seleziona il testo del round corrente
const currentRoundText = document.getElementById("current-round");
// seleziona il testo dei lanci del round corrente
const currentRoundRollsText = document.getElementById("current-round-rolls");
// seleziona il testo del punteggio totale
const totalScoreText = document.getElementById("total-score");
// seleziona la storia dei punteggi
const scoreHistory = document.getElementById("score-history");
// seleziona il bottone per lanciare i dadi
const rollDiceBtn = document.getElementById("roll-dice-btn");
// seleziona il bottone per mantenere il punteggio
const keepScoreBtn = document.getElementById("keep-score-btn");
// seleziona il contenitore delle regole
const rulesContainer = document.querySelector(".rules-container");
// seleziona il bottone delle regole
const rulesBtn = document.getElementById("rules-btn");

// array per i valori dei dadi
let diceValuesArr = [];
// flag per il modale mostrato
let isModalShowing = false;
// punteggio corrente
let score = 0;
// punteggio totale
let totalScore = 0;
// numero del round
let round = 1; 
// numero di lanci
let rolls = 0; 

// funzione per lanciare i dadi
const rollDice = () => {
  diceValuesArr = [];

  // genera 5 numeri casuali per i dadi
  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  };

  // aggiorna il testo di ciascun dado con il suo valore
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

// aggiorna le statistiche di gioco
const updateStats = () => {
  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;
};

// abilita l'opzione di punteggio e aggiorna il suo valore
const updateRadioOption = (optionNode, score) => {
  scoreInputs[optionNode].disabled = false;
  scoreInputs[optionNode].value = score;
  scoreSpans[optionNode].textContent = `, score = ${score}`;
};

// aggiorna il punteggio basato sul valore selezionato e il risultato ottenuto
const updateScore = (selectedValue, achieved) => {
  // somma il valore selezionato al punteggio totale
  totalScore += parseInt(selectedValue);
  // aggiorna il testo del punteggio totale sulla pagina
  totalScoreText.textContent = totalScore;

  // aggiunge alla storia dei punteggi il risultato ottenuto e il valore selezionato
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

// ottiene il numero di dadi con il maggior numero di duplicati
const getHighestDuplicates = (arr) => {
  // oggetto per tenere traccia del conteggio dei dadi
  const counts = {};

  // conta il numero di volte che ogni dado appare
  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  // inizializza il conteggio più alto a 0
  let highestCount = 0;

  // trova il conteggio più alto di dadi duplicati
  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  // somma i valori di tutti i dadi
  const sumOfAllDice = diceValuesArr.reduce((a, b) => a + b, 0);

  // se ci sono 4 o più dadi duplicati, aggiorna l'opzione di punteggio per "4 of a kind"
  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  // se ci sono 3 o più dadi duplicati, aggiorna l'opzione di punteggio per "3 of a kind"
  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  // aggiorna l'opzione di punteggio per la prossima scelta
  updateRadioOption(5, 0);
};


// rileva la presenza di un Full House nell'array dei dadi
const detectFullHouse = (arr) => {
  const counts = {};

  // conta le occorrenze di ogni numero
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  // verifica la presenza di un Tris e di una Coppia
  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  // se esiste un Full House, aggiorna l'opzione di punteggio corrispondente
  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25);
  }

  // prepara per la prossima azione
  updateRadioOption(5, 0);
};

// verifica la presenza di Scale nel lancio dei dadi
const checkForStraights = (arr) => {
  // ordina e rimuove i duplicati dai numeri dei dadi
  const sortedNumbersArr = arr.sort((a, b) => a - b);
  const uniqueNumbersArr = [...new Set(sortedNumbersArr)];
  const uniqueNumbersStr = uniqueNumbersArr.join("");

  // definisce le possibili Scale corte e lunghe
  const smallStraightsArr = ["1234", "2345", "3456"];
  const largeStraightsArr = ["12345", "23456"];

  // verifica e aggiorna il punteggio per Scale corte e lunghe
  if (smallStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(3, 30);
  }

  if (largeStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(4, 40);
  }

  // prepara per la prossima azione
  updateRadioOption(5, 0);
};

// resetta le opzioni dei radio button
const resetRadioOption = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

// resetta il gioco ai valori iniziali
const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  totalScore = 0;
  round = 1;
  rolls = 0;

  // aggiorna i dadi e le statistiche di gioco
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreText.textContent = totalScore;
  scoreHistory.innerHTML = "";
  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;

  // prepara le opzioni per il nuovo gioco
  resetRadioOption();
};

// gestisce il click sul bottone di lancio dei dadi
rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOption();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
checkForStraights(diceValuesArr );
  }
});

// gestisce il click sul bottone delle regole
rulesBtn.addEventListener("click", () => {
  // inverte lo stato di visualizzazione del modale delle regole
  isModalShowing = !isModalShowing;

  // se il modale delle regole è visibile, aggiorna il testo del bottone e mostra le regole
  if (isModalShowing) {
    rulesBtn.textContent = "Hide Rules"; 
    rulesContainer.style.display = "block";
  } else {
    // altrimenti, aggiorna il testo del bottone e nasconde le regole
    rulesBtn.textContent = "Show Rules"; 
    rulesContainer.style.display = "none";
  }
});

// gestisce il click sul bottone per mantenere il punteggio
keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  // itera su tutti i radio button per trovare quello selezionato
  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break; // esce dal ciclo una volta trovato il radio button selezionato
    }
  }

  // se un valore è stato selezionato, aggiorna il punteggio e le statistiche
  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats(); // aggiorna le statistiche di gioco
    resetRadioOption(); // resetta le opzioni dei radio button
    updateScore(selectedValue, achieved); // aggiorna il punteggio
    // se il round supera 6, termina il gioco e mostra il punteggio totale
    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${totalScore}`); 
        resetGame(); // resetta il gioco
      }, 500);
    }
  } else {
    // se nessuna opzione è stata selezionata, invita l'utente a selezionarne una o a lanciare i dadi
    alert("Please select an option or roll the dice"); 
  }
});
