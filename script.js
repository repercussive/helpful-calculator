const buttons = Array.from(document.querySelectorAll(".calculator-button"));
const inputText = document.getElementById("input-screen");
const outputText = document.getElementById("output-screen");
const equalsButton = document.getElementById("equals-button");
const clearButton = document.getElementById("clear-button");
const backspaceButton = document.getElementById("backspace-button");

const tipHideButton = document.getElementById("hide-tip");

let clearOnNextInput = false;
let ans = 0;

let operators = ['×', '÷', '+', '-', '^', '!'];

let isControlPressed = false;

buttons.forEach((button)=> {
    if (button.classList.contains("do-not-append")) return;
    button.addEventListener('click', () => appendInput(button.textContent));
})

clearButton.addEventListener('click', clear);
backspaceButton.addEventListener('click', backspace);
equalsButton.addEventListener('click', calculate);
tipHideButton.addEventListener('click', hideTip);

addEventListener('keydown', handleKeyboardInput);
addEventListener('keyup', handleKeyUp);

function appendInput(input) {
    if (clearOnNextInput) {
        clear();
        clearOnNextInput = false;

        if (operators.includes(input)) {
            inputText.textContent += "Ans";
        }
    }

    if (shouldInsertMultiplication()) {
        inputText.textContent += "×";
    }

    inputText.textContent += input;

    function shouldInsertMultiplication() {
        return (
            // Ex. 3Ans -> 3×Ans
            (input === "Ans" && Number.isInteger(parseInt(getLastCharacterOfInput()))) 
            || 
            // Ex Ans3 -> Ans×3
            (getLastCharacterOfInput() === "s" && (Number.isInteger(parseInt(input)) || input === "Ans"))
        );
    }
}

function calculate() {
    let expression = inputText.textContent;
    expression = expression.replace(/×/g, '*');
    expression = expression.replace(/÷/g, '/');
    expression = expression.replace(/Ans/g, ans.toString());
    expression = expression.replace(/π/g, 'pi');
    expression = expression.replace(/√/g, 'root');
    

    try {
        ans = mexp.eval(expression)
    }
    catch (err) {
        ans = "Error";
    }

    clearOnNextInput = true;

    if (isDivisionByZero(expression)) {
        outputText.textContent = "Undefined (division by 0)";
        return;
    }
    if (ans === "Infinity" || outputText.textContent === "Too big!") {
        outputText.textContent = "Too big!";
        return; 
    }
    
    outputText.textContent = ans;

    
}

function backspace() {
    let charactersToRemove = 1;

    if (getLastCharacterOfInput() === "s") {
        charactersToRemove = 3;
    }

    inputText.textContent = inputText.textContent.substring(0, inputText.textContent.length - charactersToRemove);
}

function clear() {
    inputText.textContent = "";
    outputText.textContent = "";
}

function getLastCharacterOfInput() {
    return inputText.textContent[inputText.textContent.length - 1]
}

function isDivisionByZero(expression) {
    return expression.substring(expression.length - 2) === "/0";
}

function handleKeyboardInput(event) {
     
    let key = event.key;

    document.getElementById(key);

    if (Number.isInteger(parseInt(key)) || operators.includes(key)) {
        appendInput(key);
        return;
    } 

    switch (event.key) {
        case "Control":
            isControlPressed = true;
            break;
        case "Enter":
            calculate();
            break;
        case "Backspace":
            if (isControlPressed) {clear(); hideTip();} else {backspace()}
            break;
        case "*":
            appendInput("×");
            break;
        case "/":
            appendInput("÷");
            break;
        case "a":
            appendInput("Ans");
            break;
        case ".":
            appendInput(".");
            break;
        case "(":
            appendInput("(");
            break;
        case ")":
            appendInput(")");
            break;
        case "p":
            appendInput("π");
            break;
        case "r":
            appendInput("√");
            break;
    }
}

function handleKeyUp(event) {
    if (event.key === "Control")
    {
        isControlPressed = false;
    }
}

function hideTip() {
    document.querySelector(".tip").style.visibility = "hidden";
}

// function highlightButton(button) {
//     button.style.backgroundColor = lightenDarkenColor(getComputedStyle(button).getPropertyValue("background-color"), -20);
// }

// function unHighlightButton(button) {
//     button.style.backgroundColor = lightenDarkenColor(getComputedStyle(button).getPropertyValue("background-color"), 20);
// }

// function lightenDarkenColor(color, amount) {

//     console.log(color);
//     let charArray = color.split("")

//     let RGB = color
//         .substring(charArray.indexOf("(") + 1, charArray.indexOf(")"))
//         .split(",");

//     let newRGB = [];

//     for (let i = 0; i < 3; i++) {
//         let value = parseInt(RGB[i]);
//         newRGB.push((value + amount).toString());
//     }

//     console.log(`rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`);
//     return `rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`;
// }
