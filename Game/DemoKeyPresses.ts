import {Direction} from "./Direction";

export class DemoKeyPresses {
    //                         01234567890123456789012345678901234567890123456789012345678901234567890123456789
    static readonly presses = "ldrdrruluruluuulllllddlllddldlul";

    private _index: number;

    constructor() {
        this._index = 0;
    }

    reset() {
        this._index = 0;
    }

    next(): Direction {
        if (this._index >= DemoKeyPresses.presses.length) {
            throw new Error("Used up all key presses!");
        }

        const t = DemoKeyPresses.presses[this._index++];

        if (t === "u") {
            return Direction.Up;
        }
        if (t === "d") {
            return Direction.Down;
        }
        if (t === "l") {
            return Direction.Left;
        }
        if (t === "r") {
            return Direction.Right;
        }

        throw new Error(`Don't know what direction ${t} is!`);
    }
}