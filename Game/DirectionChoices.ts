import { Direction } from "./Direction";

export class DirectionChoices {
    lookup: boolean[];
    possibilities: number;

    constructor() {
        this.lookup = new Array<boolean>();
    }

    set(direction: Direction): void {
        this.lookup[direction] = true;
        this.possibilities = this.calcPossibilites();
    }

    unset(direction: Direction): void {
        this.lookup[direction] = false;
        this.possibilities = this.calcPossibilites();
    }

    isSet(direction: Direction): boolean {
        return this.lookup[direction];
    }

    clear(): void {
        this.lookup[Direction.Up] = false;
        this.lookup[Direction.Down] = false;
        this.lookup[Direction.Left] = false;
        this.lookup[Direction.Right] = false;
    }

    private calcPossibilites(): number {
        let count: number = 0;
        if( this.lookup[Direction.Up]) { ++count; }
        if( this.lookup[Direction.Down]) { ++count; }
        if( this.lookup[Direction.Left]) { ++count; }
        if( this.lookup[Direction.Right]) { ++count; }

        return count;
    }
}
