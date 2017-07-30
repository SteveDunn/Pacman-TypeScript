import { Point, GeneralSprite, Vector2D } from "../Core/_exports";

class PointAndWidth {
    constructor(public readonly pos: Point, public readonly width: number){}
}

interface IScorePositions {
    [score: string]: PointAndWidth;
}

export class ScoreSprite extends GeneralSprite {
    private static readonly scorePositions: IScorePositions = {
        ["200"]: new PointAndWidth(new Point(457, 133), 15),
        ["400"]: new PointAndWidth(new Point(473, 133),   15),
        ["800"]: new PointAndWidth(new Point(489, 133), 15),
        ["1600"]: new PointAndWidth(new Point(505, 133), 16),
        ["100"]: new PointAndWidth(new Point(456, 148), 13),
        ["300"]: new PointAndWidth(new Point(473, 148), 15),
        ["500"]: new PointAndWidth(new Point(489, 148), 15),
        ["700"]: new PointAndWidth(new Point(505, 148), 15),
        ["1000"]: new PointAndWidth(new Point(521, 148), 18),
        ["2000"]: new PointAndWidth(new Point(518, 164), 20),
        ["3000"]: new PointAndWidth(new Point(518, 180), 20),
        ["5000"]: new PointAndWidth(new Point(518, 196), 20)
    };
    
    constructor(public readonly position: Point, amount: number) {
        super(position,
            new Vector2D(ScoreSprite.scorePositions[amount.toString()].width, 7),
            new Point(ScoreSprite.scorePositions[amount.toString()].width / 2, 7 / 2),
            ScoreSprite.scorePositions[amount.toString()].pos);

        if (this.spriteSheetPos === undefined) {
            throw new Error(`Don't have a score for ${amount}`);
        }
    }
}