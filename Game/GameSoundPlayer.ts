import { MyAudio, SoundLoader, SoundName } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";
import { GhostState } from "../Ghosts/_exports";

declare var Howler: any;

export class GameSoundPlayer {
    private readonly _sirens: MyAudio[];
    private readonly _frightened: MyAudio;
    private readonly _ghostEyes: MyAudio;

    constructor(private readonly _loader: SoundLoader) {

        if (_loader == undefined) {
            throw new Error("Loader is undefined");
        }

        window.addEventListener("volumeChanged", this._volumeChanged);

        this._frightened = _loader.getSound(SoundName.Frightened);
        this._ghostEyes = _loader.getSound(SoundName.GhostEyes);

        this._sirens = [
            _loader.getSound(SoundName.Siren1),
            _loader.getSound(SoundName.Siren2),
            _loader.getSound(SoundName.Siren3),
            _loader.getSound(SoundName.Siren4),
            _loader.getSound(SoundName.Siren5)
        ];

        this._frightened.loop = true;
        this._ghostEyes.loop = true;

        this._ghostEyes.mute();
        this._ghostEyes.play();

        this._sirens.forEach(s => {
            s.loop = true;
            s.volume = .5;
        });
    }

    private _volumeChanged = (e: any) => {
        const vol = <number>e.detail;

        Howler.volume(vol);
    }


    reset() {
        this._sirens.forEach(s => s.stop());
        this._ghostEyes.stop();
        this._frightened.stop();
    }

    update() {
        const currentPlayerStats = MainWindow.gameStats.currentPlayerStats;
        const thereAreEyes = MainWindow.actors.ghosts.some(g => g.state === GhostState.Eyes);
        const frightSession = currentPlayerStats.frightSession;

        const handleFright = () => {
            if (thereAreEyes) {
                return;
            }

            if (frightSession != undefined) {
                const volume = frightSession.isFinished ? .5 : 0;

                this._sirens.forEach(s=>s.volume = volume);

                if (frightSession.isFinished) {
                    this._frightened.stop();
                }
            }
        };

        const handleSiren = (pillsEaten: number) => {
            if (thereAreEyes) {
                return;
            }

            let level: number;

            if (pillsEaten < 117) {
                level = 0;
            } else if (pillsEaten < 180) {
                level = 1;
            } else if (pillsEaten < 212) {
                level = 2;
            } else if (pillsEaten < 230) {
                level = 3;
            } else {
                level = 4;
            }

            this.playSiren(level);
        };

        const handleEyes = () => {
            if (thereAreEyes === false) {
                this._ghostEyes.stop();
            } else {
                this._ghostEyes.play();
            }
        };

        if (currentPlayerStats != null) {
            handleFright();
            handleSiren(currentPlayerStats.levelStats.pillsEaten);
            handleEyes();
        }
    }

    muteAll() {
        Howler.mute(true);
    }

    unmuteAll() {
        Howler.mute(false);
    }

    powerPillEaten(): any {
        this.play(SoundName.Frightened);
    }

    fruitEaten(): any {
        this.play(SoundName.FruitEaten);
    }

    ghostEaten(): any {
        this.play(SoundName.GhostEaten);
        this.play(SoundName.GhostEyes);        
    }

    gotExtraLife(): any {
        this.play(SoundName.ExtraLife);        
    }

    cutScene(): any {
        this.play(SoundName.CutScene);
    }

    pacManDying(): any {
        this.play(SoundName.PacManDying);
    }

    playerStart(): any {
        this.play(SoundName.PlayerStart);        
    }

    coinInsterted(): any {
        this.tryPlay(SoundName.CoinInserted);        
    }

    munch1(): any {
        this.play(SoundName.Munch1);        
    }

    munch2(): any {
        this.play(SoundName.Munch2);        
    }

    private play(soundName: SoundName) {
        const audio = this._loader.getSound(soundName);
        if (audio.isLoaded) {
            audio.play();
        }
    }

    private tryPlay(soundName: SoundName) {
        const audio = this._loader.getSound(soundName);
        if (audio.isLoaded) {
            audio.tryPlay();
        }
    }

    private playSiren(level: number) {
        for (let i = 0; i < this._sirens.length; i++) {
            const siren = this._sirens[i];

            if (i == level) {
                if (!siren.isPlaying) {
                    siren.play();
                }
            } else {
                siren.stop();
            }
        }
    }
}
