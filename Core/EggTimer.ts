export class EggTimer {
    private readonly _duration: number;

    private _isPaused: boolean;
    private _isFinished: boolean;
    private _currentTime: number;

    whenFinished: () => void;

    constructor(duration: number, whenFinished: () => void) {
        this._duration = duration;
        this._currentTime = duration;
        this.whenFinished = whenFinished;
    }

    reset() {
        this._currentTime = this._duration;
    }

    get progress(): number {
        const msGone = this._duration - this._currentTime;

        const pc = msGone * 100 / this._duration;

        return pc;
    }

    get finished() {
        return this._isFinished;
    }

    run(elapsed: number): void {
        if (this._isFinished) {
            return;
        }

        if (this._isPaused) {
            return;
        }

        this._currentTime -= elapsed;

        if (this._currentTime < 0) {
            this._isFinished = true;
            this.whenFinished();
        }
    }

    pause() {
        this._isPaused = true;
    }

    resume() {
        this._isPaused = false;
    }
}