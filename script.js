// custom attribute method
const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]")

const copyMsg = document.querySelector("[data-copyMsg]")

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#Numbers");
const symbolCheck = document.querySelector("#Symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generate-button");

const allCheckBox = document.querySelectorAll("input[type = checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;

let checkCount = 0;

handleSlider();
// set strength = grey at start
setIndicator("#ccc");


// set password length
// only ui work here 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style["boxShadow"] = "0 0 8px #999999";
}

function getRandominteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandominteger(0 , 9);
}
function generateCharactersLower(){
    return String.fromCharCode(getRandominteger(97 , 123));
}

function generateCharactersUpper(){
    return String.fromCharCode(getRandominteger(65 , 91));
}

function generateSymbols(){
    const ranNum = getRandominteger(0 , symbols.length);
    return symbols.charAt(ranNum);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passwordLength >= 6
    )
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }

}

async function copyContent(){
    
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
        copyMsg.style.color = "white";
    
        // to make copy wala span visible
        console.log("message has started printing for active");
        copyMsg.classList.add("active");
        console.log("message has ended printing for active");

        setTimeout(() => {
            copyMsg.classList.remove("active");
            console.log("message has ended printing after active");

        }, 1000);

        console.log("sab khatam");


}

inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value)
    {
        copyContent();
    }
});

function handleCheckBoxObject(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxObject)

})

function shufflepassword(array){
    // fisher yates method

    for(let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i  + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((e1) =>{
        str += e1;
    })

    return str;
}
// generate button important hain
generateBtn.addEventListener('click' , () => {
    // none of the checkbox are selected
    if(checkCount == 0) 
    return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start the journey to find new password
    // console.log("journey started");
    // remove old password
    password = "";

    // lets put thr stuff mentioned by checkboxes
    // if(uppercaseCheck.checked)
    // {
    //     password += generateCharactersUpper();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password += generateCharactersLower();
    // }
    // if(numberCheck.checked)
    // {
    //     password += generateRandomNumber();
    // }
    // if(uppercaseCheck.checked)
    // {
    //     password += generateSymbols();
    // }

    let funArr = [];
    if(uppercaseCheck.checked)
    {
        funArr.push(generateCharactersUpper);
    }
    if(lowercaseCheck.checked)
    {
        funArr.push(generateCharactersLower);
    }
    if(numberCheck.checked)
    {
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked)
    {
        funArr.push(generateSymbols);
    }

    // compusary addition


    for(let i = 0; i < funArr.length; i++)
    {
        password += funArr[i]();
    }
    // console.log("compulsory done");
    // remaining addition

    for(let i = 0; i < passwordLength - funArr.length; i++)
    {
        let randomIndex = getRandominteger(0 , funArr.length);

        password += funArr[randomIndex]();
    }

    // console.log("remaining done");
    // shuffling the password
    password = shufflepassword(Array.from(password));
    // console.log("shuffling  done");

    // show the password
    passwordDisplay.value = password;
    // calculate strenfgth
    calStrength();

});
