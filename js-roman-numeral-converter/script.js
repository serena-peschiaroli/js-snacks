const inputNumber = document.getElementById('number');
const btnConvert = document.getElementById('convert-btn');
const results = document.getElementById('output');

const romanNumbers =  [
    { roman: 'M', arabic: 1000 },
    { roman: 'CM', arabic: 900 },
    { roman: 'D', arabic: 500 },
    { roman: 'CD', arabic: 400 },
    { roman: 'C', arabic: 100 },
    { roman: 'XC', arabic: 90 },
    { roman: 'L', arabic: 50 },
    { roman: 'XL', arabic: 40 },
    { roman: 'X', arabic: 10 },
    { roman: 'IX', arabic: 9 },
    { roman: 'V', arabic: 5 },
    { roman: 'IV', arabic: 4 },
    { roman: 'I', arabic: 1 }
];

const toRoman= (num)=>{
    let romanNumber = "";
    for(let i=0; i<romanNumbers.length; i++){
        while (num >= romanNumbers[i].arabic){
            romanNumber += romanNumbers[i].roman;
            num -= romanNumbers[i].arabic;
        }
    }
    return romanNumber;
}

btnConvert.addEventListener('click', ()=>{
    console.log("click", inputNumber.value)
    if(inputNumber.value === ""|| isNaN(inputNumber.value)){
       results.innerText = "Please enter a valid number";
    }else if (parseInt(inputNumber.value) < 1 ){
       results.innerText ="Please enter a number greater than or equal to 1";
    }else if(parseInt(inputNumber.value) >= 4000 ){
        results.innerText ="Please enter a number less than or equal to 3999";
        
    }else{
        results.innerText= toRoman(parseInt(inputNumber.value));
        console.log(toRoman(parseInt(inputNumber.value)))

    }
})