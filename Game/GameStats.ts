import { GameContext, Point } from "../Core/_exports";

import { PlayerStats } from "./PlayerStats";
import { DemoStats } from "./DemoStats";
import { GameStorage } from "../GameStorage";

export class GameStats {
    private _playedIntroTune: boolean;
    private _currentPlayerIndex: number;
    
    private _playerStats: PlayerStats[];
    
    private _currentPlayerStats: PlayerStats;
    
    private _isDemo: boolean;

    private _highScore: number = 0;

    constructor() {
        this._highScore = GameStorage.highScore;
        this.reset(0);
    }

    reset(players: number) {
        this._isDemo = false;
        this._playedIntroTune = false;

        this._playerStats = [];

        for (let i: number = 0; i < players; i++) {
            this._playerStats.push(new PlayerStats(i));
        }

        this._currentPlayerIndex = -1;
    }

    get isDemo() {
        return this._isDemo;
    }

    get hasPlayedIntroTune() {
        return this._playedIntroTune;
    }

    playerIntroTune() {
        this._playedIntroTune = true;
    }

    resetForDemo() {
        this._isDemo = true;

        this._playerStats = [];

        const playerStats = new DemoStats();
        
        this._playerStats.push(playerStats);

        this._currentPlayerIndex = -1;
    }

    update(context: GameContext) {
        if (this.currentPlayerStats === undefined) {
            return;
        }

        this.currentPlayerStats.update(context);
    }

    getPlayerStats(index: number): PlayerStats {
        return this._playerStats[index];
    }

    fruitEaten(){
        this.currentPlayerStats.fruitEaten();
    }

    get highScore() {
        return this._highScore;
    }

    hasPlayerStats(playerNumber: number) {
        return this._playerStats.length > playerNumber;
    }

    get amountOfPlayers(): number {
        return this._playerStats.length;
    }

    get anyonePlaying() {
        return this._currentPlayerIndex !== -1;
    }

    get currentPlayerStats(): PlayerStats {
        return this._currentPlayerStats;
    }

    get isGameOver() {
        return this._playerStats.filter(p => p.livesRemaining > 0).length === 0;
    }

    choseNextPlayer(): void {
        let players =
            this._playerStats.filter(p => p.playerIndex > this._currentPlayerIndex && p.livesRemaining > 0);

        if (players.length === 0) {
            players = this._playerStats.filter(p => p.livesRemaining > 0);
        }

        if (players.length > 0) {
            this._currentPlayerIndex = players[0].playerIndex;
            this._currentPlayerStats = this._playerStats[this._currentPlayerIndex];
            
        } else {
            this._currentPlayerIndex = -1;
        }
    }

    updateHighScore() {
        if (this._playerStats.length === 1) {
            this._highScore = Math.max(this._playerStats[0].score, this._highScore);
        }

        if (this._playerStats.length === 2) {
            this._highScore = Math.max(this._playerStats[1].score, this._highScore);
        }
    }

    pillEaten(point: Point) {
        this._playerStats[this._currentPlayerIndex].pillEaten(point);
        this.updateHighScore();
    }

    powerPillEaten(point: Point) {
        this._playerStats[this._currentPlayerIndex].powerPillEaten(point);
        this.updateHighScore();
    }

    pacManEaten() {
        this._playerStats[this._currentPlayerIndex].pacManEaten();
    }

    ghostEaten(): number {
        const points = this._playerStats[this._currentPlayerIndex].ghostEaten();
        this.updateHighScore();
        return points;
    }

    levelFinished() {
        this.currentPlayerStats.newLevel();
    }
}