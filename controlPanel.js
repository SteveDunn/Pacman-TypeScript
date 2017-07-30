var controlPanel = new function () {
    var self = this;

    this._currentlyDown = [];

    this.setVolume = function (val) {
        var pc = val / 100;

        console.info("setting master volume to " + pc);

        this.setCookie("vol", val, 365);

        window.dispatchEvent(new CustomEvent('volumeChanged', { 'detail': pc }));
    }

    this.hide = function () {
        console.info("Hiding control panel");

        var ele = document.getElementById("controlPanel");
        ele.style.opacity = 0;

        ele = document.getElementById("gameDiv");
        ele.style.opacity = 1;
    }

    this.show = function () {
        console.info("Showing control panel");

        var ele = document.getElementById("btnCoinCell");
        ele.style.webkitAnimationPlayState = "running";

        ele = document.getElementById("cell1Up");
        ele.style.webkitAnimationPlayState = "paused";

        ele = document.getElementById("cell2Up");
        ele.style.webkitAnimationPlayState = "paused";

        ele = document.getElementById("controlPanel");
        ele.style.webkitAnimationPlayState = "running";
        ele.style.opacity = 1;

        ele = document.getElementById("gameDiv");
        ele.style.opacity = .85;

        ele = document.getElementById("btn1Up");
        ele.style.opacity = .5;

        ele = document.getElementById("btn2Up");
        ele.style.opacity = .5;
    }

    this.updateWithCredits = function (credits) {

        self.set1upOpacity(.5);
        self.set2upOpacity(.5);

        if (credits >= 1) {
            ele = document.getElementById("cell1Up");
            ele.style.webkitAnimationPlayState = "running";

            self.set1upOpacity(1);
        }

        if (credits >= 2) {
            ele = document.getElementById("cell2Up");
            ele.style.webkitAnimationPlayState = "running";
            self.set2upOpacity(1);
        }
    }

    this.set1upOpacity = function (o) {
        self.setOpacity("btn1Up", o);
        self.setOpacity("1upIcon1", o);
        self.setOpacity("1upIcon2", o);
    }

    this.set2upOpacity = function (o) {
        self.setOpacity("btn2Up", o);
        self.setOpacity("2upIcon1", o);
        self.setOpacity("2upIcon2", o);
    }

    this.setOpacity = function (name, o) {
        var ele = document.getElementById(name);
        ele.style.opacity = o;
    }

    this.initVolume = function () {
        var control = document.getElementById("vol-control");

        var vol = this.getCookie("vol");
        if (vol === "") {
            vol = 0;
        }

        control.value = vol;

        self.setVolume(vol);

        control.addEventListener("change", function (val) {
            self.setVolume(val.target.value);
        });

        control.addEventListener("input", function (val) {
            self.setVolume(val.target.value);
        });
    }

    this.initialise = function () {
        ["btn1Up", "btn2Up"].forEach(function (item) {
            var btn = document.getElementById(item);

            btn.classList.add("yellowButton");
            self.addEvents(btn);
        });

        var btn = document.getElementById("btnCoin");

        self.addEvents(btn);

        // self.initVolume();


        var hammertime = new Hammer(window);

        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        hammertime.on('panleft panright panup pandown', function (ev) {
            var dir = "";
            if (ev.type == "panleft") {
                dir = "btnLeft";
            } else if (ev.type == "panright") {
                dir = "btnRight";
            } else if (ev.type == "panup") {
                dir = "btnUp";
            } else if (ev.type == "pandown") {
                dir = "btnDown";
            }
            if (dir !== "") {
                self._currentlyDown[dir] = true;

                window.dispatchEvent(new CustomEvent('pan', { 'detail': dir }));
            }

            console.log(ev.type);
            console.log(dir);
        });

        self.showHideSwipeLegend();
    }

    this.showHideSwipeLegend = function () {
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            document.getElementById("swipeLegend").style.visibility = "visible";
        }
        else {
            document.getElementById("swipeLegend").style.visibility = "hidden";
        }
    }

    this.isUpPressed = function () {
        return self._currentlyDown["btnUp"] == true;
    }

    this.isDownPressed = function () {
        return self._currentlyDown["btnDown"] == true;
    }

    this.isLeftPressed = function () {
        return self._currentlyDown["btnLeft"] == true;
    }

    this.isRightPressed = function () {
        return self._currentlyDown["btnRight"] == true;
    }

    this.is1UpPressed = function () {
        return self._currentlyDown["btn1Up"] == true;
    }

    this.is2UpPressed = function () {
        return self._currentlyDown["btn2Up"] == true;
    }

    this.isCoinPressed = function () {
        return self._currentlyDown["btn1Coin"] == true;
    }

    this.addEvents = function (btn) {
        btn.addEventListener("mousedown", self.mouseDown);
        btn.addEventListener("mouseup", self.mouseUp);
        btn.addEventListener("touchstart", self.touchStart);
        btn.addEventListener("touchend", self.touchEnd);
    }

    this.mouseUp = function (event) {
        if (event.target.id === "") {
            return;
        }
        window.dispatchEvent(new CustomEvent('buttonup', { 'detail': event.target.id }));

        self._currentlyDown[event.target.id] == false;
        var att = event.target.getAttribute("data-pressedClass");
        event.target.classList.remove(att);
        console.info("mouse up!");                                   
    };

    this.mouseDown = function (event) {
        window.dispatchEvent(new CustomEvent('buttondown', { 'detail': event.target.id }));
        self._currentlyDown[event.target.id] == true;
        var att = event.target.getAttribute("data-pressedClass");
        event.target.classList.add(att);
        console.info("mouse down!");
    };

    this.touchStart = function (event) {
        window.dispatchEvent(new CustomEvent('buttondown', { 'detail': event.target.id }));
        self._currentlyDown[event.target.id] == true;
        event.preventDefault();
        var att = event.target.getAttribute("data-pressedClass");
        event.target.classList.add(att);
        console.info("touch start!");
    };

    this.touchEnd = function (event) {
        window.dispatchEvent(new CustomEvent('buttonup', { 'detail': event.target.id }));
        self._currentlyDown[event.target.id] == false;
        event.preventDefault();
        var att = event.target.getAttribute("data-pressedClass");
        event.target.classList.remove(att);
        console.info("mouse end!");
    }

    this.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    this.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}