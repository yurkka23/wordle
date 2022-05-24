import { dictionary } from './dictionary.js';

const btnCheck = document.getElementById('check');
const btnReset = document.getElementById('reset');
btnCheck.classList.add('unactive');
const col = 5;
const row = 6;

const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(row)
        .fill()
        .map(() => Array(col).fill('')),
    currentRow: 0,
    currentCol: 0
};

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;
    container.appendChild(box);
    return box;
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
        if (state.currentCol === col) {
            btnCheck.classList.remove('unactive');
        }else{
            btnCheck.classList.add('unactive');
        }
        updateGrid();
    };
    btnReset.onclick = function(){
        const rand = Math.floor(Math.random() * dictionary.length);
        state.secret = dictionary[rand];
        state.currentCol = 0;
        state.currentRow = 0;
        state.grid = Array(row)
        .fill()
        .map(() => Array(col).fill(''));
        for (let i = 0; i < row; i++) {
            for(let j = 0; j < col; j++){
                const box = document.getElementById(`box${i}${j}`);
                box.classList.remove('right');
                box.classList.remove('wrong');
                box.classList.remove('empty');
                box.classList.add('default');
            }
        }
        //console.log(state.secret);
        updateGrid();
        registerKeyboardEvents();
    }
    btnCheck.onclick = function() {
        if (state.currentCol === col) {
            const word = getCurrentWord();
            if (isWordValid(word)) {
                revealWord(word);
                state.currentRow++;
                state.currentCol = 0;
            } else {
                alert('Not a valid word.');
            }
        }
        registerKeyboardEvents();
    }
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500; // ms

    for (let i = 0; i < col; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        const timeForAnimation = 2;
        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.remove('default');
                box.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.remove('default');
                box.classList.add('wrong');
            } else {
                box.classList.remove('default');
                box.classList.add('empty');
            }
        }, (i + 1) * animation_duration / timeForAnimation);

        box.classList.add('animated');
        box.style.animationDelay = `${i * animation_duration / timeForAnimation}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === col;
    const time_animation = 3;
    setTimeout(() => {
        if (isWinner) {
            alert('Congratulations! You won.');
        } else if (isGameOver) {
            alert('Game over.');
        }
    }, time_animation * animation_duration);
}

function isLetter(key) {
    return key.length === 1 && key.match(/[\u0410-\u044F]||і/i);
}

function addLetter(letter) {
    if (state.currentCol === col){
        return;
    }
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0){
         return;
    }
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    //console.log(state.secret);
    registerKeyboardEvents();
}

startup();