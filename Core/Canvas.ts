import { Vector2D } from "./Vector2D";
import { Point } from "./Point";
import { Sprite } from "./Sprite";

export class Canvas {
    static scale: number = 3;
    static fontName: string = "10px joytstix";

    constructor(private readonly _topLeft: Point,
        private readonly _canvasRenderContext: CanvasRenderingContext2D) {

        this._canvasRenderContext.font = "10px Joystix";
    }                         
                     
    setFont(font: string) {
        this._canvasRenderContext.font = font;
    }

    static canvasFromImage(image: HTMLImageElement, imageOffset?: Point, imageSize?: Vector2D): Canvas {

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const oldContext = <CanvasRenderingContext2D>(canvas.getContext("2d"));
        if (imageOffset === undefined) {
            imageOffset = Point.zero;
        }                

        if (imageSize === undefined) {
            imageSize = new Vector2D(image.width, image.height);
        }

        oldContext.drawImage(image, imageOffset.x, imageOffset.y, imageSize.x, imageSize.y, 0, 0, imageSize.x, imageSize.y);

        return new Canvas(Point.zero, oldContext);
    }

    static createOffscreenCanvas(size: Vector2D): Canvas {
        const c = document.createElement("canvas");
        c.width = size.x;
        c.height = size.y;

        const ctx = <CanvasRenderingContext2D>c.getContext("2d");
        ctx.scale(3, 3);
        return new Canvas(Point.zero, ctx);
    }

    get underlyingCanvas(): CanvasRenderingContext2D {
        return this._canvasRenderContext;
    }

    drawOtherCanvas(otherCanvas: Canvas, position: Point) {
        position = position.add(this._topLeft);
        const image = otherCanvas._canvasRenderContext.getImageData(Point.zero.x, Point.zero.y, otherCanvas.width, otherCanvas.height);
        this._canvasRenderContext.putImageData(image, position.x, position.y);
    }

    drawOtherCanvas2(otherCanvas: Canvas, position: Point) {
        position = position.add(this._topLeft);
        this._canvasRenderContext.drawImage(otherCanvas._canvasRenderContext.canvas, position.x, position.y);
    }

    get width(): number {
        return this._canvasRenderContext.canvas.width;
    }

    get height(): number {
        return this._canvasRenderContext.canvas.height;
    }

    get size(): Vector2D {
        return new Vector2D(this.width, this.height);
    }

    drawText(input: string, color: string, where: Point): void {
        where = where.add(this._topLeft);
        this._canvasRenderContext.fillStyle = color;
        this._canvasRenderContext.textBaseline = "top";
        this._canvasRenderContext.fillText(input, where.x, where.y);
    }

    drawSprite(sprite: Sprite): void {
        let topLeft = sprite.position.minus(sprite.origin);
        topLeft = topLeft.add(this._topLeft);
        const spriteSheetPos = sprite.spriteSheetPos;

        this._canvasRenderContext.drawImage(
            sprite.spriteSheet,
            spriteSheetPos.x,
            spriteSheetPos.y,
            sprite.size.x,
            sprite.size.y,
            topLeft.x,
            topLeft.y,
            sprite.size.x,
            sprite.size.y);
    }

    draw(
        position: Point,
        origin: Point,
        size: Point,
        spriteSheetPos: Point,
        spriteSheet: HTMLImageElement): void {

        let topLeft = position.minus(origin);
        topLeft = topLeft.add(this._topLeft);

        this._canvasRenderContext.drawImage(
            spriteSheet,
            spriteSheetPos.x,
            spriteSheetPos.y,
            size.x,
            size.y,
            topLeft.x,
            topLeft.y,
            size.x,
            size.y);
    }

    fillRect(color: string, topLeft: Point, size: Vector2D): void {
        this._canvasRenderContext.fillStyle = "black";
        topLeft = topLeft.add(this._topLeft);

        this._canvasRenderContext.fillRect(topLeft.x, topLeft.y, size.x, size.y);
    }

    drawRect(sprite: Sprite, color: string) {
        let topLeft = sprite.position.minus(sprite.origin);
        topLeft = topLeft.add(this._topLeft);
        
        this._canvasRenderContext.beginPath();
        this._canvasRenderContext.rect(topLeft.x, topLeft.y, sprite.size.x, sprite.size.y);
        this._canvasRenderContext.lineWidth = .5;
        this._canvasRenderContext.strokeStyle = color;
        this._canvasRenderContext.stroke();
    }
}
