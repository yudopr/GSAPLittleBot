![Robot](https://github.com/yudopr/GSAPLittleBot/blob/main/img/robot-new.png?raw=true)

# GSAPLittleBot

A floating player for GSAP timeline animation debugging.

How to use:
1. Import the JS file from the HTML via script tag [JSDelivr CDN: V1!](https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@5f1b9574c83c8bbcf7a2558d0ae312547d3a797b/gsapDebug.js) inside the header or body tag.

```HTML
<script src="https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@5f1b9574c83c8bbcf7a2558d0ae312547d3a797b/gsapDebug.js" type="text/javascript"></script>
```

2. Initiate the target timeline:

```javascript
if(typeof timelineControl == "function") timelineControl(_yourMainTL);
```

Put the code wherever you like, but I _highly recommend_ on GSAP animation start event just to be sure the timeline is there for you to access.
_The if clause only there so you won't need to worry about errors when you delete the script tag on HTML file_

3. If succeed, you will see this UI floating on your webpage.<br>
![Image of GSAPLittleBot](https://github.com/yudopr/GSAPLittleBot/blob/main/img/GSAPLittleBot.png?raw=true)


### by: G. Yudo Pranolo
### Initial creation: 2/7/21.
