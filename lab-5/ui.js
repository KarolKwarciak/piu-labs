import { store } from './store.js';

const boardArea = document.getElementById('board');
const squaresCounter = document.getElementById('cntSquares');
const circlesCounter = document.getElementById('cntCircles');

const createElementForShape = ({ id, type, color }) => {
    const shapeEl = document.createElement('div');
    shapeEl.className = `shape ${type}`;
    shapeEl.dataset.id = id;
    shapeEl.style.backgroundColor = color;
    return shapeEl;
};

const updateDisplay = (updatedItems) => {
    const currentIds = new Set(
        Array.from(boardArea.children).map(child => child.dataset.id)
    );

    updatedItems.forEach(item => {
        const existingEl = boardArea.querySelector(`[data-id="${item.id}"]`);

        if (!existingEl) {
            boardArea.appendChild(createElementForShape(item));
        } else if (existingEl.style.backgroundColor !== item.color) {
            existingEl.style.backgroundColor = item.color;
        }

        currentIds.delete(item.id);
    });

    currentIds.forEach(id => {
        const toRemove = boardArea.querySelector(`[data-id="${id}"]`);
        if (toRemove) toRemove.remove();
    });

    squaresCounter.textContent = store.count('square');
    circlesCounter.textContent = store.count('circle');
};

boardArea.addEventListener('click', (e) => {
    const clickedShape = e.target.closest('.shape');
    if (clickedShape) store.remove(clickedShape.dataset.id);
});

store.subscribe('items', updateDisplay);
