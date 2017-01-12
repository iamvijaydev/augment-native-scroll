# Augment Native Scroll
Experiments with custom wrappers over native scroll to achieve higher order functions

### Objective
Primary objective is to have multiple (related) scrollable areas, scroll as one, when anyone of them is scrolled. The demos are step up to test them on UIWebView (iOS) and determine the best way we can achieve the desired results. There are three different implemented flavors of native scrolls listed below:

### Synchronous Scroll
_Augmenting default scroll_

This flavor wraps the native scroll to have multiple scrollable areas scroll as one. Works on both touch and non-touch devices.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/synchronous-scroll)

### Swipe to Scroll
_Mimic tap-swipe on non-touch devices_

This flavor wraps the native scroll and disables default scroll behavior to provide tap and swipe like feature for non-touch devices. Only works on non-touch devices.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/swipe-to-scroll)

### Synchronous Scroll Swipe
_Both flavors working together_

This flavor detects touch support and provides synchronous scroll on both touch and no-touch devices. Additionally on non-touch devices it also provided swipe to scroll.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/synchronous-scroll-swipe)

### Final Winner
Finally it is clear that `Synchronous Scroll Swipe` is the best flavor that can be implemented on multiple touch and non-touch devices. On towards a proper npm React HOC package.
