var horizontalMode = 0;
var verticalMode = 1;

var accelerometerHandle = {
    eventName: "accelModeChanged",
    watchID: null,
    currentMode: verticalMode,
    options: { frequency: 5000 },  // Update every X milli seconds,
    setupBounds: function () {
        var hVals = accelerometerHandle.horizontalValues;
        hVals.x.min = hVals.x.value - hVals.x.threshold;
        hVals.x.max = hVals.x.value + hVals.x.threshold;
        hVals.y.min = hVals.y.value - hVals.y.threshold;
        hVals.y.max = hVals.y.value + hVals.y.threshold;
        hVals.z.min = hVals.z.value - hVals.z.threshold;
        hVals.z.max = hVals.z.value + hVals.z.threshold;
    },
    onSuccess: function onSuccess(acceleration) {
        try {
            // console.log('Acceleration X: ' + acceleration.x + '\n' +
            //     'Acceleration Y: ' + acceleration.y + '\n' +
            //     'Acceleration Z: ' + acceleration.z + '\n' +
            //     'Timestamp: ' + acceleration.timestamp + '\n');

            //if (app.isArchitectWorldLoaded) {
            if (accelerometerHandle.isHorizontal(acceleration)) {
                if (accelerometerHandle.currentMode !== horizontalMode) {
                    accelerometerHandle.currentMode = verticalMode;
                    var event = new CustomEvent(accelerometerHandle.eventName, { detail: horizontalMode });
                    document.dispatchEvent(event);
                    /*
                                        var parentElement = document.getElementById(id);
                    var isHorizontalElement = parentElement.querySelector('.isHorizontal');
                    var isVerticalElement = parentElement.querySelector('.isVertical');

                    isHorizontalElement.setAttribute('style', 'display:block;');
                    isVerticalElement.setAttribute('style', 'display:none;');

                    //app.wikitudePlugin.callJavaScript("World.toggleMapMode();");
                    accelerometerHandle.currentMode = horizontalMode;*/
                }
            } else {
                if (accelerometerHandle.currentMode !== verticalMode) {
                    accelerometerHandle.currentMode = horizontalMode;
                    var event = new CustomEvent(accelerometerHandle.eventName, { detail: verticalMode });
                    document.dispatchEvent(event);
                    /*
                                        var parentElement = document.getElementById(id);
                                        var isHorizontalElement = parentElement.querySelector('.isHorizontal');
                                        var isVerticalElement = parentElement.querySelector('.isVertical');
                    
                                        isHorizontalElement.setAttribute('style', 'display:none;');
                                        isVerticalElement.setAttribute('style', 'display:block;');
                    
                                        //app.wikitudePlugin.callJavaScript("World.toggleMapMode();");
                                        accelerometerHandle.currentMode = verticalMode;*/
                }
            }
            //}
        } catch (error) {
            alert(JSON.stringify(error));
        }
    },
    onError: function onError() {
        alert('accelerometerHandle onError!');
    },
    startTimer: function () {
        accelerometerHandle.setupBounds();
        accelerometerHandle.timerState = "started";
        (function initTimer() {
            if (accelerometerHandle.timerState) {
                navigator.accelerometer.getCurrentAcceleration
                    (
                    function (acceleration) {
                        accelerometerHandle.onSuccess(acceleration);
                    },
                    accelerometerHandle.onError
                    );
                setTimeout(function () {
                    initTimer();
                }, 5000);
            }
        })();
    },
    stopTimer: function () {
        accelerometerHandle.timerState = null;
    },
    start: function () {
        try {
            if (navigator.accelerometer) {
                accelerometerHandle.setupBounds();
                accelerometerHandle.watchID = navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, this.options);
            } else {
                console.warn("accelerometer not available using navigator.");
                alert("accelerometer not available");
            }
        } catch (error) {
            console.error(error);
            console.error("Cannot access the accelerometer");
            alert("Start accelerometer " + JSON.stringify(error));
        }
    },
    stop: function () {
        if (accelerometerHandle.watchID) {
            navigator.accelerometer.clearWatch(accelerometerHandle.watchID);
        }
    },
    horizontalValues: {
        x: { value: 0.0, threshold: 1.0 },
        y: { value: 0.0, threshold: 1.0 },
        z: { value: 9.8, threshold: 1.0 }
    },
    isHorizontal: function (acceleration) {
        var horizontalValues = accelerometerHandle.horizontalValues;
        var res = acceleration.x > horizontalValues.x.min &&
            acceleration.x < horizontalValues.x.max &&
            acceleration.y > horizontalValues.y.min &&
            acceleration.y < horizontalValues.y.max &&
            acceleration.z > horizontalValues.z.min &&
            acceleration.z < horizontalValues.z.max;
        return res;
    }
}
