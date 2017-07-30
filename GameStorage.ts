export class GameStorage {

    static get highScore(): number {
        const value = GameStorage.getCookie("highscore");
        return value === "" ? 0 : value;
    }

    static set highScore(hs: number) {
        GameStorage.setCookie("highscore", hs.toString(), 1000);
    }

    private static setCookie (cname: string, cvalue: string, exdays: number) {
        const date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));

        const expires = `expires=${date.toUTCString()}`;
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    private static getCookie(cname: string): any {
        const name = cname + "=";

        const items = document.cookie.split(";");

        for (let i = 0; i < items.length; i++) {
            let c = items[i];

            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }                                       

        return "";
    }
}                              