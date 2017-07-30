import { SoundName } from "./SoundName";
import { MyAudio } from "./MyAudio";
import {SoundLookup} from "./SoundLookup";

export class SoundLoader {
    private _loadedCount = 0;
    private readonly _itemsToLoad = 16;

    private readonly _sounds: SoundLookup;

    constructor(
        private readonly whenEachSoundLoaded: (soundName: string, percentage: number) => void) {

        this._sounds = {};

        this._sounds[SoundName.CoinInserted] = this.loadAudio("snd/coin.mp3");
        this._sounds[SoundName.CutScene] = this.loadAudio("snd/cutscene.mp3");
        this._sounds[SoundName.PacManDying] = this.loadAudio("snd/dying.mp3");
        this._sounds[SoundName.ExtraLife] = this.loadAudio("snd/extra_life.mp3");
        this._sounds[SoundName.Frightened] = this.loadAudio("snd/frightened.mp3");
        this._sounds[SoundName.FruitEaten] = this.loadAudio("snd/fruit_eaten.mp3");
        this._sounds[SoundName.GhostEaten] = this.loadAudio("snd/ghost_eaten.mp3");
        this._sounds[SoundName.GhostEyes] = this.loadAudio("snd/ghost_eyes.mp3");
        this._sounds[SoundName.Munch1] = this.loadAudio("snd/munch1.mp3");
        this._sounds[SoundName.Munch2] = this.loadAudio("snd/munch2.mp3");
        this._sounds[SoundName.PlayerStart] = this.loadAudio("snd/player_start.mp3");
        this._sounds[SoundName.Siren1] = this.loadAudio("snd/siren1.mp3");
        this._sounds[SoundName.Siren2] = this.loadAudio("snd/siren2.mp3");
        this._sounds[SoundName.Siren3] = this.loadAudio("snd/siren3.mp3");
        this._sounds[SoundName.Siren4] = this.loadAudio("snd/siren4.mp3");
        this._sounds[SoundName.Siren5] = this.loadAudio("snd/siren5.mp3");
    }

    getSound(name: SoundName) {
        return this._sounds[name];
    }

    loadAudio(path: string): MyAudio {

        const audio = new MyAudio(path, () => {
            const pc = (++this._loadedCount / this._itemsToLoad) * 100;
            this.whenEachSoundLoaded(path, pc);
        });

        return audio;
    }
}