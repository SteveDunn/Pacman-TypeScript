import { GhostNickname } from "../Ghosts/GhostNickname";

export class DotCounter {
    protected _counter: number;

    private _isActive: boolean;
    private _timedOut: boolean;

    constructor(public readonly limit: number) {
        this._isActive = false;
        this._counter = 0;
        this._timedOut = false;
    }

    reset() {
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    increment() {
        if (!this._isActive) {
            throw new Error("Cannot increment a non active counter");
        }
        if (this._counter >= this.limit && this.limit > 0) {
            throw new Error("Cannot increment counter, already at limit.");
        }

        ++this._counter;
    }

    get limitReached() {
        return this._counter === this.limit || this._timedOut;
    }

    get counter() {
        return this._counter;
    }

    setTimedOut() {
        this._timedOut = true;
    }

    get isFinished()  {
        return false;
    }
    
}

export class GlobalDotCounter extends DotCounter {
    private _finished: boolean;
    
    private ghostsThatCanLeave: boolean[];

    constructor(limit = 0) {
        super(limit);
        
        this.ghostsThatCanLeave = [];
    }

    reset() {
        this._finished = false;
        this.ghostsThatCanLeave = [];
        this._counter = 0;        
    }

    // the thing that calls this switches dot counters if all the ghosts are out.
    // this never finishes if Clyde is out the house when the counter reaches 
    // 32 - this mimics the bug in the arcade game
    get isFinished()  {
        return this._finished;
    }

    _nextOneToForceOut?: GhostNickname;
    _lastOneForcedOut?: GhostNickname;




    setTimedOut() {
        if (this._lastOneForcedOut == undefined || this._lastOneForcedOut == GhostNickname.Clyde) {
            this._nextOneToForceOut = GhostNickname.Pinky;
        } else if (this._lastOneForcedOut == GhostNickname.Pinky) {
            this._nextOneToForceOut = GhostNickname.Inky;
        } else if (this._lastOneForcedOut == GhostNickname.Inky) {
            this._nextOneToForceOut = GhostNickname.Clyde;
        }
    }

    canGhostLeave(nickName: GhostNickname): boolean {
        if(this._nextOneToForceOut == nickName) {
            this._nextOneToForceOut = undefined;
            this._lastOneForcedOut = nickName;
            return true;
        }

        if(this.ghostsThatCanLeave[nickName] === true) {
//            return true;
        }

        let canLeave = false;
        
        if (nickName === GhostNickname.Pinky && this.counter === 7) {
            canLeave = true;
        }
        if (nickName === GhostNickname.Inky && this.counter === 17) {
            canLeave = true;
        }
        if (nickName === GhostNickname.Clyde && this.counter === 32) {
            canLeave = true;
            this._finished = this.counter === 32;
        }

        this.ghostsThatCanLeave[nickName] = canLeave;

        return canLeave;
    }
}
