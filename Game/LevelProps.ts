import { FruitItem } from "./FruitItem";
import { IntroCutScene } from "./IntroCutScene";

export class LevelProps {
    constructor(
        public readonly introCutScene: IntroCutScene,           // used

        public readonly fruit: FruitItem,                       // used
        public readonly fruitPoints: number,                    // used

        public readonly pacManSpeedPc: number,                  // used
        public readonly pacManDotsSpeedPc: number,              // used

        public readonly ghostSpeedPc: number,                   // used
        public readonly ghostTunnelSpeedPc: number,             // used

        public readonly elroy1DotsLeft: number,                 // 
        public readonly elroy1SpeedPc: number,                  // 
        public readonly elroy2DotsLeft: number,                 // 
        public readonly elroy2SpeedPc: number,                  // 

        public readonly frightPacManSpeedPc: number,            // used
        public readonly frightPacManDotSpeedPc: number,         // used

        public readonly frightGhostSpeedPc: number,             // used
        public readonly frightGhostTime: number,                // used
        public readonly frightGhostFlashes: number) {           // used
        }
}