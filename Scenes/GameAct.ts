import { GameSoundPlayer, MainWindow } from "../Game/_exports";
import { Canvas, GameContext, Keyboard } from "../Core/_exports";

import { Engine } from "../Engine";
import { Act } from "./Act";
import { ActUpdateResult } from "./ActUpdateResult";
import { PlayerIntroAct } from "./PlayerIntroAct";

/**
 * The main 'Game' act.  Draws everything (maze, ghosts, pacman), and updates
 * everything (keyboard, sound etc.)
 * Transitions to the 'player intro' act
 */
export class GameAct extends Act {
    private readonly _gameSounds: GameSoundPlayer;

    constructor() {
        super();
        this._gameSounds = Engine.gameSounds;
        Engine.resetPnrg();
    }

    update(gameContext: GameContext): ActUpdateResult {
 // play sounds first, as if we play them last, that state of the game
 // might've updated and the 'current act' might've changed
 // so we don't want to be playing our sounds if
 // another act is queued up.
        this._gameSounds.update();

        MainWindow.gameStats.update(gameContext);

        if (GameContext.keyboard.isKeyDown(Keyboard.p)) {
            return ActUpdateResult.Running;
        }

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
        MainWindow.actors.fruit.draw(canvas);

        MainWindow.actors.ghosts.forEach(g => g.draw(canvas));
    }

    get nextAct(): Act {
        return new PlayerIntroAct(true);
    }
}