import { Maze } from "../Game/_exports";

import { Ghost } from "./Ghost";
import { GhostMovementMode } from "./GhostMovementMode";
import { GhostMover } from "./GhostMover";

/**
 * Moves the ghost to their 'scatter cell' (provided by the ghost)
 */
export class GhostScatterMover extends GhostMover {

    constructor(ghost: Ghost, maze: Maze) {
            super(ghost, GhostMovementMode.Scatter, maze, ghost.getScatterTarget);
    }
}
