var mainDiv, mainDivHeader, slider, replayBTN, playToggleBTN, isComplete = false;

function timelineControl(_controllerTL) {
    /* THE TIMELINE */
    slider.oninput = function () {
        _controllerTL.pause();
        playToggleBTN.classList.togglePlayStatus(0);
        if (_controllerTL) {
            _controllerTL.progress(this.value / 100);
            setCurrentTime(_controllerTL);
        }
        isComplete = !(_controllerTL.time() < _controllerTL.duration());
    }
    replayBTN.onclick = function () {
        if (_controllerTL) {
            _controllerTL.play(0);
            slider.value = 0;
            playToggleBTN.classList.togglePlayStatus(1);
            isComplete = false;
        }
    }
    playToggleBTN.onclick = function () {
        if (_controllerTL) {
            if (_controllerTL.isActive()) {
                _controllerTL.pause();
                playToggleBTN.classList.togglePlayStatus(0);
                isComplete = false;
                setCurrentTime(_controllerTL);
            } else {
                if (isComplete) _controllerTL.play(0);
                else {
                    _controllerTL.play();
                    isComplete = false;
                }
                playToggleBTN.classList.togglePlayStatus(1);
                setCurrentTime(_controllerTL);
            }
        }
    }

    DOMTokenList.prototype.togglePlayStatus = function (_status) {
        if (_status) {
            playToggleBTN.innerHTML = `<i class="fas fa-pause"></i>`;
            this.remove('pause');
            this.add('play');
        } else {
            playToggleBTN.innerHTML = `<i class="fas fa-play"></i>`;
            this.remove('play');
            this.add('pause');
        }
    }

    function setCurrentTime(_TL) {
        document.getElementById('current-time').innerHTML = _TL.time().toFixed(2) + '/' + _TL.duration().toFixed(2);
    }

    function onTLUpdate() {
        slider.value = _controllerTL.progress().toFixed(2) * 100;
        setCurrentTime(_controllerTL);
        gsap.to('#bgProg', {
            duration: 0.2,
            width: (_controllerTL.progress().toFixed(2) * 100) + '%'
        });
    }

    function onTLComplete() {
        playToggleBTN.classList.togglePlayStatus(0);
        isComplete = true;
    }
    _controllerTL.eventCallback("onUpdate", onTLUpdate);
    _controllerTL.eventCallback("onComplete", onTLComplete);
    dragElement(mainDiv);
}

function buildController() {
    loadScript('https://kit.fontawesome.com/04ce4d8375.js', function () {
        mainDiv = document.createElement('div');
        mainDiv.id = "mainDiv";

        mainDivHeader = document.createElement('div');
        mainDivHeader.id = "mainDivHeader";
        /* HEADER DIV STYLING */
        mainDivHeader.innerHTML = 'drag me';
        mainDivHeader.className = 'item';

        itemStyle = document.createElement('style');
        itemStyle.type = 'text/css';
        itemStyle.innerHTML =
            `
            @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap');
            #mainDiv {
                position: absolute;
                z-index: 9;
                background-color: #fff;
                border: 1px solid #FF5F6D;
                text-align: center;
                display: flex;
                flex-direction: column;
                border-radius: 15px;
                top: 260px;
                left: 650px;
                box-shadow: 0 0 5px rgba(58, 58, 58, 0.5);
                overflow: hidden;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none
            }
            
            .flex-container {
                display: flex
            }
            
            hr {
                border: 1px solid #fff;
                margin: 3px
            }
            
            #mainDivHeader {
                width: 101%;
                align-self: center;
                height: 28px;
                margin-top: 0;
                padding: 5px;
                cursor: move;
                z-index: 10;
                font-size: 20px;
                color: #fff;
                background: #FF5F6D;
                font-family: 'Rubik', sans-serif;
                font-weight: 500
            }
            
            .item {
                padding: 5px;
                margin: 3px;
                font-family: 'Rubik', sans-serif
            }
            
            .item:not(#progressSlider):not(#time-duration):not(#current-time) {
                width: 100%
            }
            
            #current-time {
                text-align: right
            }
            
            span {
                color: #3A3A3A
            }
            
            #playToggleBTN {
                cursor: pointer;
                background: linear-gradient(to left, #ffc371, #ff5f6d);
                border: none;
                border-radius: 20px;
                color: #fff;
                transition: .3s transform ease-out
            }
            
            #replayBTN {
                border: none;
                color: #fff;
                border-radius: 20px;
                background: #4CB8C4;
                background: -webkit-linear-gradient(to left, #3CD3AD, #4CB8C4);
                background: linear-gradient(to left, #3CD3AD, #4CB8C4);
                cursor: pointer;
                transition: .3s transform ease-out
            }
            
            #replayBTN:hover,
            #playToggleBTN:hover {
                transform: scale(0.95) translate3d(0, 0, 0)
            }
            
            .pause {
                background: linear-gradient(to left, #ffc371, #ff5f6d) !important
            }
            
            .play {
                background: linear-gradient(to left, #3CD3AD, #4CB8C4) !important
            }
            
            #bgProg {
                width: 0;
                height: 100%;
                position: absolute;
                background: #efefef;
                z-index: -10
            }
            
            #progressSlider {
                margin: 4px 0;
                background-color: transparent;
                -moz-appearance: none;
                -webkit-appearance: none
            }
            
            #progressSlider:focus {
                outline: none
            }
            
            #progressSlider::-webkit-slider-runnable-track {
                background: #3A3A3A;
                border: 0;
                width: 100%;
                height: 10px;
                cursor: pointer;
                border-radius: 10px
            }
            
            #progressSlider::-webkit-slider-thumb {
                margin-top: -5px;
                width: 20px;
                height: 20px;
                background: #FF5F6D;
                border: 0;
                cursor: pointer;
                -moz-appearance: none;
                -webkit-appearance: none;
                border-radius: 50%
            }
            
            #progressSlider:focus::-webkit-slider-runnable-track {
                background: #3A3A3A
            }
            
            #progressSlider::-moz-range-track {
                background: #353535;
                border: 0;
                width: 100%;
                height: 25.6px;
                cursor: pointer
            }
            
            #progressSlider::-moz-range-thumb {
                width: 18px;
                height: 37px;
                background: #FF5F6D;
                border: 0;
                cursor: pointer
            }
            
            #progressSlider::-ms-track {
                background: transparent;
                border-color: transparent;
                border-width: 5.7px 0;
                color: transparent;
                width: 100%;
                height: 25.6px;
                cursor: pointer
            }
            
            #progressSlider::-ms-fill-lower {
                background: #3A3A3A;
                border: 0
            }
            
            #progressSlider::-ms-fill-upper {
                background: #353535;
                border: 0
            }
            
            #progressSlider::-ms-thumb {
                width: 18px;
                height: 37px;
                background: rgba(236, 67, 95, 0.9);
                border: 0;
                cursor: pointer;
                margin-top: 0
            }
            
            #progressSlider:focus::-ms-fill-lower {
                background: #3A3A3A
            }
            
            #progressSlider:focus::-ms-fill-upper {
                background: #353535
            }
            `;

        slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = "0";
        slider.id = 'progressSlider';
        slider.className = 'item';

        buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex-container';
        buttonContainer.id = 'buttonContainer';

        replayBTN = document.createElement('div');
        replayBTN.innerHTML = '<i class="fas fa-sync-alt" style="color:white"></i>';
        replayBTN.id = 'replayBTN';
        replayBTN.className = 'item';

        playToggleBTN = document.createElement('div');
        playToggleBTN.innerHTML = '<i class="fas fa-pause"></i>';
        playToggleBTN.id = 'playToggleBTN';
        playToggleBTN.className = 'item play';

        span = document.createElement('span');
        span.id = 'time-duration';
        span.className = 'item';
        span.innerHTML = `<p id="current-time" class="item"></p>`;

        var bgProg = document.createElement('div');
        bgProg.id = 'bgProg';

        mainDiv.appendChild(bgProg);
        mainDiv.appendChild(mainDivHeader);
        mainDiv.appendChild(slider);
        buttonContainer.appendChild(replayBTN);
        buttonContainer.appendChild(playToggleBTN);
        mainDiv.appendChild(buttonContainer);
        mainDiv.appendChild(span);
        mainDiv.appendChild(itemStyle);
        document.body.appendChild(mainDiv);

        gsap.set('.fas', {
            color: 'white'
        });
    });
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "Header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        gsap.to(mainDiv, {
            duration: 0.3,
            scale: 0.9,
            boxShadow: '0 0 10px rgba(58, 58, 58, 1)'
        });
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        gsap.to(mainDiv, {
            duration: 0.3,
            scale: 1,
            boxShadow: '0 0 5px rgba(58, 58, 58, 0.3)'
        });
    }
}

buildController();

/** 
░██████╗░░██████╗░█████╗░██████╗░  ██╗░░░░░██╗████████╗████████╗██╗░░░░░███████╗  ██████╗░░█████╗░████████╗
██╔════╝░██╔════╝██╔══██╗██╔══██╗  ██║░░░░░██║╚══██╔══╝╚══██╔══╝██║░░░░░██╔════╝  ██╔══██╗██╔══██╗╚══██╔══╝
██║░░██╗░╚█████╗░███████║██████╔╝  ██║░░░░░██║░░░██║░░░░░░██║░░░██║░░░░░█████╗░░  ██████╦╝██║░░██║░░░██║░░░
██║░░╚██╗░╚═══██╗██╔══██║██╔═══╝░  ██║░░░░░██║░░░██║░░░░░░██║░░░██║░░░░░██╔══╝░░  ██╔══██╗██║░░██║░░░██║░░░
╚██████╔╝██████╔╝██║░░██║██║░░░░░  ███████╗██║░░░██║░░░░░░██║░░░███████╗███████╗  ██████╦╝╚█████╔╝░░░██║░░░
░╚═════╝░╚═════╝░╚═╝░░╚═╝╚═╝░░░░░  ╚══════╝╚═╝░░░╚═╝░░░░░░╚═╝░░░╚══════╝╚══════╝  ╚═════╝░░╚════╝░░░░╚═╝░░░

by: G. Yudo
created: 2/7/21
**/

/* UTILITIES FUNCTION */
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.async = !0;
    script.src = url;
    var entry = document.getElementsByTagName('head')[0];
    entry.parentNode.insertBefore(script, entry);
    script.onload = script.onreadystatechange = function () {
        var readyState = script.readyState;
        if (!readyState || /complete|loaded/.test(script.readyState)) {
            if (typeof callback === "function") callback();
            script.onload = null;
            script.onreadystatechange = null
        }
    }
}