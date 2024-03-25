const textInput = document.getElementById('text-input');
const checkBtn = document.getElementById('check-btn');
const results = document.getElementById('result');

checkBtn.addEventListener('click', ()=> {
    if(textInput.value === "") {
        alert('Please enter a value')
    }else{
        const normalizedText = textInput.value.replace(/[\W_]+/g, '').toLowerCase();
        const reversedText = normalizedText.split('').reverse().join('');

        if(reversedText === normalizedText) {
            results.innerText = `${textInput.value} is a palindrome`;

        }else {
            results.innerText = `${textInput.value} is not a palindrome`;
        }

        results.classList.remove('hidden');

    }
})