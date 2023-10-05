// Display/UI

import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
} from "./minesweeper.js"

const messageTxt = document.querySelector(".subtext");

const selBoardSizeEl = document.getElementById("selBoardSize");
const selNumberOfMinesEl = document.getElementById("selNumberOfMines");

const BOARD_SIZE = (sessionStorage.getItem("BOARD_SIZE") === null) ? 5 : sessionStorage.getItem("BOARD_SIZE");
const NUMBER_OF_MINES = (sessionStorage.getItem("NUMBER_OF_MINES") === null) ? 5 : sessionStorage.getItem("NUMBER_OF_MINES");

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftTxt = document.querySelector("[data-mine-count]");

selBoardSizeEl.value = BOARD_SIZE;
selNumberOfMinesEl.value = NUMBER_OF_MINES;

selBoardSizeEl.addEventListener("change", () => {
    sessionStorage.setItem("BOARD_SIZE", selBoardSizeEl.value);
    location.reload();
}, false);

selNumberOfMinesEl.addEventListener("change", () => {
    sessionStorage.setItem("NUMBER_OF_MINES", selNumberOfMinesEl.value);
    location.reload();
}, false);

let mineRevealDelay = 0;

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        }, false);
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        }, false);
    });
});

boardElement.style.setProperty("--size", BOARD_SIZE);
boardElement.style.setProperty("--length", (400 / BOARD_SIZE) + "px");
boardElement.style.fontSize = (400 / BOARD_SIZE) + "px";
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
        boardElement.addEventListener("click", stopProp, {
            capture: true
        }, false);
        boardElement.addEventListener("contextmenu", stopProp, {
            capture: true
        }, false);

        messageTxt.textContent = (win) ? "You win!" : "You lose";
        messageTxt.style.color = (win) ? "green" : "red";
        messageTxt.classList.add("scale-1");
        setTimeout(() => {
            messageTxt.classList.remove("scale-1");
        }, 1000);
    }

    if (win) {

    } else if (lose) {
        board.forEach(row => {
            row.forEach(tile => {
                mineRevealDelay++;
                setTimeout(() => {
                    if (tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile;
                    if (tile.mine) revealTile(board, tile);
                }, mineRevealDelay * 15);
            });
        });
    }

}

function stopProp(e) {
    e.stopImmediatePropagation();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}