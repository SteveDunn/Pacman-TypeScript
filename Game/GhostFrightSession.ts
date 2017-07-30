import { LoopingTimer, GameContext } from "../Core/_exports";

import { LevelProps } from "./LevelProps";

export class GhostFrightSession {
    private readonly eachFlashDurationMs: number = 166;

    private _amountOfGhostsEaten: number;
    private _timeLeft: number;
    //1s = 1000ms
    //1/60th second = 16.66ms
    //1 frame = 16.66ms
    //each flash takes 1/6th of a second (or 10 frames), 166ms
    //so there can be 6 flashes a second
    private _flashesLeft: number;
    private _timeLeftToStartFlashing: number;
    private _tickTock: boolean;
    private _timer: LoopingTimer;
    
    constructor(levelProps: LevelProps) {
        this._amountOfGhostsEaten = 0;
        this._timeLeft = levelProps.frightGhostTime * 1000;
        this._flashesLeft = levelProps.frightGhostFlashes;

        this._timeLeftToStartFlashing = this._timeLeft - (this._flashesLeft*this.eachFlashDurationMs);
        this._timer = new LoopingTimer(this.eachFlashDurationMs, ()=>this._tickTock = !this._tickTock);
    }

    update(context: GameContext) {
        this._timer.run(context.elapsed);
        this._timeLeft -= context.elapsed;
        this._timeLeftToStartFlashing -= context.elapsed;
    }

    get ghostsEaten(): number {
        return this._amountOfGhostsEaten;
    }

    get isWhite(): boolean {
        return this._timeLeftToStartFlashing <= 0 && this._tickTock;
    }

    ghostEaten(): number {
        ++this._amountOfGhostsEaten;
        return Math.pow(2, this._amountOfGhostsEaten) * 100;
    }

    get isFinished(): boolean {
        return this._timeLeft <= 0;
    }
}