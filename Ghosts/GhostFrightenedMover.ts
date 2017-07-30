import { Maze, MazeBounds } from "../Game/_exports";
import { Point } from "../Core/_exports";

import { Ghost } from "./Ghost";
import { GhostMovementMode } from "./GhostMovementMode";
import { GhostMover } from "./GhostMover";
import { Engine } from "../Engine";

/**
 * Moves the ghost in a psuedo-random fashion while they are 'frightened' (i.e. blue)
 */
export class GhostFrightenedMover extends GhostMover {

    constructor(ghost: Ghost, maze: Maze) {
        super(ghost, GhostMovementMode.Frightened, maze, () => this._getChaseTargetCell());
    }

    private _getChaseTargetCell = (): Point => {
        const random = Engine.pnrg;

        if (random % 4 === 0) {
            return MazeBounds.topLeft;
        }

        if (random % 4 === 1) {
            return new Point(MazeBounds.dimensions.x, 0);
        }

        if (random % 4 === 2) {
            return MazeBounds.dimensions.toPoint();
        }

        return new Point(0, MazeBounds.dimensions.y);
    }
}
