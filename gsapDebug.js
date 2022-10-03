var mainDiv, mainDivHeader, slider, replayBTN, playToggleBTN, isComplete = false;

function buildController() {
    loadScript("https://kit.fontawesome.com/b3e2729d01.js", function () {
        mainDiv = document.createElement('div');
        mainDiv.id = "mainDiv";

        itemStyle = document.createElement('style');
        itemStyle.type = 'text/css';
        itemStyle.innerHTML =
            `@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap');
        .button{
            cursor: pointer;
        }
        .clearfix:after {clear: both;}
        #mainDiv, .bgImg, .frost {
            position: fixed;
            z-index: 999;
            text-align: center;
            display: flex;
            flex-direction: row;
            bottom: 0;
            left: 0;
            overflow: hidden;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            width: 100%;
            height:40px;
        }
        .bgImg{
            background-size: cover;
            background-color: #262b38;
        }
        .frost{
            backdrop-filter:blur(10px);
        }
        hr{
            border:1px solid white;
            margin:3px;
        }
        .item {
            padding: 5px;
            width: 1em;
            height: 80%;
            border-radius: 20px;
            font-family: 'Rubik', sans-serif;
            color: #efefef;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            filter:drop-shadow(0 0 5px rgba(0, 0, 0, 0.2));
        }
        .item p{
            width:100%;
        }
        .dropdown{
            width:80px;
        }
        #sliderCont{
            width:90%;
            margin:-5px 0 0;
            height:100%;
            overflow:hidden;
        }
        .timing{
            width:55px;
            text-align:center;
        }
        #bgProg{
            width:0%;
            height:100%;        
            position:absolute;
            background: #efefef;  /* fallback for old browsers */
            z-index:-10;
        }
        #replayBtn{
            margin-right:10px;
        }
        input[type=range]#progressSlider {
            width: 100%;
            height: 100%;
            background-color: transparent;
            -webkit-appearance: none;
            -moz-appearance:none;
        }
        input[type=range]#progressSlider:focus {
            outline: none;
        }
        input[type=range]#progressSlider::-webkit-slider-runnable-track {
            background: #DADADA;
            border: 0;
            width: 100%;
            height: 2px;
            cursor: pointer;
            border-radius:10px;
        }
        input[type=range]#progressSlider::-webkit-slider-thumb {
            margin-top: -6px;
            width: 15px;
            height: 15px;
            background: #ff2bcc;
            border: 3px solid #DADADA;
            cursor: pointer;
            -webkit-appearance: none;
            border-radius:50%;
        }
        input[type=range]#progressSlider:focus::-webkit-slider-runnable-track {
            background: #3A3A3A;
        }
        input[type=range]#progressSlider::-moz-range-track {
            background: #DADADA;
            border: 0;
            width: 100%;
            height: 2px;
            cursor: pointer;
            border-radius:10px;
        }
        input[type=range]#progressSlider::-moz-range-thumb {
            margin-top: -6px;
            width: 10px;
            height: 10px;
            background: #ff2bcc;
            border: 3px solid #DADADA;
            cursor: pointer;
            -webkit-appearance: none;
            border-radius:50%;
        }
        i{
            pointer-events:none;
        }
        `;

        dropdownCont = document.createElement('div');
        dropdownCont.id = 'dropdownCont';
        dropdownCont.className = 'dropdown item button';

        dropdown = document.createElement('select');
        dropdown.id = "timeline";
        dropdown.name = "theTL";
        dropdownCont.appendChild(dropdown);

        sliderCont = document.createElement('div');
        sliderCont.id = 'sliderCont';
        sliderCont.className = 'item';

        slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = "0";
        slider.id = 'progressSlider';
        sliderCont.appendChild(slider);

        replayBTN = document.createElement('div');
        replayBTN.type = 'button';
        replayBTN.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>';
        replayBTN.id = 'replayBtn';
        replayBTN.className = 'item button';

        playToggleBTN = document.createElement('div');
        playToggleBTN.type = 'button';
        playToggleBTN.innerHTML = pauseButton;
        playToggleBTN.id = 'pauseBtn';
        playToggleBTN.className = 'item play button';

        currentTime = document.createElement('div');
        currentTime.id = 'currentTime';
        currentTime.className = 'timing item';
        currentTime.innerHTML = `<p id="current-time">0.00</p>`;

        timeDuration = document.createElement('div');
        timeDuration.id = 'timeDuration';
        timeDuration.className = 'timing item';
        timeDuration.innerHTML = `<p id="duration-time">0.00</p>`;

        bg = document.createElement('div');
        bg.className = 'bgImg';
        bg.style.backgroundImage = `url(images/resolve_bg.jpg)` || `url(images/resolve_bg.png)`;
        frost = document.createElement('div');
        frost.className = 'frost';

        mainDiv.appendChild(dropdownCont);
        mainDiv.appendChild(playToggleBTN);
        mainDiv.appendChild(currentTime);
        mainDiv.appendChild(sliderCont);
        mainDiv.appendChild(timeDuration);
        mainDiv.appendChild(replayBTN);
        mainDiv.appendChild(itemStyle);
        document.body.appendChild(bg);
        document.body.appendChild(frost);
        document.body.appendChild(mainDiv);

    }, 'anonymous');
}

function timelineControl() {
    var select = document.querySelector('#timeline');
    if (select.innerHTML.length <= 0) {
        select.timelines = [];
        for (const theTL in this) {
            if (Object.hasOwnProperty.call(this, theTL)) {
                const element = this[theTL];
                if (element instanceof TimelineMax) {
                    select.options[select.options.length] = new Option(theTL, select.options.length);
                    select.timelines.push(element);
                }
            }
        }
        timelineEvents(select.timelines[0]);
        select.addEventListener('change', function () {
            timelineEvents(select.timelines[this.value]);
            select.timelines[this.value].play(0);
        })
    }
}

function timelineEvents(_controllerTL) {
    console.log(_controllerTL);
    /* THE TIMELINE */
    document.querySelector('#duration-time').innerHTML = _controllerTL.duration().toFixed(2);
    slider.oninput = function () {
        _controllerTL.pause();
        playToggleBTN.innerHTML = playButton;
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
            playToggleBTN.innerHTML = pauseButton;
            playToggleBTN.classList.togglePlayStatus(1);
            isComplete = false;
        }
    }
    playToggleBTN.onclick = function () {
        if (_controllerTL) {
            if (_controllerTL.isActive()) {
                _controllerTL.pause();
                this.innerHTML = playButton;
                playToggleBTN.classList.togglePlayStatus(0);
                isComplete = false;
                setCurrentTime(_controllerTL);
            } else {
                if (isComplete) _controllerTL.play(0);
                else {
                    _controllerTL.play();
                    isComplete = false;
                }
                this.innerHTML = pauseButton;
                playToggleBTN.classList.togglePlayStatus(1);
                setCurrentTime(_controllerTL);
            }
        }
    }

    DOMTokenList.prototype.togglePlayStatus = function (_status) {
        if (_status) {
            this.remove('pause');
            this.add('play');
        } else {
            this.remove('play');
            this.add('pause');
        }
    }

    function setCurrentTime(_TL) {
        document.getElementById('current-time').innerHTML = _TL.time().toFixed(2);
    }

    function onTLUpdate() {
        slider.value = _controllerTL.progress().toFixed(2) * 100;
        setCurrentTime(_controllerTL);
    }

    function onTLComplete() {
        playToggleBTN.innerHTML = playButton;
        playToggleBTN.classList.togglePlayStatus(0);
        isComplete = true;
    }
    _controllerTL.eventCallback("onUpdate", onTLUpdate);
    _controllerTL.eventCallback("onComplete", onTLComplete);
}
buildController();
let playButton = `<i class="fa-solid fa-play"></i>`;
let pauseButton = `<i class="fa-solid fa-pause"></i>`;
/** 


 ██████  ███████  █████  ██████      ██████  ███████ ██████  ██    ██  ██████  
██       ██      ██   ██ ██   ██     ██   ██ ██      ██   ██ ██    ██ ██       
██   ███ ███████ ███████ ██████      ██   ██ █████   ██████  ██    ██ ██   ███ 
██    ██      ██ ██   ██ ██          ██   ██ ██      ██   ██ ██    ██ ██    ██ 
 ██████  ███████ ██   ██ ██          ██████  ███████ ██████   ██████   ██████  
                                                                               
                                                                                                                                                           
by: G. Yudo
created: 
v1: 2/7/21
v2: 3/10/22
**/