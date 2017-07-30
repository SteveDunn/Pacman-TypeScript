import { Canvas, GameContext, Point, Sprite, TwoFrameAnimation, Vector2D } from "../Core/_exports";
import { GhostFrightSession, Direction } from "../Game/_exports";
import { GhostSpritesheetInfo } from "./GhostSpritesheetInfo";
import { GhostState } from "./GhostMode";
import { GhostNickname } from "./GhostNickname";
import { DirectionInfo } from "./DirectionInfo";
import { EyesSpritesheetInfo } from "./EyesSpritesheetInfo";
import { FrightenedSpritesheet } from "./FrightenedSpritesheet";
import { GhostSpritesheet } from "./GhostSpritesheet";
import {GhostMovementMode} from "./GhostMovementMode";

export class SimpleGhost extends Sprite {
    visible: boolean;

    protected _direction: DirectionInfo;

    protected readonly spriteSize = new Vector2D(16, 16);
    protected _spritesheetPos: Point;
    protected canvasPos: Point;
    protected readonly _spriteSheet: HTMLImageElement;

    protected spritesheetInfoNormal: GhostSpritesheetInfo;
    protected spritesheetInfoFrightened: FrightenedSpritesheet;
    protected spriteSheetEyes: EyesSpritesheetInfo;

    protected _movementMode: GhostMovementMode;
    protected _state: GhostState;

    private _toggle = new TwoFrameAnimation(65);
    private _frightSession: GhostFrightSession;

    constructor(public readonly nickName: GhostNickname, direction: Direction) {
        super();
        this._direction = new DirectionInfo(direction, direction);

        this.visible = true;
        this._spriteSheet = <HTMLImageElement>document.getElementById("spritesheet");

        const spriteSheet = new GhostSpritesheet();

        this.spritesheetInfoNormal = spriteSheet.getEntry(nickName);
        this.spritesheetInfoFrightened = new GhostSpritesheet().getFrightened();
        this.spriteSheetEyes = spriteSheet.eyes;

        this._spritesheetPos = this.spritesheetInfoNormal.getSourcePosition(this._direction.nextDirection, true);
    }

    set frightSession(session: GhostFrightSession) {
        this._frightSession = session;
    }

    get state(): GhostState {
        return this._state;
    }

    get isInHouse() {
        return this._movementMode === GhostMovementMode.InHouse;
    }

    get direction(): DirectionInfo {
        return this._direction;
    }

    set direction(direction: DirectionInfo) {
        this._direction = direction;
    }

    get spriteSheet(): HTMLImageElement {
        return this._spriteSheet;
    }

    get spriteSheetPos(): Point {
        return this._spritesheetPos;
    }

    get size(): Vector2D {
        return this.spriteSize;
    }

    get origin(): Point {
        return Point.eight;
    }

    get position(): Point {
        return this.canvasPos;
    }

    set position(pos: Point) {
        this.canvasPos = pos;
    }

    update(context: GameContext): void {
        this.updateAnimation(context);
    }

    draw(canvas: Canvas): void {
        if (this.visible) {
            canvas.drawSprite(this);
        }
    }

    updateAnimation(context: GameContext): void {
        this._toggle.run(context);

        if (this._state === GhostState.Frightened) {
            this._spritesheetPos = this.getGhostFrame();
        } else if (this._state === GhostState.Eyes) {
            this._spritesheetPos = this.spriteSheetEyes.getSourcePosition(this._direction.nextDirection);
        } else {
            this._spritesheetPos = this.spritesheetInfoNormal.getSourcePosition(this._direction.nextDirection, this._toggle.flag);
        }
    }

    powerPillEaten(session: GhostFrightSession) {
        this._frightSession = session;
    }

    getGhostFrame = () => {
        if(this._frightSession === undefined) {
            throw new Error("Cannot get ghost frame - not in a fright session");
        }

        const pair = this._frightSession.isWhite 
            ? this.spritesheetInfoFrightened.white
            : this.spritesheetInfoFrightened.blue;

        if (this._toggle.flag) {
            return pair.first;
        }

        return pair.second;
    }
}