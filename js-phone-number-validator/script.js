const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const clearBtn = document.getElementById('clear-btn');
const results = document.getElementById('results-div');

const numberRegex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s-]?(\d{3})[\s-]?(\d{4})$/;

const isValid = (str) => numberRegex.test(str);


checkBtn.addEventListener('click', () => {
    if( userInput.value === ""){
        alert("Please provide a phone number");
    }
    console.log(userInput.value, isValid)

    results.textContent = isValid(userInput.value)
    ? ` Valid US number: ${userInput.value}."`
    : ` Invalid US number: ${userInput.value}."`;

    userInput.value = "";

})

clearBtn.addEventListener('click', () => {

  results.textContent = "";

})