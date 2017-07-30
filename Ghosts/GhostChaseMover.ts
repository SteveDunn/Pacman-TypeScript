import { Maze } from "../Game/_exports";

import { Ghost } from "./Ghost";
import { GhostMovementMode } from "./GhostMovementMode";
import { GhostMover } from "./GhostMover";

/**
 * Moves the ghost to the 'chase target' cell (provided by the ghost)
 */
export class GhostChaseMover extends GhostMover {
    elapsedTime: number;

    constructor(
        ghost: Ghost,
        maze: Maze) {
            super(ghost, GhostMovementMode.Chase, maze, ghost.getChaseTarget);
    }
}

