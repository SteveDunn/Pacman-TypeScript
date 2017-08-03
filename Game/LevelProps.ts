import { FruitItem } from "./FruitItem";
import { IntroCutScene } from "./IntroCutScene";

export class LevelProps {
    constructor(
        public readonly introCutScene: IntroCutScene,           

        public readonly fruit: FruitItem,                       
        public readonly fruitPoints: number,                    

        public readonly pacManSpeedPc: number,                  
        public readonly pacManDotsSpeedPc: number,              

        public readonly ghostSpeedPc: number,                   
        public readonly ghostTunnelSpeedPc: number,             

        public readonly elroy1DotsLeft: number,                 
        public readonly elroy1SpeedPc: number,                  
        public readonly elroy2DotsLeft: number,                 
        public readonly elroy2SpeedPc: number,                  

        public readonly frightPacManSpeedPc: number,            
        public readonly frightPacManDotSpeedPc: number,         

        public readonly frightGhostSpeedPc: number,             
        public readonly frightGhostTime: number,                
        public readonly frightGhostFlashes: number) {           
        }                                                               
}