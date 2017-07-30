import { Canvas, GameContext, Keyboard } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";

import { AttractAct } from "./AttractAct";
import { StartButtonAct } from "./StartButtonAct";
import { Act } from "./Act";
import { ActUpdateResult } from "./ActUpdateResult";
import {Engine} from "../Engine";
import { TextPoints } from "./TextPoints";

/**
 * This is almost identical to the game act, except it transitions to the 'attract screen act'.
 */
export class DemoAct extends Act {

    private _nextAct: Act;

    constructor() {
        super();
        this._nextAct = new AttractAct();
        Engine.resetPnrg();
    }

    update(gameContext: GameContext): ActUpdateResult {

        // PAC EATEN
        // show pac dying
        // get next player
        // show NORMAL STARTUP if lives left otherwise show game over for 5 seconds then back to attract screenl

        if (GameContext.keyboard.isKeyDown(Keyboard.five)) {
            Engine.coinInserted();
            this._nextAct = new StartButtonAct();
            Engine.gameSounds.unmuteAll();
            return ActUpdateResult.Finished;
        }

        MainWindow.gameStats.update(gameContext);

        MainWindow.actors.maze.update(gameContext);
        MainWindow.actors.pacMan.update(gameContext);
        MainWindow.actors.fruit.update(gameContext);

        MainWindow.actors.ghosts.forEach(g => g.update(gameContext));

        return ActUpdateResult.Running;
    }

    draw(canvas: Canvas): void {
        canvas.underlyingCanvas.fillStyle = "black";
        canvas.underlyingCanvas.fillRect(0, 0, canvas.underlyingCanvas.canvas.width, canvas.underlyingCanvas.canvas.height);

        MainWindow.actors.maze.draw(canvas);
        MainWindow.actors.pacMan.draw(canvas);

        MainWindow.actors.ghosts.forEach(g => g.draw(canvas));

        canvas.drawText("GAME OVER", "red", TextPoints.gameOverPoint);
    }

    get nextAct(): Act {
        return new AttractAct();
    }
}