import { Canvas, GameContext } from "../Core/_exports";

import { ActUpdateResult } from "./ActUpdateResult";

/**
 * An 'act' is something that's run in a loop.  The main window continaully updates and draws whatever
 * the 'current act' is.  Acts are things such as DemoAct, GameAct, GameOverAct etc.
 */
export abstract class Act {
    abstract update(context: GameContext): ActUpdateResult;
    abstract draw(canvas: Canvas): void;
    abstract get nextAct(): Act;
}