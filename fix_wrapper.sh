sed -i '' '/\.mobile-wrapper {/,/z-index: 1;/c\
.mobile-wrapper {\
  width: 100%;\
  max-width: 480px;\
  background-color: var(--c-ivory);\
  background-image: url('"'"'../assets/main_bg.png'"'"');\
  background-size: 100% 100%;\
  background-repeat: no-repeat;\
  background-position: top center;\
  min-height: 100vh;\
  box-shadow: 0 0 40px rgba(0,0,0,0.1);\
  position: relative;\
  overflow-x: hidden;\
  z-index: 1;\
' /Users/apple/Documents/Amar-Mansi-wedding/css/style.css
