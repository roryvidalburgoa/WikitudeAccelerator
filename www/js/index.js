/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        var rb = document.getElementById('restartButton');
        rb.addEventListener('click', this.restartAccelerator.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        this.startAccelerometer();
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    startAccelerometer: function () {
        //accelerometerHandle.start();
        accelerometerHandle.startTimer();
        document.addEventListener(accelerometerHandle.eventName, this.onAccelModeChanged.bind(this), false);
    },
    stopAccelerometer: function () {
        document.removeEventListener(accelerometerHandle.eventName, this.onAccelModeChanged.bind(this), false);
        accelerometerHandle.stopTimer();
    },
    onAccelModeChanged: function (e) {
        var panelId = 'deviceready';
        if (e.detail === verticalMode) {
            console.log("Change to vertical mode.");
            var parentElement = document.getElementById(panelId);
            var isHorizontalElement = parentElement.querySelector('.isHorizontal');
            var isVerticalElement = parentElement.querySelector('.isVertical');

            isHorizontalElement.setAttribute('style', 'display:none;');
            isVerticalElement.setAttribute('style', 'display:block;');
        }
        else if (e.detail === horizontalMode) {
            console.log("Change to horizontal mode.");
            var parentElement = document.getElementById(panelId);
            var isHorizontalElement = parentElement.querySelector('.isHorizontal');
            var isVerticalElement = parentElement.querySelector('.isVertical');

            isHorizontalElement.setAttribute('style', 'display:block;');
            isVerticalElement.setAttribute('style', 'display:none;');
        }
    },
    restartAccelerator: function() {
        this.stopAccelerometer();
        setTimeout(this.startAccelerometer, 10000);
    }
};

app.initialize();
