import { Direction } from "../Game/_exports";

export class DirectionInfo {
    constructor(private _current: Direction, private _next: Direction) {
    }

    get currentDirection(): Direction {
        return this._current;
    }

    get nextDirection(): Direction {
        return this._next;
    }

    update(nextDirection: Direction) {
        this._current = this._next;
        this._next = nextDirection;
    }
}