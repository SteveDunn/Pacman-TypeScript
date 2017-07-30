import { LoopingTimer, Canvas, Point, GameContext } from "../Core/_exports";
import { MainWindow } from "./MainWindow";

export class ScorePanel {
    private readonly _scorePos2Up= new Point(206, 8);
    private readonly _scorePos1Up= new Point(62, 8);
    private readonly _highScorePos = new Point(140, 8);
    private readonly _highScoreTextPos = new Point(72, 0);

    private readonly _timer: LoopingTimer;
    private readonly _playerOneTextPos = new Point(30, 0);
    private readonly _playerTwoTextPos = new Point(180, 0);

    private _tickTock: boolean = true;

    constructor(private readonly _canvas: Canvas) {
        this._timer = new LoopingTimer(250, () => this._tickTock = !this._tickTock);
    }

    update(context: GameContext) {
        this._timer.run(context.elapsed);
    }

    draw(): void {
        this.drawPlayerOneScore();
        this.drawPlayerTwoScore();
        this.drawHighScore();
    }

    drawHighScore() {
        this._canvas.drawText("HIGH SCORE", "white", this._highScoreTextPos);

        this.drawRightAlignedScoreText(MainWindow.gameStats.highScore, this._highScorePos);
    }

    drawPlayerOneScore() {
        this.drawPlayerText(0, "1UP", this._playerOneTextPos);
        let score: number = 0;
        if (MainWindow.gameStats.hasPlayerStats(0)) {
            score = MainWindow.gameStats.getPlayerStats(0).score;
        };
        this.drawRightAlignedScoreText(score, this._scorePos1Up);
    }

    drawRightAlignedScoreText(score: number, pos: Point) {
        let scoreText = score.toString();
        
        if (scoreText === "0") {
            scoreText = "00";
        }
        
        const length = new Point(scoreText.length * 8, 0);
        
        const left = pos.minus(length);
        
        this._canvas.drawText(scoreText, "white", left);
    }

    drawPlayerTwoScore() {
        if (MainWindow.gameStats.amountOfPlayers > 1) {
            this.drawPlayerText(1, "2UP", this._playerTwoTextPos);
            let score: number = 0;

            if (MainWindow.gameStats.hasPlayerStats(1)) {
                score = MainWindow.gameStats.getPlayerStats(1).score;
            };

            this.drawRightAlignedScoreText(score, this._scorePos2Up);
        }
    }

    drawPlayerText(playerIndex: number, text: string, pos: Point) {
        const shouldFlash = MainWindow.gameStats.anyonePlaying && MainWindow.gameStats.currentPlayerStats.playerIndex === playerIndex;

        const shouldDraw = !shouldFlash || this._tickTock;

        if (shouldDraw) {
            this._canvas.drawText(text, "white", pos);
        }
    }
}