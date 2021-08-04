![Robot](https://github.com/yudopr/GSAPLittleBot/blob/6c311258870ea98c10aa5d2701183522dd0682ac/img/robot.png?raw=true)

# GSAPLittleBot

A floating player for GSAP timeline animation debugging.

How to use:
1. Import the JS file from the HTML via script tag:
[JSDelivr CDN][https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@5f1b9574c83c8bbcf7a2558d0ae312547d3a797b/gsapDebug.js]

`<script src="https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@5f1b9574c83c8bbcf7a2558d0ae312547d3a797b/gsapDebug.js" type="text/javascript"></script>`

inside header or body tag.

2. Initiate the target timeline:

```javascript
if(typeof timelineControl == "function") timelineControl(_yourMainTL);
`

Put the code wherever you like, but I _highly recommend_ on GSAP animation start event just to be sure the timeline is there for you to access.
_the if clause only there so you won't need to worry about errors when you delete the script tag on HTML file_


### by: G. Yudo Pranolo
### Initial creation: 2/7/21.
