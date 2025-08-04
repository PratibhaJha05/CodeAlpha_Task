const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';

function updateDisplay() {
  display.value = currentInput;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    if (value === 'C') {
      currentInput = '';
    } else if (value === 'Back') {
      currentInput = currentInput.slice(0, -1);
    } else if (value === '=') {
      try {
        currentInput = eval(currentInput).toString();
      } catch {
        currentInput = 'Error';
      }
    } else {
      currentInput += value;
    }

    updateDisplay();
  });
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
    currentInput += key;
  } else if (key === 'Enter') {
    try {
      currentInput = eval(currentInput).toString();
    } catch {
      currentInput = 'Error';
    }
  } else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
  } else if (key === 'Escape') {
    currentInput = '';
  }

  updateDisplay();
});
