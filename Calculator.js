let display = document.getElementById('display');
let displayTop = document.getElementById('display-top');
let currentInput = '0';
let expression = '';
let hasOperator = false;
let lastWasOperator = false;
let justCalculated = false;


document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    displayTop = document.getElementById('display-top');
    updateDisplay();
    addKeyboardSupport();
    addButtonEffects();
});


function updateDisplay() {
    display.textContent = currentInput;
    displayTop.textContent = expression;
}


function pressNum(num) {
    if (justCalculated) {
        expression = '';
        currentInput = '0';
        justCalculated = false;
    }

    if (currentInput === '0' || lastWasOperator) {
        currentInput = num;
    } else {
        currentInput += num;
    }
    
    if (lastWasOperator || expression === '') {
        expression += num;
    } else {
        expression += num;
    }
    
    lastWasOperator = false;
    
    if (hasOperator) {
        const liveResult = calculateExpression(expression, false);
        if (liveResult !== null) {
            display.textContent = liveResult;
            displayTop.textContent = expression;
            return;
        }
    }
    
    updateDisplay();
}

function pressDecimal() {
    if (justCalculated) {
        expression = '';
        currentInput = '0';
        justCalculated = false;
    }

    if (lastWasOperator) {
        currentInput = '0.';
        expression += '0.';
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
        expression += '.';
    }
    
    lastWasOperator = false;
    updateDisplay();
}

function pressOperator(operator) {
    if (justCalculated) {
        expression = currentInput + operator;
        justCalculated = false;
    } else if (lastWasOperator) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }
    
    hasOperator = true;
    lastWasOperator = true;
    
    const liveResult = calculateExpression(expression.slice(0, -1), false);
    if (liveResult !== null) {
        currentInput = liveResult.toString();
    }
    
    updateDisplay();
}

function pressEquals() {
    if (expression && !lastWasOperator) {
        const result = calculateExpression(expression, true);
        if (result !== null) {
            currentInput = result.toString();
            expression = expression + ' = ' + result;
            displayTop.textContent = expression;
            display.textContent = result;
            
            justCalculated = true;
            hasOperator = false;
            lastWasOperator = false;
            
            return;
        }
    }
    updateDisplay();
}

function calculateExpression(expr, useMDAS) {
    try {
        if (useMDAS) {
            return eval(expr);
        } else {
            return evaluateLeftToRight(expr);
        }
    } catch (error) {
        return null;
    }
}

function evaluateLeftToRight(expr) {
    try {
        expr = expr.replace(/[+\-*/]+$/, '');
        
        const tokens = expr.match(/(\d+\.?\d*|[+\-*/])/g);
        if (!tokens || tokens.length < 3) return null;
        
        let result = parseFloat(tokens[0]);
        
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const operand = parseFloat(tokens[i + 1]);
            
            if (isNaN(operand)) break;
            
            switch (operator) {
                case '+':
                    result += operand;
                    break;
                case '-':
                    result -= operand;
                    break;
                case '*':
                    result *= operand;
                    break;
                case '/':
                    if (operand === 0) return null;
                    result /= operand;
                    break;
            }
        }
        
        return Math.round((result + Number.EPSILON) * 1000000000) / 1000000000;
    } catch (error) {
        return null;
    }
}

function clearCalculator() {
    currentInput = '0';
    expression = '';
    hasOperator = false;
    lastWasOperator = false;
    justCalculated = false;
    updateDisplay();
}

function addKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if (['/', 'Enter', '*'].includes(key)) {
            event.preventDefault();
        }
        
        if (key >= '0' && key <= '9') {
            pressNum(key);
        } else if (key === '.') {
            pressDecimal();
        } else if (key === '+') {
            pressOperator('+');
        } else if (key === '-') {
            pressOperator('-');
        } else if (key === '*') {
            pressOperator('*');
        } else if (key === '/') {
            pressOperator('/');
        } else if (key === 'Enter' || key === '=') {
            pressEquals();
        } else if (key === 'Escape') {
            clearCalculator();
        }
    });
}

function addButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

console.log('Dual Display Calculator loaded!');
console.log('Top display: Shows expression');
console.log('Bottom display: Shows live calculation (left-to-right) or MDAS result after equals');