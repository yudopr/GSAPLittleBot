![Robot](https://github.com/yudopr/GSAPLittleBot/blob/main/img/robot-new.png?raw=true)

# GSAP Debug Controller
Advanced Timeline Controller for Rapid Animation Iteration - Enhanced Edition with ES6 class architecture!

## 🎬 [Live Demo](https://yudopr.github.io/GSAPLittleBot/demo.html)

Check out the interactive demo to see all features in action!

## Features

### Core Functionality
- **Multi-Timeline Control**: Switch between multiple timelines (mainTL, rollTL, ctaRoll) seamlessly
- **Label Navigation**: Jump to specific animation labels with visual markers on the timeline
- **Variable Playback Speed**: Control animation speed from 0.1x to 4x for detailed inspection
- **Frame-by-Frame Stepping**: Step forward and backward through your animations precisely
- **Timeline Scrubbing**: Drag the slider to any point in your animation instantly

### Advanced Tools
- **Animation Bookmarks**: Save and return to problem areas or key moments in your timeline
- **Real-Time FPS Monitoring**: Track performance with color-coded FPS display (green/yellow/red)
- **Timeline Export**: Export timeline data including labels, durations, and structure for documentation
- **Keyboard Shortcuts**: Efficient workflow with shortcuts for all major functions

### Technical Features
- **Automatic Timeline Detection**: Finds GSAP timelines using multiple detection methods
- **Timeline Sorting**: Automatically sorts timelines by number of animated elements (most complex first)
- **Multiple GSAP Version Support**: Works with both legacy TimelineMax and modern GSAP
- **Clean ES6 Architecture**: Modern class-based implementation with better organization
- **Monokai-Inspired UI**: Developer-friendly interface with excellent visibility

## How to Use

### Method 1: CDN (Recommended)
1. Import the JS file from the HTML via script tag inside the header or body tag:

```HTML
<script src="https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBot@main/gsapDebug.js" type="text/javascript"></script>
```

### Method 2: Local File
1. Download `gsapDebug.js` and include it in your project:

```HTML
<script src="path/to/gsapDebug.js" type="text/javascript"></script>
```

### Usage
The debug controller automatically initializes when the script loads. No additional code required!

```javascript
// Create your GSAP timelines as usual
const mainTL = gsap.timeline({ paused: true });
mainTL
  .add("intro")
  .to(".element", { x: 100, duration: 1 })
  .add("finale")
  .to(".element", { rotation: 360, duration: 1 });

// Initialize the debug controller
const debugController = new GSAPDebug();

// That's it! The controller automatically detects timelines named:
// mainTL, rollTL, ctaRoll, tl, timeline, masterTL
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `R` | Replay from start |
| `←` | Step backward one frame |
| `→` | Step forward one frame |
| `B` | Add bookmark at current position |
| `D` | Minimize / Maximize panel |
| `1-6` | Set playback speed (0.1x - 4x) |

## Panel Controls

### Timeline Section
- **Timeline Selector**: Dropdown to switch between detected timelines
- **Play/Pause Button**: Toggle animation playback
- **Step Buttons**: Move frame-by-frame backward or forward
- **Replay Button**: Restart timeline from the beginning

### Speed Control
- **Speed Display**: Shows current playback speed (0.1x - 4x)
- **+/- Buttons**: Adjust playback speed up or down

### Timeline Scrubber
- **Slider**: Drag to scrub through your animation
- **Label Markers**: Visual indicators showing label positions
- **Time Display**: Current time / Total duration
- **FPS Monitor**: Real-time performance indicator

### Bookmarks
- **Add Bookmark**: Save current position for quick reference
- **Bookmark List**: Click to jump to saved positions
- **Remove**: Click × on bookmark to delete it

### Export
- **Export Button**: Download timeline structure as JSON

#### Optional: Manual Control
If you need to manually refresh the timeline list or control specific timelines:

```javascript
// Refresh timeline list (useful when creating new timelines dynamically)
if(typeof timelineControl == "function") timelineControl();

// Control a specific timeline
if(window.gsapDebug) {
    window.gsapDebug.controlTimeline(yourSpecificTimeline);
}
```

#### Destroying the Controller
```javascript
// Remove the debug controller from the page
if(window.gsapDebug) {
    window.gsapDebug.destroy();
}
```

### What You'll See
If successful, you will see this UI at the bottom of your webpage:
![Image of GSAPLittleBot](https://raw.githubusercontent.com/yudopr/GSAPLittleBot/main/img/GSAPLittleBot.V2.png)

## Timeline Detection
GSAPLittleBot uses three methods to find your timelines:
1. **Window Properties**: Searches through all window properties for Timeline instances
2. **GSAP Global Timeline**: Accesses GSAP's internal timeline registry (modern GSAP)
3. **Common Patterns**: Looks for common variable names like `tl`, `timeline`, `mainTL`, etc.

## Use Cases

### Perfect For:
- **Animation Debugging**: Quickly identify timing issues and overlapping animations
- **Client Presentations**: Slow down animations to explain each step
- **Performance Testing**: Monitor FPS during complex animation sequences
- **Timeline Development**: Rapidly iterate on animation timing and sequencing
- **Teaching/Training**: Step through animations to demonstrate GSAP concepts
- **QA Testing**: Bookmark problem areas for detailed testing

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6 support

## Version History
- **v1**: 2/7/21 - Initial creation
- **v2**: 3/10/22 - Enhanced functionality
- **v3**: 5/6/25 - Added timeline sorting by animated elements
- **v4**: ES6 Class refactor with improved detection and refresh functionality
- **VX**: Enhanced Edition - Multi-timeline control, label navigation, speed control, bookmarks, FPS monitor, keyboard shortcuts, timeline export, and redesigned UI

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests.

## License
MIT License - Feel free to use in your projects!

---

#### by: Gyu Dop
