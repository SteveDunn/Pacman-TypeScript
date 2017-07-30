import { Canvas } from "../Core/_exports";

import { Act } from "./Act";
import {GameOverAct} from "./GameOverAct";
import { TextPoints } from "./TextPoints";

/**
 * Draws game over and player X
 */
export class PlayerGameOverAct extends GameOverAct {
    constructor(private readonly _playerNumber: number, private readonly _nextAct: Act) {
        super();
    }

    draw(canvas: Canvas) {
        super.draw(canvas);
        let text = "";

        if (this._playerNumber === 0) {
            text = "PLAYER ONE";
        } else {
            text = "PLAYER TWO";
        }

        canvas.drawText(text, "cyan", TextPoints.playerTextPoint);
    }

    get nextAct(): Act {
        return this._nextAct;
    }
}