import { Tile, Maze, Direction } from "../Game/_exports";
import { Vector2D, Point } from "../Core/_exports";
import { GhostState } from "./GhostState";
import { Ghost } from "./Ghost";
import {DistanceAndDirection} from "./DistanceAndDirection";

export class GhostLogic {
    private _lastDecisionMadeAt: Point;
    private _lastDecisionMade: Direction;

    constructor(private readonly _maze: Maze, private readonly _ghost: Ghost) {
        this._lastDecisionMadeAt = new Point(-1, -1);
    }

    // Find which way to go from the ghost's next cell (in the direction of travel)
    // to the target cell.
    getWhichWayToGo(targetCell: Point): Direction {

        const currentTile = this._ghost.getTile();

        const cellPosition = currentTile.index;

        if (cellPosition.equals(this._lastDecisionMadeAt)) {
            return Direction.None;
        }

        const nextTile = currentTile.nextTileWrapped(this._ghost.direction.nextDirection);

        const decision = this.calculateWhichWayToGo(nextTile, targetCell);

        this._lastDecisionMadeAt = cellPosition;
        this._lastDecisionMade = decision;

        return decision;
    }

    private calculateWhichWayToGo(tile: Tile, targetCell: Point): Direction {
        const cellPosition = tile.index;
        const choices = this._maze.getChoicesAtCellPosition(cellPosition);

        const dir = this._ghost.direction.nextDirection;

        const avail = new Array<Direction>();
        if (choices.isSet(Direction.Up) && dir !== Direction.Down) {
            avail.push(Direction.Up);
        };

        if (choices.isSet(Direction.Left) && dir !== Direction.Right) {
            avail.push(Direction.Left);
        };

        if (choices.isSet(Direction.Down) && dir !== Direction.Up) {
            avail.push(Direction.Down);
        }

        if (choices.isSet(Direction.Right) && dir !== Direction.Left) {
            avail.push(Direction.Right);
        }

        if (avail.length === 1) {
            return avail[0];
        } else {
            if (this._maze.isSpecialIntersection(cellPosition) && this._ghost.state === GhostState.Normal) {
                const index: Direction = avail.indexOf(Direction.Up);

                // special intersection - remove Up from choices
                if (index !== -1) {
                    avail.splice(index, 1);
                }
            }

            if (avail.length === 0) {
                throw new Error("No choices to pick from!");
            }

            const dir = this.pickShortest(tile, targetCell, avail);

            return dir;
        }
    }

    private pickShortest(ghostTile: Tile, targetCell: Point, choices: Direction[]): Direction {

        if (choices.length === 0) {
            throw new Error("No choices to pick from!");
        }

        const pair = choices.map(direction => {

            const nextTileInThatDirection = ghostTile.nextTile(direction);

            const targetTile = Tile.fromIndex(targetCell);
            const centerOfTarget = targetTile.center.toVector2D();
            const distance = Vector2D.distanceBetween(
                nextTileInThatDirection.center.toVector2D(),
                centerOfTarget);

            const roundedDistance = this.round(distance);

            return new DistanceAndDirection(distance, roundedDistance, direction);
        });

        const sortedByDistance = pair.sort((l, r) => this.sort(l, r));

        return sortedByDistance[0].direction;
    }

    private sort(l: DistanceAndDirection, r: DistanceAndDirection): number {
        const dist = Math.floor(l.distance - r.distance);

        if (dist !== 0) {
            return dist;
        }

        const ret = this.weightDir(l.direction) - (this.weightDir(r.direction));

        return ret;
    }

    //From the spec: To break the tie, the ghost prefers directions in this order: up, left, down, right
    private weightDir(direction: Direction): number {
        if (direction === Direction.Up) {
            return 0;
        }

        if (direction === Direction.Left) {
            return 1;
        }

        if (direction === Direction.Down) {
            return 2;
        }

        return 3;
    }

    private round(n: number): number {
        return Math.round(n * 10) / 10;
    }
}