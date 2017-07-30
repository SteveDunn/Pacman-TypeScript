import { GameContext } from "../Core/_exports";

import { PlayerStats } from "./PlayerStats";

export class DemoStats extends PlayerStats {
    constructor() {
        super(0);
        this._livesRemaining = 1;
    }

    protected increaseScoreBy(amount: number) {
    }

    update(context: GameContext) {
        super.update(context);
    }
}