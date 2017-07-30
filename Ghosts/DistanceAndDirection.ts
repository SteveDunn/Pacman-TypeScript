import {Direction} from "../Game/_exports";

export class DistanceAndDirection {
    constructor(
        public readonly distance: number,
        public readonly roundedDistance: number,
        public readonly direction: Direction) {
    }
}