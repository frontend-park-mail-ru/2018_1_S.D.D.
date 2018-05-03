import Drawable from './Drawable';

/**
 * Initialize composite container.
 * 
 * @class
 * @classdesc Composite object. Helps to operate with same objects.
 */
export default class Composite<T extends Drawable> {
    /**
     * Contains objects to operate.
     */
    private container: Array<T>

    /**
     * Initialize composite container.
     */
    constructor() {
        this.container = [];
    }

    /**
     * Add new object in composite.
     * 
     * @param object Object to add in composite
     * @returns Container with objects.
     */
    public add(object: T): Array<T> {
        this.container.push(object);
        return this.container;
    }

    /**
     * Get object by it's idx.
     * 
     * @param idx ID of object in composite array.
     */
    public item(idx: number): T {
        return this.container[idx];
    }

    /**
     * Returns container with objects.
     * 
     * @returns Containers with objects.
     */
    public get(): Array<T> {
        return this.container;
    }

    /**
     * Clears composite.
     */
    public clear(): void {
        this.container = [];
    }

    /**
     * Draw objects.
     */
    public draw(): void {
        this.container.forEach(object => {
            object.draw();
        });
    }
}