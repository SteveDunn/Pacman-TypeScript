var loadState = new function () {
    var self = this;

    var pacManWebModulesLoadedCount = 0;
    var scriptsFinished = false;
    var assetsFinished = false;

    this.__finishedLoading = false;

    this.assetLoaded = function (assetName, percentage) {
        var p = document.getElementById("progress-bar-assets-percentage");

        p.style.width = percentage + "%";
        var scriptNameSpan = document.getElementById("progress-assetname");
        scriptNameSpan.innerText = assetName;
    };

    this.scriptLoaded = function (moduleName) {
        var p = document.getElementById("progress-bar-scripts-percentage");

        pacManWebModulesLoadedCount = pacManWebModulesLoadedCount + 1;

        var percentage = (pacManWebModulesLoadedCount / 93) * 100;

        console.info(pacManWebModulesLoadedCount);

        p.style.width = percentage + "%";

        var scriptNameSpan = document.getElementById("progress-scriptname");
        scriptNameSpan.innerText = moduleName;
    }

    this.scriptsFinishedLoading = function() {
        scriptsFinished = true;
    };

    this.waitForFinish = function () {
        setTimeout(this.checkFinished);
    };

    this.checkFinished = function () {
        assetsFinished =
            document.getElementById("progress-bar-assets-percentage").style.width === "100%";

        if (scriptsFinished === false || assetsFinished === false) {
            setTimeout(self.checkFinished);
        } else {
            document.getElementById("loader").hidden = "true";
            document.getElementById("controlPanel").style.visibility = "visible";
            console.info("setting __finishedLoading!");
            self.__finishedLoading = true;
        }
    };
}
