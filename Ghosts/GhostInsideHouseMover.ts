import { MainWindow, GhostHouseDoor, Maze, Direction, DirectionToIndexLookup } from "../Game/_exports";
import { Vector2D, Point, GameContext } from "../Core/_exports";

import { Ghost } from "./Ghost";
import { GhostMovementMode } from "./GhostMovementMode";
import { GhostMover } from "./GhostMover";
import { DirectionInfo } from "./DirectionInfo";
import {MovementResult} from "./MovementResult";

/**
 * Moves the ghosts while they are inside of the house
 */
export class GhostInsideHouseMover extends GhostMover {

    private readonly _door: GhostHouseDoor;
    private readonly _routeOut: Point[];
    private readonly _topPos: Point;
    private readonly _bottomPos: Point;
    private readonly _centerOfUpDown: Point;

    private _cellToMoveFrom: Point;
    private _cellToMoveTo: Point;

    private _readyToExit: boolean = false;
    private _indexInRouteOut: number = 0;
    private _finished: boolean = false;

    constructor(ghost: Ghost, maze: Maze) {

        super(ghost, GhostMovementMode.InHouse, maze, () => Point.zero);

        this._door = MainWindow.gameStats.currentPlayerStats.ghostHouseDoor;

        const center = Maze.pixelCenterOfHouse;

        const x = (center.x + (ghost.offsetInHouse * 16));

        this._topPos = new Point(x, 13.5 * 8 + 4);
        this._bottomPos = new Point(x, 15.5 * 8 - 4);

        this._centerOfUpDown = new Point(this._topPos.x, Maze.pixelCenterOfHouse.y);

        ghost.position = this._topPos.add(this._bottomPos.minus(this._topPos).divide(2));

        this._cellToMoveFrom = ghost.position;

        if (ghost.direction.currentDirection === Direction.Down) {
            this._cellToMoveTo = this._bottomPos;
        } else if (ghost.direction.currentDirection === Direction.Up) {
            this._cellToMoveTo = this._topPos;
        } else {
            throw new Error("Ghost must be pointing up or down at start.");
        }

        this._routeOut = [this._centerOfUpDown, Maze.pixelCenterOfHouse, Maze.pixelHouseEntrancePoint];
    }

    whenAtTargetCell = () => {
        this._cellToMoveFrom = this._cellToMoveTo;

        if (!this._readyToExit) {
            if (this._cellToMoveTo.equals(this._topPos)) {
                this._cellToMoveTo = this._bottomPos;
            } else {
                this._cellToMoveTo = this._topPos;
            }

            return;
        }

        if (this._indexInRouteOut === this._routeOut.length) {
            this._finished = true;
        } else {
            this._cellToMoveTo = this._routeOut[this._indexInRouteOut++];
        }
    }

    switch = () => {
        this._readyToExit = true;
    }

    update(context: GameContext): MovementResult {
        if (!this._readyToExit && this._door.canGhostLeave(this.ghost)) {
            this._readyToExit = true;
            return MovementResult.NotFinished;
        }

        if (this._finished) {
            this.ghost.direction = new DirectionInfo(Direction.Left, Direction.Left);
            this.ghost.setMovementMode(GhostMovementMode.Undecided);
            return MovementResult.Finished;
        }

        const diff = this._cellToMoveTo.minus(this._cellToMoveFrom).toVector2D();

        if (!diff.equals(Vector2D.zero)) {
            diff.normalize();

            this.ghost.position = this.ghost.position.add(diff.divide(2).toPoint());

            const dir = DirectionToIndexLookup.getDirectionFromVector(diff);
            
            this.ghost.direction = new DirectionInfo(dir, dir) ;
        }

        if (this.ghost.position.floor().equals(this._cellToMoveTo.floor())) {
            this.ghost.position = this._cellToMoveTo;
            this.whenAtTargetCell();
        }

        return MovementResult.NotFinished;
    }
}
