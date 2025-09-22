![Robot](https://github.com/yudopr/GSAPLittleBot/blob/main/img/robot-new.png?raw=true)

# GSAPLittleBot
A floating player for GSAP timeline animation debugging - now with ES6 class architecture!

## Features
- **Automatic Timeline Detection**: Finds GSAP timelines using multiple detection methods
- **Timeline Sorting**: Automatically sorts timelines by number of animated elements (most complex first)
- **Multiple GSAP Version Support**: Works with both legacy TimelineMax and modern GSAP
- **Timeline Controls**: Play, pause, replay, and scrub through timeline animations
- **Refresh Functionality**: Dynamically refresh timeline list without page reload
- **Clean ES6 Architecture**: Modern class-based implementation with better organization

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

## Version History
- **v1**: 2/7/21 - Initial creation
- **v2**: 3/10/22 - Enhanced functionality
- **v3**: 5/6/25 - Added timeline sorting by animated elements
- **v4**: ES6 Class refactor with improved detection and refresh functionality

#### by: Gyu Dop
