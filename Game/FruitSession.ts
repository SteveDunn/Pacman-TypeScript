import { FruitItem } from "./FruitItem";

export class FruitSession {
    private _toShowAt: number;
    private _counter: number;
    private _shouldShow: boolean;

    constructor(public readonly fruitItem: FruitItem, public readonly points: number) {
        this._toShowAt = 70;
        this._counter = 0;
    }

    get nextPillToShowAt(): number {
        return this._toShowAt;
    }

    get shouldShow(): boolean {
        return this._shouldShow;
    }

    pillEaten() {
        if (++this._counter === this._toShowAt) {
            this._shouldShow = true;
            if (this._toShowAt === 70) {
                this._toShowAt = 170;
            } else {
                this._toShowAt = -1;
            }
        } else {
            this._shouldShow = false;
        }
    }

    fruitEaten() {
        this._shouldShow = false;
    }
}