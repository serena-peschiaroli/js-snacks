// ottiene il riferimento al contatore delle calorie dal documento HTML
const calorieCounter = document.getElementById('calorie-counter')
// ottiene il riferimento all'input del budget dal documento HTML
const budgetNumberInput = document.getElementById('budget')
// ottiene il riferimento al menu a tendina delle voci dal documento HTML
const entryDropdown = document.getElementById('entry-dropdown')
// ottiene il riferimento al bottone per aggiungere voci dal documento HTML
const addEntryButton = document.getElementById('add-entry')
// ottiene il riferimento al bottone per cancellare tutto dal documento HTML
const clearButton = document.getElementById('clear')
// ottiene il riferimento all'elemento di output dal documento HTML
const output = document.getElementById('output')

// variabile flag per indicare se c'è un errore
let isError = false

// funzione per pulire la stringa di input rimuovendo spazi, segni più e meno
function cleanInputString(str){
    // definisce un'espressione regolare per trovare spazi, segni più e meno
    const regex = /[+-\s]/g
    // sostituisce le corrispondenze dell'espressione regolare con una stringa vuota
    return str.replace(regex, '')
}

// funzione che controlla se l'input è valido verificando la presenza di numeri in formato esponenziale
function isInvalidInput(str){
    // definisce un'espressione regolare per trovare numeri in formato esponenziale
    regex = /\d+e\d+/i
    // restituisce true se trova una corrispondenza, indicando che l'input è invalido
    return str.match(regex)
}

// funzione per aggiungere una nuova voce all'elenco
function addEntry() {
  // ottiene il contenitore dell'input corrispondente al valore selezionato nel menu a tendina
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`)
    // conta quanti input di testo ci sono già nel contenitore
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length
    // crea una stringa HTML per l'etichetta di una nuova voce
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name"> Entry ${entryNumber} Name</label>
    
    `
}
