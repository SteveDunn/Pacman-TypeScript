interface IKeyEntry {
    [id: string]: number;
}

export class Keyboard {

    static readonly up: number = 38;
    static readonly down: number = 40;
    static readonly left: number = 37;
    static readonly right: number = 39;
    static readonly p: number = 80;
    static readonly enter: number = 13;
    static readonly one: number = 49;
    static readonly two: number = 50;
    static readonly three: number = 51;
    static readonly five: number = 53;

    private _keys = new Array<boolean>();
    private _keyPresses: IKeyEntry;
    private _buttonToKeyCodes: IKeyEntry;

    private _currentKeyDown: number = 0;

    constructor() {
        this._keyPresses = {};
        this._buttonToKeyCodes = {
            "btnUp": Keyboard.up,
            "btnDown": Keyboard.down,
            "btnLeft": Keyboard.left,
            "btnRight": Keyboard.right,
            "btn1Up": Keyboard.one,
            "btn2Up": Keyboard.two,
            "btnCoin": Keyboard.five
        };

        (<any>document).onkeydown = this._keydown;
        (<any>document).onkeyup = this._keyup;

        window.addEventListener('buttonup', this._buttonUp);
        window.addEventListener("buttondown", this._buttonDown);
        window.addEventListener("pan", this._panned);
    }

    isKeyDown(key: number): boolean {
        return this._keys[key];
    }

    private _buttonDown = (e: any) => {
        const keyCode = this.mapButtonToKey(<string>e.detail);
        this._keys[keyCode] = true;
        this._currentKeyDown = keyCode;
    }

    private _panned = (e: any) => {
        const keyCode = this.mapButtonToKey(<string>e.detail);
        this._keys.splice(0);
        this._keys[keyCode] = true;
        this._currentKeyDown = keyCode;
    }

    private _buttonUp = (e: any) => {
        const keyCode = this.mapButtonToKey(<string>e.detail);
        delete this._keys[keyCode];
        this._currentKeyDown = 0;

        this._keyPresses[keyCode.toString()] = window.performance.now();
    }

    private _keydown = (e: any) => {
        this._keys[e.keyCode] = true;
        this._currentKeyDown = e.keyCode;
    }

    private _keyup = (e: any) => {
        delete this._keys[e.keyCode];
        this._currentKeyDown = 0;

        this._keyPresses[e.keyCode.toString()] = window.performance.now();
    }

    wasKeyPressed(keyCode: number): boolean {
        const theEvent = this._keyPresses[keyCode.toString()];
        
        if(theEvent === undefined ) {
            return false;
        }

        this._keyPresses[keyCode] = 0;

        const howLong = window.performance.now() - theEvent;

        return howLong < 100; 
    }

    mapButtonToKey(buttonName: string): any {
        return this._buttonToKeyCodes[buttonName];
    }
}
