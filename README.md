# Augment Native Scroll
Experiments with custom wrappers over native scroll to achieve higher order functions

### Update
_Jan 19th 2017_

Starting [v0.7.0](https://github.com/iamvijaydev/augment-native-scroll/tree/7ffa83528671f7a039f8917450027cbac27b8929) the kinetic engine has been completely changed and is now following how [ariya / kinetic](https://github.com/ariya/kinetic) has implemented its kinetic scrolling. Understand its [implementation here](https://ariya.io/2013/11/javascript-kinetic-scrolling-part-2). This port inspired from this codebase and implemented it for native scroll rather than CSS transforms.

### Objective
Primary objective is to have multiple (related) scrollable areas, scroll as one, when anyone of them is scrolled. The demo is step up to test them on UIWebView (iOS) and determine the best way we can achieve the desired results. There are three different implemented flavors of native scrolls listed below:

### Synchronous Scroll Swipe
_Augmenting default scroll and Mimic tap-swipe on non-touch devices_

This flavor detects touch support and provides synchronous scroll on both touch and no-touch devices. Additionally on non-touch devices it also provided swipe to scroll.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/synchronous-scroll-swipe)

### TODOs
_coming soon_
