import { Engine } from "../Engine";
import { Ghost } from "../Ghosts/_exports";
import { Keyboard, EggTimer, SceneUpdateResult, Point, Canvas, GameContext, Vector2D } from "../Core/_exports";
import { Act, PacManDyingAct, LevelFinishedAct, ActUpdateResult, AttractAct} from "../Scenes/_exports";

import { TimedSprite } from "./TimedSprite";
import { TimedSpriteList } from "./TimedSpriteList";
import { ScoreSprite } from "./ScoreSprite";
import { GameStats } from "./GameStats";
import { StatusPanel } from "./StatusPanel";
import { ScorePanel } from "./ScorePanel";
import {Actors} from "./Actors";


export class MainWindow {
    static gameStats: GameStats;
    static actors: Actors;

    private static currentAct: Act;
    private static tempSprites: TimedSpriteList;
    private static pauser: EggTimer;

    private readonly _gameCanvas: Canvas;
    private readonly _scoreCanvas: Canvas;
    private readonly _statusCanvas: Canvas;

    private readonly _scorePanel: ScorePanel;
    private readonly _statusPanel: StatusPanel;
    private readonly _canvasContext: CanvasRenderingContext2D;

    private readonly _canvasSize: Vector2D;

    private readonly _gameContext: GameContext;

    constructor() {
        MainWindow.actors = new Actors();
        MainWindow.gameStats = new GameStats();
        MainWindow.tempSprites = new TimedSpriteList();

        MainWindow.pauser = new EggTimer(0, () => { });

        this._gameContext = new GameContext();

        const canvasElement = <HTMLCanvasElement>document.getElementById("gameContainer");

        this._canvasContext = <CanvasRenderingContext2D>canvasElement.getContext("2d");

        this._canvasSize = new Vector2D(this._canvasContext.canvas.width, this._canvasContext.canvas.height);

        this._gameCanvas = new Canvas(new Point(0, 26), this._canvasContext);
        this._scoreCanvas = new Canvas(Point.zero, this._canvasContext);
        this._statusCanvas = new Canvas(new Point(0, 274), this._canvasContext);

        this._scorePanel = new ScorePanel(this._scoreCanvas);
        this._statusPanel = new StatusPanel(this._statusCanvas);

        MainWindow.currentAct = new AttractAct();

        // POINTER: You can change the starting Act by using something like:
        //MainWindow.currentAct = new TornGhostChaseAct(new AttractAct());
    }

    static newGame(players: number) {
        MainWindow.gameStats.reset(players);
        MainWindow.actors.maze.reset();
        MainWindow.gameStats.choseNextPlayer();
    }

    static newDemoGame() {
        MainWindow.gameStats.resetForDemo();

        MainWindow.actors.maze.reset();
        MainWindow.gameStats.choseNextPlayer();
    }

    get name(): string {
        return "game";
    }

    update(elapsed: number): SceneUpdateResult {
        this._gameContext.elapsed = elapsed;
        this._gameContext.totalGameTime += elapsed;

        MainWindow.tempSprites.update(this._gameContext);

        MainWindow.pauser.run(elapsed);

        //cheat:
        if (GameContext.keyboard.wasKeyPressed(Keyboard.three)) {
            MainWindow.currentAct = new LevelFinishedAct();
        }

        //     MainWindow.gameStats.update(this.gameContext);
        if (MainWindow.pauser.finished) {
            const actResult = MainWindow.currentAct.update(this._gameContext);
            if (actResult === ActUpdateResult.Finished) {
                MainWindow.currentAct = MainWindow.currentAct.nextAct;
            }
        }

        this._scorePanel.update(this._gameContext);
        this._statusPanel.update(this._gameContext);

        return SceneUpdateResult.Running;
    }

    draw(): void {
        this._canvasContext.fillStyle = "black";
        this._canvasContext.fillRect(0, 0, this._canvasSize.x, this._canvasSize.y);

        MainWindow.currentAct.draw(this._gameCanvas);

        MainWindow.tempSprites.draw(this._gameCanvas);

        this._scorePanel.draw();
        this._statusPanel.draw();
    }

    static fruitEaten() {
        Engine.gameSounds.fruitEaten();

        MainWindow.gameStats.fruitEaten();
        const points = MainWindow.gameStats.currentPlayerStats.levelStats.levelProps.fruitPoints;
        MainWindow.tempSprites.add(new TimedSprite(3000, new ScoreSprite(MainWindow.actors.fruit.position, points)));
    }

    static pacManEaten() {
        MainWindow.gameStats.pacManEaten();

        MainWindow.currentAct = new PacManDyingAct();
    }

    static ghostEaten(ghost: Ghost) {
        Engine.gameSounds.ghostEaten();

        const points = MainWindow.gameStats.ghostEaten();

        this.tempSprites.add(new TimedSprite(900, new ScoreSprite(MainWindow.actors.pacMan.position, points)));

        ghost.visible = false;
        MainWindow.actors.pacMan.visible = false;

        MainWindow.pauser = new EggTimer(1000, () => {
            ghost.visible = true;
            MainWindow.actors.pacMan.visible = true;
        });
    }

    static pillEaten(cell: Point) {
        MainWindow.gameStats.currentPlayerStats.levelStats.pillsEaten % 2 === 0
            ? Engine.gameSounds.munch1()
            : Engine.gameSounds.munch2();

        MainWindow.gameStats.pillEaten(cell);

        MainWindow.actors.pacMan.pillEaten();
        this.checkForNoMorePills();
    }

    static powerPillEaten(cell: Point) {

        Engine.gameSounds.powerPillEaten();

        MainWindow.gameStats.powerPillEaten(cell);

        MainWindow.actors.ghosts.forEach(g => {
            g.powerPillEaten(MainWindow.gameStats.currentPlayerStats.frightSession);
            //g.changeModeIfDifferent(GhostMovementMode.Frightened);
        });

        this.checkForNoMorePills();
    }

    private static checkForNoMorePills() {
        if (MainWindow.gameStats.currentPlayerStats.levelStats.pillsRemaining === 0) {
            // MainWindow.gameStats.levelFinished();
            //dont' call levelFinished - the act does that when it's finished
            MainWindow.currentAct = new LevelFinishedAct();
        }
    }
}