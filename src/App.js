import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      
      // Números y punto decimal
      if (/^[0-9]$/.test(key)) {
        inputDigit(parseInt(key));
      } else if (key === '.') {
        inputDecimal();
      }
      
      // Operadores
      switch (key) {
        case '+':
          handleOperator('+');
          break;
        case '-':
          handleOperator('-');
          break;
        case '*':
          handleOperator('×');
          break;
        case '/':
          event.preventDefault(); // Prevenir el quick find en Firefox
          handleOperator('÷');
          break;
        case 'Enter':
        case '=':
          handleEquals();
          break;
        case 'Backspace':
          handleBackspace();
          break;
        case 'Escape':
          clearDisplay();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [display, waitingForOperand, operator, prevValue]);

  // Nueva función para manejar el retroceso
  const handleBackspace = () => {
    if (waitingForOperand) return;
    
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);
    const previousValue = prevValue;

    switch (operator) {
      case '+': return previousValue + inputValue;
      case '-': return previousValue - inputValue;
      case '×': return previousValue * inputValue;
      case '÷': return previousValue / inputValue;
      default: return inputValue;
    }
  };

  const handleEquals = () => {
    if (!operator) return;
    
    const result = performCalculation();
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="keypad">
        <button className="key function" onClick={clearDisplay}>AC</button>
        <button className="key function">±</button>
        <button className="key function">%</button>
        <button className="key operator" onClick={() => handleOperator('÷')}>÷</button>

        <button className="key number" onClick={() => inputDigit(7)}>7</button>
        <button className="key number" onClick={() => inputDigit(8)}>8</button>
        <button className="key number" onClick={() => inputDigit(9)}>9</button>
        <button className="key operator" onClick={() => handleOperator('×')}>×</button>

        <button className="key number" onClick={() => inputDigit(4)}>4</button>
        <button className="key number" onClick={() => inputDigit(5)}>5</button>
        <button className="key number" onClick={() => inputDigit(6)}>6</button>
        <button className="key operator" onClick={() => handleOperator('-')}>-</button>

        <button className="key number" onClick={() => inputDigit(1)}>1</button>
        <button className="key number" onClick={() => inputDigit(2)}>2</button>
        <button className="key number" onClick={() => inputDigit(3)}>3</button>
        <button className="key operator" onClick={() => handleOperator('+')}>+</button>

        <button className="key number zero" onClick={() => inputDigit(0)}>0</button>
        <button className="key number" onClick={inputDecimal}>.</button>
        <button className="key operator" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default App;
