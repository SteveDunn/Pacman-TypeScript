import { MainWindow } from "./Game/_exports";
import { GameSoundPlayer } from "./Game/_exports";
import { SoundLoader, Keyboard, GameContext } from "./Core/_exports";

declare var loadState: any;
declare var controlPanel: any;

export class Engine {
    private static _pnrg: number = 0;
    private static _credits: number = 0;

    private static readonly soundLoader = new SoundLoader(
        (assetName: string, percentage: number) => { loadState.assetLoaded(assetName, percentage); });

    private static gameSoundPlayer: GameSoundPlayer;

    private _dateLoopLastRun: number;

    private _mainWindow: MainWindow;

    constructor() {
        const canvasElement = <HTMLCanvasElement>document.getElementById("gameContainer");

        const canvasContext = <CanvasRenderingContext2D>canvasElement.getContext("2d");
        canvasContext.scale(3, 3);

        this._dateLoopLastRun = window.performance.now();

        window.requestAnimationFrame(() => this.loadLoop());
    }

    loadLoop = () => {

        if (loadState.__finishedLoading === false) {
            window.requestAnimationFrame(() => this.loadLoop());
            return;
        }

        this._dateLoopLastRun = window.performance.now();

        this._mainWindow = new MainWindow(this);

        window.requestAnimationFrame(() => this.mainGameLoop());

        Engine.showControlPanel();
    }

    static get pnrg(): number {
        return Engine._pnrg;
    }

    static resetPnrg() {
        Engine._pnrg =0;
    }

    static get gameSounds(): GameSoundPlayer {
        if (Engine.gameSoundPlayer === undefined) {
            Engine.gameSoundPlayer = new GameSoundPlayer(Engine.soundLoader);
        }
        return Engine.gameSoundPlayer;
    }

    mainGameLoop = () => {
        window.requestAnimationFrame(() => this.mainGameLoop());

        this.update();

        this.draw();
    }

    static showControlPanel() {
        controlPanel.show();
        controlPanel.updateWithCredits(this._credits);
    }

    static useCredits(amount: number) {
        if (this._credits - amount < 0) {
            throw new Error("Not enough credits!");
        }

        controlPanel.hide();

        // let ele = <HTMLDivElement>document.getElementById("controlPanel");
        // ele.style.opacity = "0";

        this._credits -= amount;
    }

    static get credits() {
        return this._credits;
    }

    static coinInserted() {
        ++this._credits;
        Engine.gameSounds.coinInsterted();
        controlPanel.updateWithCredits(this._credits);
    }

    update(): void {
        if (GameContext.keyboard.isKeyDown(Keyboard.p)) {
            return;
        }

        ++Engine._pnrg;

        const now = window.performance.now();

        const elapsed = now - this._dateLoopLastRun;

        this._dateLoopLastRun = now;
        this._mainWindow.update(elapsed);
    }

    draw(): void {
        this._mainWindow.draw();
    }
}