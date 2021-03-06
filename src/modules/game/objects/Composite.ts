import Drawable from './Drawable';

type SearchCallback = (...x: any[]) => any;
type ExecuteCallback = (...x: any[]) => any;

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
    private container: T[];

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
    public add(object: T): T[] {
        this.container.push(object);
        return this.container;
    }

    /**
     * Get object by search callback.
     *
     * @param search Search callback.
     * @returns Founded item.
     */
    public item(search: SearchCallback): T {
        return this.container.find(search);
    }

    /**
     * Execute callback to each item in container.
     *
     * @param execute Callback with action on item.
     */
    public do(execute: ExecuteCallback): void {
        this.container.forEach((item) => {
            execute(item);
        });
    }

    /**
     * Returns container with objects.
     *
     * @returns Containers with objects.
     */
    public get(): T[] {
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
        this.container.forEach((object) => {
            object.draw();
        });
    }
}
