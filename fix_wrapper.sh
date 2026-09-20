sed -i '' '/\.mobile-wrapper {/,/z-index: 1;/c\
.mobile-wrapper {\
  width: 100%;\
  max-width: 480px;\
  background-color: transparent;\
  min-height: 100vh;\
  box-shadow: 0 0 40px rgba(0,0,0,0.1);\
  position: relative;\
  overflow-x: hidden;\
  z-index: 1;\
}\
\
.bg-frame {\
  position: fixed;\
  top: 0;\
  width: 100%;\
  max-width: 480px;\
  height: 100vh;\
  background-image: url('"'"'../assets/main_bg.png'"'"');\
  background-size: 100% 100%;\
  background-position: center;\
  background-repeat: no-repeat;\
  z-index: -1;\
  transform: translateZ(0);\
  will-change: transform;\
}\
' /Users/apple/Documents/Amar-Mansi-wedding/css/style.css
