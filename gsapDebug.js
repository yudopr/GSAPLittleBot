var mainDiv, mainDivHeader, slider, replayBTN, playToggleBTN, isComplete = false;

function buildController() {
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
        `@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap');
    #mainDiv {
        position: absolute;
        z-index: 9;
        background-color: #fff;
        border: 1px solid #FF5F6D;
        text-align: center;
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        top:100px;
        left: 650px;
        box-shadow: 0 0 5px rgba(160, 79, 104, 0.5);
        overflow:hidden;
        -webkit-user-select: none;  /* Chrome all / Safari all */
        -moz-user-select: none;     /* Firefox all */
        -ms-user-select: none;      /* IE 10+ */
        user-select: none;          /* Likely future */
    }
    hr{
        border:1px solid white;
        margin:3px;
    }
    #mainDivHeader {
        width: 101%;
        align-self: center;
        height: 28px;
        margin-top: 0px;
        padding: 5px;
        cursor: move;
        z-index: 10;
        font-size: 20px;
        color: white;
        background: #FF5F6D;
        font-family: 'Rubik', sans-serif;
        font-weight: 500;
    }
    .item {
        padding: 5px; 
        margin: 3px;
        border:border-radius:20px;
        font-family: 'Rubik', sans-serif;
    }
    .item#current-time{
        text-align:right;
    }
    span{
        color: #3A3A3A;
    }
    input#pauseBtn{
        cursor:pointer;
        background: linear-gradient(to left, rgb(255, 195, 113), rgb(255, 95, 109));
        border: none;
        border-radius: 20px;
        color: white;
    }
    input#playBtn{
        border: none;
        color: white;
        border-radius: 20px;
        background: #4CB8C4;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to left, #3CD3AD, #4CB8C4);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to left, #3CD3AD, #4CB8C4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .pause{
        background: linear-gradient(to left, rgb(255, 195, 113), rgb(255, 95, 109)) !important;
    }
    .play{
        background: linear-gradient(to left, #3CD3AD, #4CB8C4) !important;
    }
    #bgProg{
        width:0%;
        height:100%;        
        position:absolute;
        background: #efefef;  /* fallback for old browsers */
        z-index:-10;
    }
    input[type=range]#progressSlider {
        margin: 4px 0;
        background-color: transparent;
        -webkit-appearance: none;
      }
      input[type=range]#progressSlider:focus {
        outline: none;
      }
      input[type=range]#progressSlider::-webkit-slider-runnable-track {
        background: #3A3A3A;
        border: 0;
        width: 100%;
        height: 10px;
        cursor: pointer;
        border-radius:10px;
      }
      input[type=range]#progressSlider::-webkit-slider-thumb {
        margin-top: -5px;
        width: 20px;
        height: 20px;
        background: #FF5F6D;
        border: 0;
        cursor: pointer;
        -webkit-appearance: none;
        border-radius:50%;
      }
      input[type=range]#progressSlider:focus::-webkit-slider-runnable-track {
        background: #3A3A3A;
      }
      input[type=range]#progressSlider::-moz-range-track {
        background: #353535;
        border: 0;
        width: 100%;
        height: 25.6px;
        cursor: pointer;
      }
      input[type=range]#progressSlider::-moz-range-thumb {
        width: 18px;
        height: 37px;
        background: #FF5F6D;
        border: 0;
        cursor: pointer;
      }
      input[type=range]#progressSlider::-ms-track {
        background: transparent;
        border-color: transparent;
        border-width: 5.7px 0;
        color: transparent;
        width: 100%;
        height: 25.6px;
        cursor: pointer;
      }
      input[type=range]#progressSlider::-ms-fill-lower {
        background: #3A3A3A;
        border: 0;
      }
      input[type=range]#progressSlider::-ms-fill-upper {
        background: #353535;
        border: 0;
      }
      input[type=range]#progressSlider::-ms-thumb {
        width: 18px;
        height: 37px;
        background: rgba(236, 67, 95, 0.93);
        border: 0;
        cursor: pointer;
        margin-top: 0px;
      }
      input[type=range]#progressSlider:focus::-ms-fill-lower {
        background: #3A3A3A;
      }
      input[type=range]#progressSlider:focus::-ms-fill-upper {
        background: #353535;
      }
     @supports (-ms-ime-align:auto) {
        input[type=range]#progressSlider {
          margin: 0;
        }
      }
      `;

    slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = "0";
    slider.id = 'progressSlider';
    slider.className = 'item';

    replayBTN = document.createElement('input');
    replayBTN.type = 'button';
    replayBTN.value = 'Replay';
    replayBTN.id = 'playBtn';
    replayBTN.className = 'item';

    playToggleBTN = document.createElement('input');
    playToggleBTN.type = 'button';
    playToggleBTN.value = 'Pause';
    playToggleBTN.id = 'pauseBtn';
    playToggleBTN.className = 'item play';

    span = document.createElement('span');
    span.className = 'item';
    span.innerHTML = `<p id="current-time" class="item"></p>`;

    var bgProg = document.createElement('div');
    bgProg.id = 'bgProg';

    mainDiv.appendChild(bgProg);
    mainDiv.appendChild(mainDivHeader);
    mainDiv.appendChild(slider);
    mainDiv.appendChild(replayBTN);
    mainDiv.appendChild(playToggleBTN);
    mainDiv.appendChild(span);
    mainDiv.appendChild(itemStyle);
    document.body.appendChild(mainDiv);
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
    }
}

function timelineControl(_controllerTL) {
    buildController();
    /* THE TIMELINE */
    slider.oninput = function () {
        _controllerTL.pause();
        playToggleBTN.value = "Play";
        playToggleBTN.classList.togglePlayStatus(0);
        if (_controllerTL) {
            _controllerTL.progress(this.value / 100);
            setCurrentTime(_controllerTL);
        }
    }
    replayBTN.onclick = function () {
        if (_controllerTL) {
            _controllerTL.play(0);
            slider.value = 0;
            playToggleBTN.value = "Pause";
            playToggleBTN.classList.togglePlayStatus(1);
            isComplete = false;
        }
    }
    playToggleBTN.onclick = function () {
        if (_controllerTL) {
            if (_controllerTL.isActive()) {
                _controllerTL.pause();
                this.value = "Play";
                playToggleBTN.classList.togglePlayStatus(0);
                isComplete = false;
                setCurrentTime(_controllerTL);
            } else {
                if (isComplete) _controllerTL.play(0);
                else {
                    _controllerTL.play();
                    isComplete = false;
                }
                this.value = "Pause";
                playToggleBTN.classList.togglePlayStatus(1);
                setCurrentTime(_controllerTL);
            }
        }
    }

    DOMTokenList.prototype.togglePlayStatus = function(_status){
        if(_status){
            this.remove('pause');
            this.add('play');
        }else{
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
        playToggleBTN.value = "Play";
        playToggleBTN.classList.togglePlayStatus(0);
        isComplete = true;
    }
    _controllerTL.eventCallback("onUpdate", onTLUpdate);
    _controllerTL.eventCallback("onComplete", onTLComplete);
    dragElement(mainDiv);
}


/** 
░██████╗░░██████╗░█████╗░██████╗░  ██╗░░░░░██╗████████╗████████╗██╗░░░░░███████╗  ██████╗░░█████╗░██╗░░██╗
██╔════╝░██╔════╝██╔══██╗██╔══██╗  ██║░░░░░██║╚══██╔══╝╚══██╔══╝██║░░░░░██╔════╝  ██╔══██╗██╔══██╗╚██╗██╔╝
██║░░██╗░╚█████╗░███████║██████╔╝  ██║░░░░░██║░░░██║░░░░░░██║░░░██║░░░░░█████╗░░  ██████╦╝██║░░██║░╚███╔╝░
██║░░╚██╗░╚═══██╗██╔══██║██╔═══╝░  ██║░░░░░██║░░░██║░░░░░░██║░░░██║░░░░░██╔══╝░░  ██╔══██╗██║░░██║░██╔██╗░
╚██████╔╝██████╔╝██║░░██║██║░░░░░  ███████╗██║░░░██║░░░░░░██║░░░███████╗███████╗  ██████╦╝╚█████╔╝██╔╝╚██╗
░╚═════╝░╚═════╝░╚═╝░░╚═╝╚═╝░░░░░  ╚══════╝╚═╝░░░╚═╝░░░░░░╚═╝░░░╚══════╝╚══════╝  ╚═════╝░░╚════╝░╚═╝░░╚═╝

by: G. Yudo Pranolo
created: 2/7/21
**/