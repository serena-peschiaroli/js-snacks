//oggetto che mappa gli operatori infix + funzioni che eseguono l'operazione corrispondente
const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
}

//valutare espressioni matematiche sotto forma di stringa utilizzando gli operatori definiti in infixToFunction
const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

// processa prioma le operazioni di moltiplicazione e divisione in una stringa

const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
}

//determinare se numero è pari
const isEven = num => num % 2 === 0;
//calcola la somma di un array di numeri
const sum = nums => nums.reduce((acc, el) => acc + el, 0);
//calcola la media 
const average = nums => sum(nums) / nums.length;

//calcolare la mediana
const median = nums => {
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
    ? average([sorted[middle], sorted[middle + 1]])
    : sorted[Math.ceil(middle)];
}

//funzioni da chiamare su array di numeri

const spreadsheetFunctions = {
  "": arg=> arg,
  sum,
  average,
  median,
  even: nums => nums.filter(isEven),
  someeven: nums => nums.some(isEven),
  everyeven: nums => nums.every(isEven),
  firsttwo: nums => nums.slice(0, 2),
  lasttwo: nums => nums.slice(-2),
  has2: nums => nums.includes(2),
  increment: nums => nums.map(num => num + 1),
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  range: nums => range(...nums),
  nodupes: nums => [...new Set(nums).values()]
}

//applica una funzione (definita in spreadsheetFunctions) a una stringa
const applyFunction = str => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = args => args.split(",").map(parseFloat);
  const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
  return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
}

//crea un arrray di numeri in un intervallo specificato
const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);
//crea un array di caratteri in un intervallo specificato
const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

//valuta formule che possono includere riferimenti a celle, intervalli di celle e funzioni definite
const evalFormula = (x, cells) => {
  const idToText = id => cells.find(cell => cell.id === id).value;
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = num => character => idToText(character + num);
  const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num));
  const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2)));
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
}

//eseguito quando la pagina web è completamente carticata
window.onload = () => {
  const container = document.getElementById("container");
  //funzione per creare e aggiungere un'etichetta al container
  const createLabel = (name) => {
    //nuovo elemento div
    const label = document.createElement("div");
    //imposta classe dell'elemento a label
    label.className = "label";
    //imposta il testo della label
    label.textContent = name;
    container.appendChild(label);
  }
  //genera un array di lettere da a - j
  const letters = charRange("A", "J");
  //per ogni lettera crea un'etichetta
  letters.forEach(createLabel);
  //genera numeri da 1 a 99
  range(1, 99).forEach(number => {
    //etichetta x ogni numero
    createLabel(number);
    //per ogni combinazione lettera-numero, crea un'etichetta
    letters.forEach(letter => {
      //nuovo campo input
      const input = document.createElement("input");
      //tipo di input text
      input.type = "text";
      //assegna id univoco
      input.id = letter + number;
      //imposta ariaLabel
      input.ariaLabel = letter + number;
      //associa lanfunzione update a evernto onchange
      input.onchange = update;
      container.appendChild(input);
    })
  })
}
//funzione che gestisce evento onchange
const update = event => {
  const element = event.target;
  //rimuove spazi bianchi dal valore dell'input
  const value = element.value.replace(/\s/g, "");
  //se il valore non include l'id dell'elemento (x evitare circular references) ed inizia con =, è una formula
  if (!value.includes(element.id) && value.startsWith('=')) {
    // valutare la formula escludendo '=' e aggiornare il valore dell'elemento con il risultato.
    element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
  }
}