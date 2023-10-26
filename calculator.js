const resultDisplay = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const inputRef = document.querySelector(".input");
const operators = ["+", "-", "*", "/", "%"];
const keyCodeMap = {
    13: '=',
    8: 'delete',
    67: 'C',
    72: 'H'
};
const allowedKeyCodes = [13, 8, 67, 72];
let output = "";
let history = [];
let resultValue = "";

if (localStorage.getItem("history")) {
    history = JSON.parse(localStorage.getItem("history"));
}
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        document.getElementById("prevData").style.display = "none";
        document.getElementById("historyData").style.display = "none";
        calc(e.target.dataset.value);
    });
});
inputRef.addEventListener("keydown", (event) => {
    event.preventDefault();
    const regex = new RegExp(/[^0-9 +\-*?%.()=]/g);
    if (!regex.test(event.key)) {
        calc(event.key)
    } else if (allowedKeyCodes.includes(event.keyCode)) {
        calc(keyCodeMap[event.keyCode])
    }
});
const calc = (value) => {
    if (handleAfterResult(value)) return;
    handleZeroInput(value);
    handleDuplicateOperator(value);

    switch (value) {
        case "=":
            finalCalculation();
            break;
        case "C":
            inputRef.value = "";
            resultDisplay.textContent = "";
            break;
        case "delete":
            inputRef.value = inputRef.value.slice(0, -1);
            break;
        case "H":
            showHistory();
            break;
        case ".":
            handleDuplicateDot();
            break;
        default:
            if (inputRef.value === "" && operators.includes(value)) return;
            inputRef.value += value;
            break;
    }
};

function handleAfterResult(value) {
    if(resultDisplay.innerHTML) {
        if(operators.includes(value)) {
            inputRef.value = resultDisplay.innerHTML + value;
        } else if(['C','H','delete','='].includes(value)) {
            inputRef.value = '';
        } else {
            inputRef.value = value;
        }
        resultDisplay.textContent = "";
        return true;
    }
    return false;
}

function finalCalculation() {
    if (inputRef.value === "") return;
    const lastChar = inputRef.value.slice(-1);
    if (operators.includes(lastChar)) {
        alert("Invalid Expression");
    } else {
        output = eval(inputRef.value.replace(/%/g, "/100"));
        resultDisplay.textContent = output;
        handleHistory(`${inputRef.value}=${output}`);
    }
}

function handleZeroInput(value) {
    if (value == 0 && inputRef.value == 0) {
        inputRef.value = '';
        resultDisplay.textContent = "";
    }
}

function handleDuplicateOperator(value) {
    if ((operators.includes(value) && operators.includes(inputRef.value.slice(-1)))) {
        inputRef.value = inputRef.value.slice(0, -1);
    }
}

function handleDuplicateDot() {
    const lastNumber = inputRef.value.split(/[-+*\/]/).slice(-1)[0];
    inputRef.value = lastNumber.includes(".") ? inputRef.value : `${inputRef.value}.`;
}

function showHistory() {
    document.getElementById("prevData").style.display = "grid";
    document.getElementById("historyData").style.display = "grid";
    const prevData = document.getElementById("prevData");
    prevData.innerHTML = "";

    history.forEach((item) => {
        const para = document.createElement("p");
        para.textContent = item;
        prevData.appendChild(para);
    });
}

function handleHistory(calculationResult) {
    history.push(calculationResult);
    if (history.length > 5) {
        history = history.slice(-5);
    }
    localStorage.setItem("history", JSON.stringify(history));
}
