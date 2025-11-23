import { store as shapeController } from './store.js';
import './ui.js';

const btnAddSquare = document.getElementById('addSquare');
const btnAddCircle = document.getElementById('addCircle');
const btnRecolorSquares = document.getElementById('recolorSquares');
const btnRecolorCircles = document.getElementById('recolorCircles');

btnAddSquare.addEventListener('click', () => shapeController.add('square'));
btnAddCircle.addEventListener('click', () => shapeController.add('circle'));

btnRecolorSquares.addEventListener('click', () => shapeController.recolor('square'));
btnRecolorCircles.addEventListener('click', () => shapeController.recolor('circle'));
