/**
 * GSAP Debug Controller - ES6 Class Version
 *
 * ██████  ███████  █████  ██████      ██████  ███████ ██████  ██    ██  ██████
 *██       ██      ██   ██ ██   ██     ██   ██ ██      ██   ██ ██    ██ ██
 *██   ███ ███████ ███████ ██████      ██   ██ █████   ██████  ██    ██ ██   ███
 *██    ██      ██ ██   ██ ██          ██   ██ ██      ██   ██ ██    ██ ██    ██
 * ██████  ███████ ██   ██ ██          ██████  ███████ ██████   ██████   ██████
 *
 *
 * by: G. Yudo
 * created:
 * v1: 2/7/21
 * v2: 3/10/22
 * v3: 5/6/25 - Added timeline sorting by number of animated elements
 * v4: ES6 Class refactor
 */

class GSAPDebug {
    constructor() {
        this.mainDiv = null;
        this.slider = null;
        this.replayBTN = null;
        this.playToggleBTN = null;
        this.isComplete = false;
        this.loadScript = null;
        this.controlledTimeline = null;

        this.playButton = `<i class="fa-solid fa-play"></i>`;
        this.pauseButton = `<i class="fa-solid fa-pause"></i>`;

        this.init();
    }

    init() {
        this.buildController();
    }

    loadExternalScript(url, callback, crossOrigin = null) {
        const script = document.createElement("script");
        script.async = true;
        if (crossOrigin) script.crossOrigin = crossOrigin;
        script.src = url;

        const head = document.getElementsByTagName("head")[0];
        head.insertBefore(script, head.firstChild);

        script.onload = script.onreadystatechange = () => {
            if (script.readyState && !/complete|loaded/.test(script.readyState)) return;
            if (typeof callback === "function") callback();
            script.onload = null;
            script.onreadystatechange = null;
        };
    }

    createStyles() {
        const itemStyle = document.createElement('style');
        itemStyle.type = 'text/css';
        itemStyle.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap');
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
                width:auto;
                min-width:80px;
                max-width:200px;
            }
            #timeline {
                width:100%;
                overflow:visible;
                background:transparent;
                color:#efefef;
                border:none;
                outline:none;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                padding-right:15px;
                cursor:pointer;
            }
            #timeline option {
                background:#262b38;
                color:#efefef;
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
            #refreshBtn{
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
        return itemStyle;
    }

    createDropdown() {
        const dropdownCont = document.createElement('div');
        dropdownCont.id = 'dropdownCont';
        dropdownCont.className = 'dropdown item button';

        const dropdown = document.createElement('select');
        dropdown.id = "timeline";
        dropdown.name = "theTL";
        dropdown.title = "Select timeline to control";
        dropdownCont.appendChild(dropdown);

        return dropdownCont;
    }

    createSlider() {
        const sliderCont = document.createElement('div');
        sliderCont.id = 'sliderCont';
        sliderCont.className = 'item';

        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = 0;
        this.slider.max = 100;
        this.slider.value = "0";
        this.slider.id = 'progressSlider';
        this.slider.title = 'Scrub timeline position';
        sliderCont.appendChild(this.slider);

        return sliderCont;
    }

    createReplayButton() {
        this.replayBTN = document.createElement('div');
        this.replayBTN.type = 'button';
        this.replayBTN.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>';
        this.replayBTN.id = 'replayBtn';
        this.replayBTN.className = 'item button';
        this.replayBTN.title = 'Replay timeline from start';

        return this.replayBTN;
    }

    createPlayToggleButton() {
        this.playToggleBTN = document.createElement('div');
        this.playToggleBTN.type = 'button';
        this.playToggleBTN.innerHTML = this.pauseButton;
        this.playToggleBTN.id = 'pauseBtn';
        this.playToggleBTN.className = 'item play button';
        this.playToggleBTN.title = 'Play/Pause timeline';

        return this.playToggleBTN;
    }

    createRefreshButton() {
        const refreshBTN = document.createElement('div');
        refreshBTN.type = 'button';
        refreshBTN.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i>';
        refreshBTN.id = 'refreshBtn';
        refreshBTN.className = 'item button';
        refreshBTN.title = 'Refresh timeline list';

        refreshBTN.onclick = () => {
            this.initializeTimelineControl();
        };

        return refreshBTN;
    }

    createTimeDisplays() {
        const currentTime = document.createElement('div');
        currentTime.id = 'currentTime';
        currentTime.className = 'timing item';
        currentTime.title = 'Current timeline time';
        currentTime.innerHTML = `<p id="current-time">0.00</p>`;

        const timeDuration = document.createElement('div');
        timeDuration.id = 'timeDuration';
        timeDuration.className = 'timing item';
        timeDuration.title = 'Total timeline duration';
        timeDuration.innerHTML = `<p id="duration-time">0.00</p>`;

        return { currentTime, timeDuration };
    }

    createBackgroundElements() {
        const bg = document.createElement('div');
        bg.className = 'bgImg';

        const frost = document.createElement('div');
        frost.className = 'frost';

        return { bg, frost };
    }

    buildController() {
        if (this.loadScript) {
            this.loadScript("https://kit.fontawesome.com/b3e2729d01.js", () => {
                this.assembleController();
            }, 'anonymous');
        } else {
            this.loadScript = this.loadExternalScript;
            this.buildController();
        }
    }

    assembleController() {
        this.mainDiv = document.createElement('div');
        this.mainDiv.id = "mainDiv";

        const itemStyle = this.createStyles();
        const dropdownCont = this.createDropdown();
        const sliderCont = this.createSlider();
        const { currentTime, timeDuration } = this.createTimeDisplays();
        const { bg, frost } = this.createBackgroundElements();

        this.mainDiv.appendChild(dropdownCont);
        this.mainDiv.appendChild(this.createRefreshButton());
        this.mainDiv.appendChild(this.createPlayToggleButton());
        this.mainDiv.appendChild(currentTime);
        this.mainDiv.appendChild(sliderCont);
        this.mainDiv.appendChild(timeDuration);
        this.mainDiv.appendChild(this.createReplayButton());
        this.mainDiv.appendChild(itemStyle);

        document.body.appendChild(bg);
        document.body.appendChild(frost);
        document.body.appendChild(this.mainDiv);

        // Initialize timeline control after DOM is ready with multiple retry attempts
        setTimeout(() => this.initializeTimelineControl(), 1000);
    }

    collectTimelines(select, timelineNames) {
        // Method 1: Search window properties (original method)
        for (const theTL in window) {
            if (Object.hasOwnProperty.call(window, theTL)) {
                const element = window[theTL];
                if ((typeof TimelineMax !== 'undefined' && element instanceof TimelineMax) ||
                    (typeof gsap !== 'undefined' && gsap.core && element instanceof gsap.core.Timeline)) {
                    select.timelines.push(element);
                    timelineNames.push(theTL);
                }
            }
        }

        // Method 2: Access GSAP's internal timeline registry (modern GSAP)
        if (typeof gsap !== 'undefined' && gsap.globalTimeline) {
            try {
                // Get all active timelines from GSAP's global timeline
                const children = gsap.globalTimeline.getChildren(true, true, true);
                children.forEach((child) => {
                    if (child instanceof gsap.core.Timeline && !select.timelines.includes(child)) {
                        select.timelines.push(child);
                        timelineNames.push(`Timeline_${select.timelines.length - 1}`);
                    }
                });
            } catch (e) {
                console.log('GSAP timeline registry access failed:', e);
            }
        }

        // Method 3: Search common timeline variable patterns
        const commonPatterns = ['tl', 'timeline', 'mainTL', 'masterTL', 'mainTimeline', 'masterTimeline'];
        commonPatterns.forEach(pattern => {
            if (window[pattern] && !select.timelines.includes(window[pattern])) {
                const element = window[pattern];
                if ((typeof TimelineMax !== 'undefined' && element instanceof TimelineMax) ||
                    (typeof gsap !== 'undefined' && gsap.core && element instanceof gsap.core.Timeline)) {
                    select.timelines.push(element);
                    timelineNames.push(pattern);
                }
            }
        });
    }

    initializeTimelineControl() {
        const select = document.querySelector('#timeline');
        if (select) {
            // Clear existing options and timelines on each initialization
            select.innerHTML = '';
            select.timelines = [];
            const timelineNames = [];

            // Collect all Timeline instances using multiple detection methods
            this.collectTimelines(select, timelineNames);

            // Count animated elements in each timeline
            const timelineInfo = select.timelines.map((timeline, index) => {
                let tweenCount = 0;

                if (timeline.getChildren) {
                    const children = timeline.getChildren(true, true, true);
                    tweenCount = children.length;
                }

                return {
                    timeline: timeline,
                    name: timelineNames[index],
                    tweenCount: tweenCount
                };
            });

            // Sort timelines by number of animated elements (descending)
            timelineInfo.sort((a, b) => b.tweenCount - a.tweenCount);

            // Rebuild arrays with sorted timelines
            select.timelines = timelineInfo.map(info => info.timeline);

            // Populate dropdown with sorted timeline names
            timelineInfo.forEach((info, index) => {
                select.options[select.options.length] = new Option(`${info.name} (${info.tweenCount})`, index);
            });

            select.addEventListener('change', () => {
                this.setupTimelineEvents(select.timelines[select.value]);
                select.timelines[select.value].play(0);
            });

            // Initialize first timeline
            if (select.options.length > 0) {
                select.dispatchEvent(new Event('change'));
            }
        }
    }

    setupTimelineEvents(controlledTL) {
        this.controlledTimeline = controlledTL;

        const durationElement = document.querySelector('#duration-time');
        if (durationElement) {
            durationElement.innerHTML = controlledTL.duration().toFixed(2);
        }

        // Slider input handler
        this.slider.oninput = () => {
            controlledTL.pause();
            this.playToggleBTN.innerHTML = this.playButton;
            this.playToggleBTN.classList.togglePlayStatus(0);
            if (controlledTL) {
                controlledTL.progress(this.slider.value / 100);
                this.setCurrentTime(controlledTL);
            }
        };

        // Replay button handler
        this.replayBTN.onclick = () => {
            if (controlledTL) {
                controlledTL.play(0);
                this.slider.value = 0;
                this.playToggleBTN.innerHTML = this.pauseButton;
                this.playToggleBTN.classList.togglePlayStatus(1);
                this.isComplete = false;
            }
        };

        // Play/Pause toggle handler
        this.playToggleBTN.onclick = () => {
            if (controlledTL) {
                if (controlledTL.isActive()) {
                    controlledTL.pause();
                    this.playToggleBTN.innerHTML = this.playButton;
                    this.playToggleBTN.classList.togglePlayStatus(0);
                    this.isComplete = false;
                    this.setCurrentTime(controlledTL);
                } else {
                    if (this.isComplete) controlledTL.play(0);
                    else {
                        controlledTL.play();
                        this.isComplete = false;
                    }
                    this.playToggleBTN.innerHTML = this.pauseButton;
                    this.playToggleBTN.classList.togglePlayStatus(1);
                    this.setCurrentTime(controlledTL);
                }
            }
        };

        // Setup timeline callbacks
        controlledTL.eventCallback("onUpdate", () => this.onTimelineUpdate());
        controlledTL.eventCallback("onComplete", () => this.onTimelineComplete());

        // Extend DOMTokenList prototype if not already extended
        if (!DOMTokenList.prototype.togglePlayStatus) {
            DOMTokenList.prototype.togglePlayStatus = function(status) {
                if (status) {
                    this.remove('pause');
                    this.add('play');
                } else {
                    this.remove('play');
                    this.add('pause');
                }
            };
        }
    }

    setCurrentTime(timeline) {
        const currentTimeElement = document.getElementById('current-time');
        if (currentTimeElement) {
            currentTimeElement.innerHTML = timeline.time().toFixed(2);
        }
    }

    onTimelineUpdate() {
        if (this.controlledTimeline) {
            this.slider.value = this.controlledTimeline.progress().toFixed(2) * 100;
            this.setCurrentTime(this.controlledTimeline);
        }
    }

    onTimelineComplete() {
        this.playToggleBTN.innerHTML = this.playButton;
        this.playToggleBTN.classList.togglePlayStatus(0);
        this.isComplete = true;
    }

    // Public method to manually control timeline
    controlTimeline(timeline) {
        this.setupTimelineEvents(timeline);
    }

    // Public method to destroy the controller
    destroy() {
        if (this.mainDiv) {
            this.mainDiv.remove();
        }
        const bg = document.querySelector('.bgImg');
        const frost = document.querySelector('.frost');
        if (bg) bg.remove();
        if (frost) frost.remove();
    }
}

// Global function for backward compatibility
function timelineControl(timeline) {
    if (window.gsapDebugController) {
        if (timeline) {
            window.gsapDebugController.controlTimeline(timeline);
        } else {
            window.gsapDebugController.initializeTimelineControl();
        }
    }
}

// Auto-initialize when script loads
window.gsapDebug = new GSAPDebug();