/**
 * GSAP Debug Controller - Enhanced Edition
 * Advanced Timeline Controller for Rapid Animation Iteration
 *
 * ██████  ███████  █████  ██████      ██████  ███████ ██████  ██    ██  ██████
 *██       ██      ██   ██ ██   ██     ██   ██ ██      ██   ██ ██    ██ ██
 *██   ███ ███████ ███████ ██████      ██   ██ █████   ██████  ██    ██ ██   ███
 *██    ██      ██ ██   ██ ██          ██   ██ ██      ██   ██ ██    ██ ██    ██
 * ██████  ███████ ██   ██ ██          ██████  ███████ ██████   ██████   ██████
 *
 * Features:
 * - Multi-timeline control (mainTL, rollTL, ctaRoll)
 * - Label navigation with visual markers
 * - Playback speed control (0.1x - 4x)
 * - Frame-by-frame stepping
 * - Animation bookmarks (save problem areas for later)
 * - Performance monitoring (real-time FPS)
 * - Keyboard shortcuts
 * - Timeline export (document your timing)
 *
 * @version 2.0
 * @author Enhanced Edition
 */

class GSAPDebug {
    constructor() {
        // Core properties
        this.mainDiv = null;
        this.activeTimeline = null;
        this.timelines = {};
        this.bookmarks = [];
        this.isExpanded = true;

        // UI elements
        this.slider = null;
        this.playBtn = null;
        this.speedDisplay = null;
        this.fpsDisplay = null;

        // Playback state
        this.currentSpeed = 1;
        this.speeds = [0.1, 0.25, 0.5, 1, 2, 4];
        this.currentSpeedIndex = 3;

        // Performance monitoring
        this.fps = 0;
        this.lastTime = performance.now();

        // Initialize
        this.init();
    }

    init() {
        this.loadFontAwesome();
        this.createStyles();
        this.buildPanel();
        this.setupKeyboardShortcuts();
        this.startPerformanceMonitor();

        // Delayed timeline detection
        setTimeout(() => this.detectTimelines(), 500);
    }

    loadFontAwesome() {
        if (!document.querySelector('script[src*="fontawesome"]')) {
            const script = document.createElement("script");
            script.src = "https://kit.fontawesome.com/b3e2729d01.js";
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        }
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap');

            /* Monokai-inspired Minimalist Theme */
            #gsapDebug {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #272822;
                border-top: 2px solid #66D9EF;
                color: #F8F8F2;
                font-family: 'Fira Code', monospace;
                font-size: 12px;
                z-index: 999999;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
                transition: transform 0.2s ease;
                user-select: none;
            }

            #gsapDebug.collapsed {
                transform: translateY(calc(100% - 32px));
            }

            .gsap-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 12px;
                background: #1E1F1C;
                border-bottom: 1px solid #3E3D32;
                cursor: move;
            }

            .gsap-title {
                font-weight: 600;
                font-size: 12px;
                color: #66D9EF;
                display: flex;
                align-items: center;
                gap: 8px;
                letter-spacing: 0.5px;
            }

            .gsap-title i {
                font-size: 14px;
                color: #A6E22E;
            }

            .gsap-header-controls {
                display: flex;
                gap: 4px;
            }

            .gsap-content {
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: #272822;
            }

            .gsap-row {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-wrap: wrap;
            }

            .gsap-section {
                background: #3E3D32;
                border: 1px solid #49483E;
                border-radius: 3px;
                padding: 6px 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .gsap-section-label {
                font-size: 10px;
                color: #75715E;
                font-weight: 500;
            }

            .gsap-btn {
                background: #3E3D32;
                border: 1px solid #49483E;
                color: #F8F8F2;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.15s ease;
                font-size: 11px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
            }

            .gsap-btn:hover {
                background: #49483E;
                border-color: #66D9EF;
            }

            .gsap-btn:active {
                transform: scale(0.98);
            }

            .gsap-btn.active {
                background: #66D9EF;
                border-color: #66D9EF;
                color: #272822;
            }

            .gsap-btn.danger {
                border-color: #F92672;
            }

            .gsap-btn.danger:hover {
                background: #F92672;
                color: #F8F8F2;
            }

            .gsap-btn i {
                pointer-events: none;
            }

            .timeline-selector {
                padding: 5px 10px;
                background: #3E3D32;
                border: 1px solid #49483E;
                border-radius: 3px;
                color: #F8F8F2;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                min-width: 140px;
            }

            .timeline-selector:focus {
                outline: none;
                border-color: #66D9EF;
            }

            .slider-container {
                flex: 1;
                min-width: 200px;
                position: relative;
                padding: 8px 0;
            }

            .timeline-slider {
                width: 100%;
                height: 4px;
                background: #49483E;
                border-radius: 2px;
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
                position: relative;
            }

            .timeline-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 14px;
                background: #66D9EF;
                border: 2px solid #F8F8F2;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.1s;
            }

            .timeline-slider::-webkit-slider-thumb:hover {
                transform: scale(1.15);
            }

            .timeline-slider::-moz-range-thumb {
                width: 14px;
                height: 14px;
                background: #66D9EF;
                border: 2px solid #F8F8F2;
                border-radius: 50%;
                cursor: pointer;
            }

            .timeline-labels {
                display: flex;
                justify-content: space-between;
                position: absolute;
                width: 100%;
                top: -14px;
                pointer-events: none;
            }

            .timeline-label-marker {
                font-size: 9px;
                color: #A6E22E;
                background: #3E3D32;
                padding: 1px 4px;
                border-radius: 2px;
                white-space: nowrap;
                border: 1px solid #49483E;
            }

            .time-display {
                font-family: 'Fira Code', monospace;
                font-size: 12px;
                color: #E6DB74;
                font-weight: 500;
                min-width: 85px;
                text-align: center;
                padding: 4px 8px;
                background: #3E3D32;
                border-radius: 3px;
                border: 1px solid #49483E;
            }

            .fps-display {
                font-family: 'Fira Code', monospace;
                font-size: 11px;
                padding: 4px 8px;
                background: #3E3D32;
                border-radius: 3px;
                min-width: 60px;
                text-align: center;
                font-weight: 500;
                border: 1px solid #49483E;
            }

            .fps-display.good {
                color: #A6E22E;
            }

            .fps-display.warning {
                color: #E6DB74;
            }

            .fps-display.bad {
                color: #F92672;
            }

            .speed-indicator {
                font-family: 'Fira Code', monospace;
                font-size: 12px;
                color: #272822;
                background: #FD971F;
                padding: 4px 10px;
                border-radius: 3px;
                font-weight: 600;
                min-width: 40px;
                text-align: center;
            }

            .label-buttons {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
            }

            .label-btn {
                padding: 4px 8px;
                font-size: 10px;
                font-weight: 500;
                background: #3E3D32;
                border: 1px solid #66D9EF;
                color: #66D9EF;
                border-radius: 2px;
                cursor: pointer;
                transition: all 0.15s;
            }

            .label-btn:hover {
                background: #66D9EF;
                color: #272822;
            }

            .bookmark-list {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
                max-width: 500px;
            }

            .bookmark-item {
                padding: 4px 8px;
                font-size: 10px;
                font-weight: 500;
                background: #3E3D32;
                border: 1px solid #E6DB74;
                color: #E6DB74;
                border-radius: 2px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.15s;
            }

            .bookmark-item:hover {
                background: #49483E;
            }

            .bookmark-item .remove {
                margin-left: 2px;
                opacity: 0.6;
                cursor: pointer;
            }

            .bookmark-item .remove:hover {
                opacity: 1;
                color: #F92672;
            }

            .shortcuts-help {
                font-size: 9px;
                color: #75715E;
                font-style: italic;
                padding: 3px 6px;
                background: #1E1F1C;
                border-radius: 2px;
            }

            @media (max-width: 1200px) {
                .gsap-row {
                    flex-wrap: wrap;
                }
            }
        `;
        document.head.appendChild(style);
    }

    buildPanel() {
        this.mainDiv = document.createElement('div');
        this.mainDiv.id = 'gsapDebug';

        // Header
        const header = document.createElement('div');
        header.className = 'gsap-header';
        header.innerHTML = `
            <div class="gsap-title">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                GSAP Debug Controller
            </div>
            <div class="gsap-header-controls">
                <button class="gsap-btn" id="minimizeBtn" title="Minimize (D)">
                    <i class="fa-solid fa-window-minimize"></i>
                </button>
                <button class="gsap-btn danger" id="closeBtn" title="Close Panel">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

        // Content
        const content = document.createElement('div');
        content.className = 'gsap-content';

        // Row 1: Timeline selector, playback controls, time display
        const row1 = document.createElement('div');
        row1.className = 'gsap-row';
        row1.innerHTML = `
            <div class="gsap-section">
                <span class="gsap-section-label">Timeline</span>
                <select class="timeline-selector" id="timelineSelect">
                    <option value="">Detecting...</option>
                </select>
            </div>

            <div class="gsap-section">
                <button class="gsap-btn" id="stepBackBtn" title="Step Back (←)">
                    <i class="fa-solid fa-backward-step"></i>
                </button>
                <button class="gsap-btn" id="playBtn" title="Play/Pause (Space)">
                    <i class="fa-solid fa-play"></i>
                </button>
                <button class="gsap-btn" id="stepForwardBtn" title="Step Forward (→)">
                    <i class="fa-solid fa-forward-step"></i>
                </button>
                <button class="gsap-btn" id="replayBtn" title="Replay (R)">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>
            </div>

            <div class="gsap-section">
                <span class="gsap-section-label">Speed</span>
                <button class="gsap-btn" id="speedDownBtn" title="Decrease Speed">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <div class="speed-indicator" id="speedDisplay">1x</div>
                <button class="gsap-btn" id="speedUpBtn" title="Increase Speed">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>

            <div class="time-display" id="timeDisplay">0.00 / 0.00</div>
            <div class="fps-display good" id="fpsDisplay">60 FPS</div>
        `;

        // Row 2: Timeline slider with labels
        const row2 = document.createElement('div');
        row2.className = 'gsap-row';
        row2.innerHTML = `
            <div class="slider-container">
                <div class="timeline-labels" id="timelineLabels"></div>
                <input type="range" class="timeline-slider" id="timelineSlider" min="0" max="100" value="0" step="0.1">
            </div>
        `;

        // Row 3: Labels navigation
        const row3 = document.createElement('div');
        row3.className = 'gsap-row';
        row3.innerHTML = `
            <div class="gsap-section" style="flex: 1;">
                <span class="gsap-section-label">Labels</span>
                <div class="label-buttons" id="labelButtons">
                    <span style="color: #666; font-size: 10px;">No labels found</span>
                </div>
            </div>
        `;

        // Row 4: Bookmarks & export
        const row4 = document.createElement('div');
        row4.className = 'gsap-row';
        row4.innerHTML = `
            <div class="gsap-section">
                <button class="gsap-btn" id="addBookmarkBtn" title="Bookmark Current Position (B)">
                    <i class="fa-solid fa-bookmark"></i> Bookmark
                </button>
            </div>
            <div class="gsap-section" style="flex: 1;">
                <div class="bookmark-list" id="bookmarkList"></div>
            </div>
            <div class="gsap-section">
                <button class="gsap-btn" id="exportBtn" title="Export Timeline Data">
                    <i class="fa-solid fa-download"></i> Export
                </button>
            </div>
        `;

        // Row 5: Help text
        const row5 = document.createElement('div');
        row5.className = 'gsap-row';
        row5.innerHTML = `
            <div class="shortcuts-help">
                <i class="fa-solid fa-keyboard"></i> Space=Play/Pause | R=Replay | ←→=Frame Step | B=Bookmark | D=Minimize | 1-6=Speed
            </div>
        `;

        content.appendChild(row1);
        content.appendChild(row2);
        content.appendChild(row3);
        content.appendChild(row4);
        content.appendChild(row5);

        this.mainDiv.appendChild(header);
        this.mainDiv.appendChild(content);

        document.body.appendChild(this.mainDiv);

        // Store references
        this.slider = document.getElementById('timelineSlider');
        this.playBtn = document.getElementById('playBtn');
        this.speedDisplay = document.getElementById('speedDisplay');
        this.fpsDisplay = document.getElementById('fpsDisplay');

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Minimize
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            this.mainDiv.classList.toggle('collapsed');
        });

        // Close
        document.getElementById('closeBtn').addEventListener('click', () => {
            this.mainDiv.style.display = 'none';
        });

        // Timeline selector
        document.getElementById('timelineSelect').addEventListener('change', (e) => {
            this.switchTimeline(e.target.value);
        });

        // Playback controls
        this.playBtn.addEventListener('click', () => this.togglePlay());
        document.getElementById('replayBtn').addEventListener('click', () => this.replay());
        document.getElementById('stepBackBtn').addEventListener('click', () => this.stepFrame(-1));
        document.getElementById('stepForwardBtn').addEventListener('click', () => this.stepFrame(1));

        // Speed controls
        document.getElementById('speedDownBtn').addEventListener('click', () => this.changeSpeed(-1));
        document.getElementById('speedUpBtn').addEventListener('click', () => this.changeSpeed(1));

        // Slider
        this.slider.addEventListener('input', (e) => this.onSliderInput(e));

        // Bookmarks
        document.getElementById('addBookmarkBtn').addEventListener('click', () => this.addBookmark());

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTimeline());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'r':
                    e.preventDefault();
                    this.replay();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    this.stepFrame(-1);
                    break;
                case 'arrowright':
                    e.preventDefault();
                    this.stepFrame(1);
                    break;
                case 'b':
                    e.preventDefault();
                    this.addBookmark();
                    break;
                case 'd':
                    e.preventDefault();
                    this.mainDiv.classList.toggle('collapsed');
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    e.preventDefault();
                    this.setSpeed(parseInt(e.key) - 1);
                    break;
            }
        });
    }

    detectTimelines() {
        const select = document.getElementById('timelineSelect');
        select.innerHTML = '';
        this.timelines = {};
        const foundTimelines = new Map(); // Use Map to track unique timelines

        // Method 1: Scan ALL window properties for GSAP timeline instances
        for (const prop in window) {
            try {
                const obj = window[prop];

                // Check if it's a GSAP timeline instance
                if (obj && typeof obj === 'object') {
                    // GSAP 3.x check
                    if (typeof gsap !== 'undefined' && gsap.core && obj instanceof gsap.core.Timeline) {
                        if (!foundTimelines.has(obj)) {
                            foundTimelines.set(obj, prop);
                        }
                    }
                    // Legacy GSAP 2.x check (TimelineMax/TimelineLite)
                    else if (typeof TimelineMax !== 'undefined' && obj instanceof TimelineMax) {
                        if (!foundTimelines.has(obj)) {
                            foundTimelines.set(obj, prop);
                        }
                    }
                    else if (typeof TimelineLite !== 'undefined' && obj instanceof TimelineLite) {
                        if (!foundTimelines.has(obj)) {
                            foundTimelines.set(obj, prop);
                        }
                    }
                }
            } catch (e) {
                // Skip properties that can't be accessed
                continue;
            }
        }

        // Method 2: Access GSAP's internal globalTimeline to find nested timelines
        if (typeof gsap !== 'undefined' && gsap.globalTimeline) {
            try {
                const children = gsap.globalTimeline.getChildren(true, true, true);
                children.forEach((child, index) => {
                    if (child instanceof gsap.core.Timeline && !foundTimelines.has(child)) {
                        // Try to find the variable name for this timeline
                        let varName = null;
                        for (const prop in window) {
                            try {
                                if (window[prop] === child) {
                                    varName = prop;
                                    break;
                                }
                            } catch (e) {
                                continue;
                            }
                        }
                        foundTimelines.set(child, varName || `Timeline_${index}`);
                    }
                });
            } catch (e) {
                console.log('Could not access GSAP globalTimeline:', e);
            }
        }

        // Convert Map to timelines object and populate dropdown
        const timelineEntries = Array.from(foundTimelines.entries()).map(([timeline, name]) => ({
            timeline,
            name,
            duration: timeline.duration ? timeline.duration() : 0,
            tweenCount: timeline.getChildren ? timeline.getChildren(true, true, true).length : 0
        }));

        // Sort by tween count (most complex first) then by name
        timelineEntries.sort((a, b) => {
            if (b.tweenCount !== a.tweenCount) {
                return b.tweenCount - a.tweenCount;
            }
            return a.name.localeCompare(b.name);
        });

        // Populate the dropdown
        timelineEntries.forEach((entry) => {
            this.timelines[entry.name] = entry.timeline;
            const option = document.createElement('option');
            option.value = entry.name;
            option.textContent = `${entry.name} (${entry.duration.toFixed(2)}s, ${entry.tweenCount} tweens)`;
            select.appendChild(option);
        });

        // Auto-select first timeline
        if (Object.keys(this.timelines).length > 0) {
            select.value = Object.keys(this.timelines)[0];
            this.switchTimeline(select.value);
            console.log(`%c✅ GSAP Debug: Found ${Object.keys(this.timelines).length} timeline(s)`, 'color: #A6E22E; font-weight: bold;');
            console.log('%cTimelines detected:', 'color: #66D9EF;', Object.keys(this.timelines));
        } else {
            select.innerHTML = '<option>No timelines found (searching...)</option>';
            setTimeout(() => this.detectTimelines(), 1000);
        }
    }

    switchTimeline(timelineName) {
        if (!this.timelines[timelineName]) return;

        this.activeTimeline = this.timelines[timelineName];

        // Update UI
        this.updateTimeDisplay();
        this.updateLabels();

        // Setup callbacks
        this.activeTimeline.eventCallback('onUpdate', () => this.onTimelineUpdate());
        this.activeTimeline.eventCallback('onComplete', () => this.onTimelineComplete());
    }

    updateLabels() {
        if (!this.activeTimeline) return;

        const labelButtons = document.getElementById('labelButtons');
        const labelMarkers = document.getElementById('timelineLabels');

        labelButtons.innerHTML = '';
        labelMarkers.innerHTML = '';

        const labels = this.activeTimeline.labels || {};
        const labelNames = Object.keys(labels);

        if (labelNames.length === 0) {
            labelButtons.innerHTML = '<span style="color: #666; font-size: 10px;">No labels found</span>';
            return;
        }

        const duration = this.activeTimeline.duration();

        labelNames.forEach(name => {
            // Button
            const btn = document.createElement('button');
            btn.className = 'label-btn';
            btn.textContent = name;
            btn.onclick = () => {
                this.activeTimeline.pause();
                this.activeTimeline.seek(name);
                this.updateTimeDisplay();
            };
            labelButtons.appendChild(btn);

            // Marker
            const position = (labels[name] / duration) * 100;
            const marker = document.createElement('div');
            marker.className = 'timeline-label-marker';
            marker.style.left = `${position}%`;
            marker.textContent = name;
            labelMarkers.appendChild(marker);
        });
    }

    togglePlay() {
        if (!this.activeTimeline) return;

        if (this.activeTimeline.isActive()) {
            this.activeTimeline.pause();
            this.playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        } else {
            if (this.activeTimeline.progress() >= 1) {
                this.activeTimeline.play(0);
            } else {
                this.activeTimeline.play();
            }
            this.playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    }

    replay() {
        if (!this.activeTimeline) return;

        this.activeTimeline.play(0);
        this.playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        this.updateTimeDisplay();
    }

    stepFrame(direction) {
        if (!this.activeTimeline) return;

        this.activeTimeline.pause();
        const fps = 24; // Match your gsap.ticker.fps(24)
        const step = (1 / fps) * direction;
        const newTime = Math.max(0, Math.min(this.activeTimeline.duration(), this.activeTimeline.time() + step));
        this.activeTimeline.time(newTime);
        this.updateTimeDisplay();
    }

    changeSpeed(direction) {
        this.currentSpeedIndex = Math.max(0, Math.min(this.speeds.length - 1, this.currentSpeedIndex + direction));
        this.setSpeed(this.currentSpeedIndex);
    }

    setSpeed(index) {
        if (index < 0 || index >= this.speeds.length) return;

        this.currentSpeedIndex = index;
        this.currentSpeed = this.speeds[index];

        if (this.activeTimeline) {
            this.activeTimeline.timeScale(this.currentSpeed);
        }

        this.speedDisplay.textContent = `${this.currentSpeed}x`;
    }

    onSliderInput(e) {
        if (!this.activeTimeline) return;

        this.activeTimeline.pause();
        this.playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

        const progress = parseFloat(e.target.value) / 100;
        this.activeTimeline.progress(progress);
        this.updateTimeDisplay();
    }

    onTimelineUpdate() {
        if (!this.activeTimeline) return;

        const progress = this.activeTimeline.progress();
        this.slider.value = progress * 100;
        this.updateTimeDisplay();
    }

    onTimelineComplete() {
        this.playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }

    updateTimeDisplay() {
        if (!this.activeTimeline) return;

        const current = this.activeTimeline.time().toFixed(2);
        const total = this.activeTimeline.duration().toFixed(2);
        document.getElementById('timeDisplay').textContent = `${current} / ${total}s`;
    }

    addBookmark() {
        if (!this.activeTimeline) return;

        const time = this.activeTimeline.time();
        const name = prompt('Bookmark name (describe what needs fixing):', `Mark ${this.bookmarks.length + 1}`);

        if (name) {
            this.bookmarks.push({ name, time });
            this.updateBookmarks();
        }
    }

    updateBookmarks() {
        const list = document.getElementById('bookmarkList');
        list.innerHTML = '';

        if (this.bookmarks.length === 0) {
            list.innerHTML = '<span style="color: #666; font-size: 10px;">No bookmarks yet</span>';
            return;
        }

        this.bookmarks.forEach((bookmark, index) => {
            const item = document.createElement('div');
            item.className = 'bookmark-item';
            item.innerHTML = `
                <i class="fa-solid fa-bookmark"></i>
                <span>${bookmark.name} (${bookmark.time.toFixed(2)}s)</span>
                <i class="fa-solid fa-xmark remove"></i>
            `;

            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove')) {
                    this.bookmarks.splice(index, 1);
                    this.updateBookmarks();
                } else {
                    this.activeTimeline.pause();
                    this.activeTimeline.time(bookmark.time);
                    this.updateTimeDisplay();
                }
            });

            list.appendChild(item);
        });
    }

    exportTimeline() {
        if (!this.activeTimeline) return;

        const data = {
            duration: this.activeTimeline.duration(),
            labels: this.activeTimeline.labels,
            bookmarks: this.bookmarks,
            children: []
        };

        // Export children animations
        const children = this.activeTimeline.getChildren(false, true, true);
        children.forEach(child => {
            data.children.push({
                type: child.constructor.name,
                startTime: child.startTime(),
                duration: child.duration(),
                targets: child.targets ? child.targets() : []
            });
        });

        console.log('%c📊 Timeline Export', 'font-size: 16px; font-weight: bold; color: #ff2b6f;');
        console.log('%cTimeline Data:', 'font-weight: bold; color: #00d4ff;', data);
        console.log('%cCopy-ready JSON:', 'font-weight: bold; color: #00ff88;');
        console.log(JSON.stringify(data, null, 2));

        alert('✅ Timeline data exported to console!\n\nCheck the browser console to see:\n- Duration & labels\n- Your bookmarks\n- All animations and their timings');
    }

    startPerformanceMonitor() {
        setInterval(() => {
            const now = performance.now();
            const delta = now - this.lastTime;
            this.fps = Math.round(1000 / delta);
            this.lastTime = now;

            // Update FPS display
            this.fpsDisplay.textContent = `${this.fps} FPS`;
            this.fpsDisplay.className = 'fps-display';

            if (this.fps >= 50) {
                this.fpsDisplay.classList.add('good');
            } else if (this.fps >= 30) {
                this.fpsDisplay.classList.add('warning');
            } else {
                this.fpsDisplay.classList.add('bad');
            }
        }, 500);
    }

    // Public API
    destroy() {
        if (this.mainDiv) {
            this.mainDiv.remove();
        }
    }

    // Legacy compatibility
    controlTimeline(timeline) {
        // Add timeline to detection if not already there
        const name = Object.keys(window).find(key => window[key] === timeline);
        if (name && !this.timelines[name]) {
            this.timelines[name] = timeline;
            const select = document.getElementById('timelineSelect');
            const option = document.createElement('option');
            option.value = name;
            option.textContent = `${name} (${timeline.duration().toFixed(2)}s)`;
            select.appendChild(option);
            select.value = name;
            this.switchTimeline(name);
        }
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.gsapDebug = new GSAPDebug();
}

// Legacy global function for backward compatibility
function timelineControl(timeline) {
    if (window.gsapDebug && timeline) {
        window.gsapDebug.controlTimeline(timeline);
    }
}
