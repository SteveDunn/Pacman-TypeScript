import { GameContext } from "./GameContext";
import { LoopingTimer } from "./LoopingTimer";

export class TwoFrameAnimation {
    timer: LoopingTimer;
    flag: boolean;

    constructor(switchEveryMs: number) {
        this.timer = new LoopingTimer(switchEveryMs, () => this.flag = !this.flag);
    }

    run(context: GameContext): void {
        this.timer.run(context.elapsed);
    }
}
