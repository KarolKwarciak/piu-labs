import { randomHsl as generateRandomColor } from './helpers.js';

export class ShapesController {
    #data = {
        items: [],
    };

    #listeners = new Map();

    constructor() {
        const savedData = localStorage.getItem('shapes');
        this.#data.items = savedData ? JSON.parse(savedData) : [];
    }

    getAll() {
        return [...this.#data.items];
    }

    add(type) {
        const newShape = {
            id: crypto.randomUUID(),
            type,
            color: generateRandomColor(),
        };

        this.#data.items.push(newShape);
        this.#persistAndPublish();
    }

    remove(id) {
        this.#data.items = this.#data.items.filter(shape => shape.id !== id);
        this.#persistAndPublish();
    }

    recolor(type) {
        this.#data.items = this.#data.items.map(shape =>
            shape.type === type
                ? { ...shape, color: generateRandomColor() }
                : shape
        );

        this.#persistAndPublish();
    }

    count(type) {
        return this.#data.items.filter(shape => shape.type === type).length;
    }

    subscribe(prop, callback) {
        if (!this.#listeners.has(prop)) {
            this.#listeners.set(prop, new Set());
        }

        this.#listeners.get(prop).add(callback);
        callback(this.#data[prop]);

        return () => this.#listeners.get(prop).delete(callback);
    }

    #publish(prop) {
        const subscribers = this.#listeners.get(prop);
        if (!subscribers) return;

        subscribers.forEach(fn => fn(this.#data[prop]));
    }

    #persistAndPublish() {
        localStorage.setItem('shapes', JSON.stringify(this.#data.items));
        this.#publish('items');
    }
}

export const store = new ShapesController();
