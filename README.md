![Robot](https://github.com/yudopr/GSAPLittleBot/blob/6c311258870ea98c10aa5d2701183522dd0682ac/img/robot.png?raw=true)

# GSAPLittleBot
A floating player for GSAP timeline animation debugging.
 
### by: G. Yudo Pranolo
### Initial creation: 2/7/21.


How to use:
1. Import the JS file from the HTML via script tag:
[JSDelivr CDN][https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@5f1b9574c83c8bbcf7a2558d0ae312547d3a797b/gsapDebug.js]

`<script src="https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@5f1b9574c83c8bbcf7a2558d0ae312547d3a797b/gsapDebug.js" type="text/javascript"></script>`

inside header or body tag.

2. Initiate the target timeline:

`timelineControl(mainTL)`

wherever you like, but I recommend on GSAP animation start event just to be sure the timeline is there for you to access.
