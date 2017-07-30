import { GameContext } from "./GameContext";
import { Point } from "./Point";
import { Vector2D } from "./Vector2D";
import { Canvas } from "./Canvas";
import { Sprite } from "./Sprite";
import { TwoFrameAnimation } from "./TwoFrameAnimation";

export class GeneralSprite extends Sprite {

    private readonly _spriteSheet: HTMLImageElement;
    private readonly _animator: TwoFrameAnimation;
    private _currentFrame: Point;

    visible: boolean = true;

    constructor(private _pos: Point,
        private readonly _spriteSize: Vector2D,
        private readonly _offsetForOrigin: Point,
        private readonly _frame1: Point,
        private readonly _frame2?: Point,
        animationSpeed?: number) {

        super();

        this._spriteSheet = <HTMLImageElement>document.getElementById("spritesheet");

        if (_frame2 !== undefined) {
            this._animator = new TwoFrameAnimation(Number(animationSpeed));
        }

        this._currentFrame = _frame1;
    }

    get spriteSheet(): HTMLImageElement {
        return this._spriteSheet;
    }

    get size(): Vector2D {
        return this._spriteSize;
    }

    get origin(): Point {
        return this._offsetForOrigin;
    }

    get spriteSheetPos(): Point {
        return this._currentFrame;
    }

    update(context: GameContext): void {
        if (this._animator !== undefined) {
            this._animator.run(context);
            this._currentFrame = this._animator.flag ? <Point>this._frame2 : this._frame1;
        }
    }

    get position(): Point {
        return this._pos;
    }

    set position(pos: Point) {
        this._pos = pos;
    }

    draw(canvas: Canvas): void {
        if (!this.visible) {
            return;
        }

        canvas.drawSprite(this);
    }
}