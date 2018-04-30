import Drawable from './Drawable';

/**
 * @class
 * @classdesc Composite object. Helps to operate with same objects.
 */
export default class Composite<T extends Drawable> {
    /**
     * Contains objects to operate.
     */
    private container: Array<T>

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