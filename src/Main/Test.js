import React, { useState, useEffect } from "react";
import './lightbox.css'

function Calculator() {
  const [displayValue, setDisplayValue] = useState("0");
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        inputDigit(event.key);
      } else if (event.key === ".") {
        inputDecimal();
      } else if (event.key === "=" || event.key === "Enter") {
        performOperation();
      } else if (event.key === "Backspace") {
        clearDisplay();
      } else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
        setOperator(event.key);
        setFirstValue(parseFloat(displayValue));
        setWaitingForSecondValue(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayValue]);

  const inputDigit = (digit) => {
    if (displayValue === "0" || waitingForSecondValue) {
      setDisplayValue(digit);
      setWaitingForSecondValue(false);
    } else {
      setDisplayValue(displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondValue) {
      setDisplayValue("0.");
      setWaitingForSecondValue(false);
    } else if (displayValue.indexOf(".") === -1) {
      setDisplayValue(displayValue + ".");
    }
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  };

  const performOperation = () => {
    const secondValue = parseFloat(displayValue);

    if (operator === "+") {
      setDisplayValue((firstValue + secondValue).toString());
    } else if (operator === "-") {
      setDisplayValue((firstValue - secondValue).toString());
    } else if (operator === "*") {
      setDisplayValue((firstValue * secondValue).toString());
    } else if (operator === "/") {
      setDisplayValue((firstValue / secondValue).toString());
    }

    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(true);
  };
  return (
    <div className="calculator">
      <div className="output">{displayValue}
      
      </div>
      <button onClick={() => clearDisplay()}>C</button>
      <div className="buttons">
      <button onClick={() => inputDigit("1")}>1</button>
<button onClick={() => inputDigit("2")}>2</button>
<button onClick={() => inputDigit("3")}>3</button>
<button onClick={() => setOperator("+")}>+</button>
<button onClick={() => inputDigit("4")}>4</button>
<button onClick={() => inputDigit("5")}>5</button>
<button onClick={() => inputDigit("6")}>6</button>
<button onClick={() => setOperator("-")}>-</button>
<button onClick={() => inputDigit("7")}>7</button>
<button onClick={() => inputDigit("8")}>8</button>
<button onClick={() => inputDigit("9")}>9</button>
<button onClick={() => setOperator("*")}>*</button>
<button onClick={() => inputDecimal()}>.</button>
<button onClick={() => inputDigit("0")}>0</button>
<button onClick={() => performOperation()}>=</button>
<button onClick={() => setOperator("/")}>/</button>

      </div>
    </div>
  );
  
}

export default Calculator;
