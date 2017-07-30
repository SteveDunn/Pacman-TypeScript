export class LoopingTimer {
    firesEvery: number;
    currentTime: number;
    callback: () => void;

    constructor(firesEvery: number, callback: () => void) {
        this.firesEvery = firesEvery;
        this.currentTime = firesEvery;
        this.callback = callback;
    }

    get progress(): number{
        const msGone = this.firesEvery - this.currentTime;
        const pc = msGone * 100/this.firesEvery;
        return pc;
    }

    run(elapsed: number): void {
        this.currentTime -= elapsed;
        if (this.currentTime < 0) {
            this.currentTime += this.firesEvery;
            this.callback();
        }
    }
}
