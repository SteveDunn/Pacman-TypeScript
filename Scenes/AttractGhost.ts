import {GhostState, SimpleGhost, GhostNickname } from "../Ghosts/_exports";
import {Direction} from "../Game/_exports";

export class AttractGhost extends SimpleGhost {
    private _alive: boolean;

    constructor(public readonly nickName: GhostNickname, _direction: Direction) {
        super(nickName, _direction);
        this._alive = true;
    }

    setFrightened() {
        this._state = GhostState.Frightened;
    }

    get alive() {
        return this._alive;
    }

    set alive(value: boolean) {
        this._alive = value;
    }
}