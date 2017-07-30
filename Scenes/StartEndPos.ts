import {Point} from "../Core/_exports";

export class StartEndPos {
    constructor(public readonly start: Point, public readonly end: Point) {
    }

    reverse(): StartEndPos {
        return new StartEndPos(this.end, this.start);
    }
}