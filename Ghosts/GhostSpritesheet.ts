import { FramePair, Point } from "../Core/_exports";
import { EyesSpritesheetInfo } from "./EyesSpritesheetInfo";
import { FrightenedSpritesheet } from "./FrightenedSpritesheet";
import { GhostSpritesheetInfo } from "./GhostSpritesheetInfo";
import { GhostNickname } from "./GhostNickname";

export class GhostSpritesheet {
    entries: GhostSpritesheetInfo[];
    frightened: FrightenedSpritesheet;
    eyes: EyesSpritesheetInfo;

    constructor() {
        const left = 457;

        let x = left + (8 * 16);
        this.frightened = new FrightenedSpritesheet(
            new FramePair(new Point(x, 64), new Point(x += 16, 64)),
            new FramePair(new Point(x += 16, 64), new Point(x + 16, 64)));

        x = left + (8 * 16);
        this.eyes = new EyesSpritesheetInfo(new Point(x, 64 + 16));

        this.entries = new Array<GhostSpritesheetInfo>();
        this.entries[GhostNickname.Blinky] = new GhostSpritesheetInfo("Blinky", new Point(left, 64));
        this.entries[GhostNickname.Pinky] = new GhostSpritesheetInfo("Pinky", new Point(left, 64 + 16));
        this.entries[GhostNickname.Inky] = new GhostSpritesheetInfo("Inky", new Point(left, 64 + 32));
        this.entries[GhostNickname.Clyde] = new GhostSpritesheetInfo("Clyde", new Point(left, 64 + 48));
    }

    getEntry(nickname: GhostNickname): GhostSpritesheetInfo {
        const entry: GhostSpritesheetInfo = this.entries[nickname];
        return entry;
    }

    getFrightened(): FrightenedSpritesheet {
        return this.frightened;
    }
}
