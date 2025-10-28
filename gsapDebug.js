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
 * - Performance monitoring (real-time FPS)
 * - Keyboard shortcuts
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

        // Initialize
        this.init();
    }

    init() {
        this.loadFontAwesome();
        this.createStyles();
        this.buildPanel(); // Build panel FIRST so elements exist
        this.setupKeyboardShortcuts();

        // Delayed timeline detection
        setTimeout(() => this.detectTimelines(), 500);

        // Start performance monitor AFTER panel is built
        this.startPerformanceMonitor();
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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

            /* Monochromatic White Theme */
            #gsapDebug {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #ffffff;
                border-top: 2px solid #000000;
                color: #000000;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                z-index: 999999;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
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
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
                cursor: move;
            }

            .gsap-title {
                font-weight: 600;
                font-size: 12px;
                color: #000000;
                display: flex;
                align-items: center;
                gap: 8px;
                letter-spacing: 0.3px;
            }

            .gsap-title i {
                font-size: 14px;
                color: #000000;
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
                background: #ffffff;
            }

            .gsap-row {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-wrap: wrap;
            }

            .gsap-section {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 4px;
                padding: 6px 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .gsap-section-label {
                font-size: 10px;
                color: #868e96;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .gsap-btn {
                background: #ffffff;
                border: 1px solid #dee2e6;
                color: #495057;
                padding: 5px 10px;
                border-radius: 4px;
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
                background: #000000;
                border-color: #000000;
                color: #ffffff;
            }

            .gsap-btn:active {
                transform: scale(0.98);
            }

            .gsap-btn.active {
                background: #000000;
                border-color: #000000;
                color: #ffffff;
            }

            .gsap-btn.danger {
                border-color: #dee2e6;
                color: #495057;
            }

            .gsap-btn.danger:hover {
                background: #000000;
                border-color: #000000;
                color: #ffffff;
            }

            .gsap-btn i {
                pointer-events: none;
            }

            .timeline-selector {
                padding: 5px 10px;
                background: #ffffff;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                color: #495057;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                min-width: 140px;
            }

            .timeline-selector:focus {
                outline: none;
                border-color: #000000;
                box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
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
                background: #e9ecef;
                border-radius: 2px;
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
                position: relative;
            }

            .timeline-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: #66D9EF;
                border: 2px solid #000000;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.1s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .timeline-slider::-webkit-slider-thumb:hover {
                transform: scale(1.15);
            }

            .timeline-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: #66D9EF;
                border: 2px solid #000000;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .timeline-labels {
                position: absolute;
                width: 100%;
                bottom: 0;
                height: 10px;
                pointer-events: none;
            }

            .timeline-label-marker {
                position: absolute;
                font-size: 9px;
                color: #495057;
                background: #ffffff;
                padding: 1px 4px;
                border-radius: 2px;
                white-space: nowrap;
                border: 1px solid #dee2e6;
                font-weight: 500;
                transform: translateX(-50%);
                top: 8px;
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.15s ease;
            }

            .timeline-label-marker:hover {
                background: #000000;
                color: #ffffff;
                border-color: #000000;
            }

            .time-display {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                color: #000000;
                font-weight: 600;
                min-width: 85px;
                text-align: center;
                padding: 4px 8px;
                background: #f8f9fa;
                border-radius: 4px;
                border: 1px solid #e9ecef;
            }

            .fps-display {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                padding: 4px 8px;
                background: #f8f9fa;
                border-radius: 4px;
                min-width: 60px;
                text-align: center;
                font-weight: 600;
                border: 1px solid #e9ecef;
            }

            .fps-display.good {
                color: #000000;
            }

            .fps-display.warning {
                color: #6c757d;
            }

            .fps-display.bad {
                color: #868e96;
            }

            .speed-indicator {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                color: #ffffff;
                background: #000000;
                padding: 4px 10px;
                border-radius: 4px;
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
                background: #ffffff;
                border: 1px solid #dee2e6;
                color: #495057;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.15s;
            }

            .label-btn:hover {
                background: #000000;
                border-color: #000000;
                color: #ffffff;
            }

            .shortcuts-help {
                font-size: 9px;
                color: #868e96;
                font-style: italic;
                padding: 3px 6px;
                background: #f8f9fa;
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

        // Row 4: Help text
        const row4 = document.createElement('div');
        row4.className = 'gsap-row';
        row4.innerHTML = `
            <div class="shortcuts-help">
                <i class="fa-solid fa-keyboard"></i> Space=Play/Pause | R=Replay | ←→=Frame Step | D=Minimize | 1-6=Speed
            </div>
        `;

        content.appendChild(row1);
        content.appendChild(row2);
        content.appendChild(row3);
        content.appendChild(row4);

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
            marker.onclick = () => {
                this.activeTimeline.pause();
                this.activeTimeline.seek(name);
                this.updateTimeDisplay();
            };
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

    startPerformanceMonitor() {
        let lastTime = performance.now();
        let frameCount = 0;
        let currentFPS = 0;

        if (typeof gsap !== 'undefined' && gsap.ticker) {
            gsap.ticker.add(() => {
                const now = performance.now();
                const deltaTime = (now - lastTime) / 1000; // Convert to seconds
                frameCount++;

                if (deltaTime >= 1) { // Update FPS every second
                    currentFPS = Math.round(frameCount / deltaTime);

                    // Update FPS display
                    if (this.fpsDisplay) {
                        this.fpsDisplay.textContent = `${currentFPS} FPS`;
                        this.fpsDisplay.className = 'fps-display';

                        // Color based on target FPS
                        const targetFps = gsap.ticker.fps() || 60;
                        const fpsRatio = currentFPS / targetFps;

                        if (fpsRatio >= 0.9) {
                            this.fpsDisplay.classList.add('good');
                        } else if (fpsRatio >= 0.6) {
                            this.fpsDisplay.classList.add('warning');
                        } else {
                            this.fpsDisplay.classList.add('bad');
                        }
                    }

                    frameCount = 0;
                    lastTime = now;
                }
            });

            console.log('%c⚡ FPS Monitor: Counting GSAP ticker updates', 'color: #A6E22E; font-weight: bold;');
        } else {
            console.warn('%c⚠️ GSAP not found, FPS monitor disabled', 'color: #E6DB74;');
            if (this.fpsDisplay) {
                this.fpsDisplay.textContent = 'N/A';
                this.fpsDisplay.className = 'fps-display';
            }
        }
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

// Auto-initialize with singleton pattern
if (typeof window !== 'undefined') {
    if (window.gsapDebug) {
        console.warn('%c⚠️ GSAP Debug: Instance already exists, using existing panel', 'color: #E6DB74; font-weight: bold;');
    } else {
        window.gsapDebug = new GSAPDebug();
        console.log('%c🎨 GSAP Debug: Panel initialized', 'color: #66D9EF; font-weight: bold;');
    }
}

// Legacy global function for backward compatibility
function timelineControl(timeline) {
    if (window.gsapDebug && timeline) {
        window.gsapDebug.controlTimeline(timeline);
    }
}
