import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function Display({ value, message }) {
  return (
    <div className="display-wrap">
      <output className="calculator-display" aria-live="polite" aria-atomic="true">
        {value}
      </output>
      <p className="display-message" role="status">{message || " "}</p>
    </div>
  );
}

function Button({ label, kind = "number", wide = false, onClick }) {
  return (
    <button
      className={`calculator-button button-${kind}${wide ? " button-wide" : ""}`}
      type="button"
      onClick={onClick}
      aria-label={label === "÷" ? "Chia" : label === "×" ? "Nhân" : label}
    >
      {label}
    </button>
  );
}

function evaluateExpression(expression) {
  const input = expression.replace(/\s/g, "");
  const tokens = input.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+\-]?\d+)?|[+\-*/]/g);

  if (!tokens || tokens.join("") !== input) {
    throw new SyntaxError("Biểu thức không hợp lệ");
  }

  let position = 0;

  function parseValue() {
    let sign = 1;
    while (tokens[position] === "+" || tokens[position] === "-") {
      if (tokens[position] === "-") sign *= -1;
      position += 1;
    }

    const token = tokens[position];
    if (
      token === undefined ||
      !/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+\-]?\d+)?$/.test(token)
    ) {
      throw new SyntaxError("Biểu thức không hợp lệ");
    }
    position += 1;

    const value = sign * Number(token);
    if (!Number.isFinite(value)) {
      throw new RangeError("Kết quả vượt quá giới hạn");
    }
    return value;
  }

  function parseTerm() {
    let value = parseValue();
    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position];
      position += 1;
      const nextValue = parseValue();

      if (operator === "/" && nextValue === 0) {
        throw new RangeError("Không thể chia cho 0");
      }
      value = operator === "*" ? value * nextValue : value / nextValue;
      if (!Number.isFinite(value)) {
        throw new RangeError("Kết quả vượt quá giới hạn");
      }
    }
    return value;
  }

  function parseSum() {
    let value = parseTerm();
    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position];
      position += 1;
      const nextValue = parseTerm();
      value = operator === "+" ? value + nextValue : value - nextValue;
      if (!Number.isFinite(value)) {
        throw new RangeError("Kết quả vượt quá giới hạn");
      }
    }
    return value;
  }

  const result = parseSum();
  if (position !== tokens.length) {
    throw new SyntaxError("Biểu thức không hợp lệ");
  }

  if (Object.is(result, -0)) return "0";
  return Number(result.toPrecision(12)).toString();
}

function Calculator() {
  const [expression, setExpression] = useState("0");
  const [justCalculated, setJustCalculated] = useState(false);
  const [message, setMessage] = useState("");

  function enterDigit(digit) {
    setMessage("");
    setExpression((current) => {
      if (justCalculated || current === "0") return digit;
      return current + digit;
    });
    setJustCalculated(false);
  }

  function enterDecimal() {
    setMessage("");
    if (justCalculated) {
      setExpression("0.");
      setJustCalculated(false);
      return;
    }

    setExpression((current) => {
      const currentNumber = current.split(/[+\-*/]/).pop() || "";
      if (currentNumber.includes(".")) return current;
      if (/[+\-*/]$/.test(current)) return `${current}0.`;
      return `${current}.`;
    });
  }

  function enterOperator(operator) {
    setMessage("");
    setJustCalculated(false);
    setExpression((current) => {
      if (/[+\-*/]$/.test(current)) {
        if (operator === "-" && !current.endsWith("-")) return current + operator;
        return current.replace(/[+\-*/]+$/, "") + operator;
      }
      return current + operator;
    });
  }

  function deleteLast() {
    setMessage("");
    setJustCalculated(false);
    setExpression((current) => {
      if (justCalculated) return "0";
      const next = current.slice(0, -1);
      return next && next !== "-" ? next : "0";
    });
  }

  function clear() {
    setExpression("0");
    setJustCalculated(false);
    setMessage("");
  }

  function calculate() {
    try {
      const result = evaluateExpression(expression);
      setExpression(result);
      setJustCalculated(true);
      setMessage("");
    } catch (error) {
      if (error instanceof SyntaxError || error instanceof RangeError) {
        setMessage(error.message);
        setJustCalculated(false);
        return;
      }
      throw error;
    }
  }

  const buttons = [
    { label: "Clear", kind: "action", wide: true, onClick: clear },
    { label: "Delete", kind: "action", onClick: deleteLast },
    { label: "÷", kind: "operator", onClick: () => enterOperator("/") },
    { label: "7", onClick: () => enterDigit("7") },
    { label: "8", onClick: () => enterDigit("8") },
    { label: "9", onClick: () => enterDigit("9") },
    { label: "×", kind: "operator", onClick: () => enterOperator("*") },
    { label: "4", onClick: () => enterDigit("4") },
    { label: "5", onClick: () => enterDigit("5") },
    { label: "6", onClick: () => enterDigit("6") },
    { label: "−", kind: "operator", onClick: () => enterOperator("-") },
    { label: "1", onClick: () => enterDigit("1") },
    { label: "2", onClick: () => enterDigit("2") },
    { label: "3", onClick: () => enterDigit("3") },
    { label: "+", kind: "operator", onClick: () => enterOperator("+") },
    { label: "0", wide: true, onClick: () => enterDigit("0") },
    { label: ".", kind: "operator", onClick: enterDecimal },
    { label: "=", kind: "equals", onClick: calculate },
  ];

  return (
    <main className="calculator-page">
      <a className="back-link" href="index.html">← CV cá nhân</a>
      <section className="calculator-card" aria-labelledby="calculator-title">
        <header className="calculator-heading">
          <p className="calculator-kicker">BÀI THỰC HÀNH REACT</p>
          <h1 id="calculator-title">Virtual Calculator</h1>

        </header>
        <Display value={expression} message={message} />
        <div className="calculator-grid">
          {buttons.map((button) => (
            <Button key={button.label} {...button} />
          ))}
        </div>

      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<Calculator />);
