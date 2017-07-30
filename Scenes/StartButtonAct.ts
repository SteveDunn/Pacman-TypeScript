import { Canvas, GameContext, Keyboard, Point } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";

import { PlayerIntroAct } from "./PlayerIntroAct";
import { Engine } from "../Engine";
import { ActUpdateResult } from "./ActUpdateResult";
import { Act } from "./Act";

/**
 * The 'act' that shows the '1 or 2 players' screen.
 */
export class StartButtonAct extends Act {
    private _nextAct: Act;

    constructor() {
        super();

        Engine.showControlPanel();
    }

    get nextAct(): Act {
        if (this._nextAct === undefined) {
            throw new Error("No next act yet!");
        }

        return this._nextAct;
    }

    update(gameContext: GameContext): ActUpdateResult {

        if (GameContext.keyboard.wasKeyPressed(Keyboard.one)) {
            MainWindow.newGame(1);
            Engine.useCredits(1);
            this._nextAct = new PlayerIntroAct(true);

            return ActUpdateResult.Finished;
        }

        if (GameContext.keyboard.wasKeyPressed(Keyboard.two) && Engine.credits >= 2) {
            MainWindow.newGame(2);
            Engine.useCredits(2);
            this._nextAct = new PlayerIntroAct(true);
            return ActUpdateResult.Finished;
        }

        if (GameContext.keyboard.wasKeyPressed(Keyboard.five)) {
            Engine.coinInserted();
        }

        return ActUpdateResult.Running;
    }

    draw(canvas: Canvas): void {
        canvas.drawText("PUSH START BUTTON", "orange", new Point(50, 115));

        let text: string;
        if (Engine.credits < 2) {
            text = "1 PLAYER ONLY";

        } else {
            text = "1 OR 2 PLAYERS";
        }
        canvas.drawText(text, "cyan", new Point(70, 145));

        canvas.drawText("BONUS PAC-MAN FOR 10000 PTS", "white", new Point(0, 175));
        canvas.drawText("(C) 1980 MIDWAY MFG. CO.", "white", new Point(15, 190));
    }
}
