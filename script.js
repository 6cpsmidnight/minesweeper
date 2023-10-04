// Display/UI

import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
} from "./minesweeper.js"

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftTxt = document.querySelector("[data-mine-count]");
const messageTxt = document.querySelector(".subtext");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});
boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftTxt.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0);

    minesLeftTxt.textContent = NUMBER_OF_MINES - markedTilesCount;

    minesLeftTxt.style.color = (minesLeftTxt.textContent < 0) ? "red" : "#BBB";
}

function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture:true });
        boardElement.addEventListener("contextmenu", stopProp, { capture:true });

        messageTxt.textContent = (win) ? "You win!" : "You lose";
        messageTxt.style.color = (win) ? "green" : "red";
    }

    if (win) {

    } else if (lose) {
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile;
                if (tile.mine) revealTile(board, tile);
            });
        });
    }
    
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}