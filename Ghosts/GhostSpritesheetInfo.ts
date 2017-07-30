import { FramePair, Point } from "../Core/_exports";
import { Direction } from "../Game/_exports";

export class GhostSpritesheetInfo {
    private _width: number = 16;

    frames: FramePair[];

    constructor(public readonly nickname: string, public position: Point) {
        this.frames = new Array<FramePair>();

        const toMove = new Point(this._width, 0);

        let marker = position;

        this.frames[Direction.Right] = new FramePair(position, position.add(toMove));
        marker = marker.add(toMove);
        marker = marker.add(toMove);

        this.frames[Direction.Left] = new FramePair(marker, marker.add(toMove));
        marker = marker.add(toMove);
        marker = marker.add(toMove);

        this.frames[Direction.Up] = new FramePair(marker, marker.add(toMove));
        marker = marker.add(toMove);
        marker = marker.add(toMove);

        this.frames[Direction.Down] = new FramePair(marker, marker.add(toMove));
    }

    getSourcePosition(direction: Direction, useFirstFrame: boolean): Point {
        const frame: FramePair = this.frames[direction];

        if (useFirstFrame) {
            return frame.first;
        }

        return frame.second;
    }
}