Keyframes.Proximity
====================

A plugin for Keyframes that plays animations based on mouse distance from an element.

Installation
-----

```javascript
import Proximity from '@keyframes/proximity';
Keyframes.plugin(Proximity);
```

Usage
-----
```javascript
const blockElem = document.getElementById('block');
const block = new Keyframes(blockElem);
block.proximity((obj) => {
  blockElem.style.boxShadow = `red 0 0 ${0.5 * obj.distancePercentage}px`;
});
```

```javascript
{
  mouse, // Current mouse x and y.
  mouseDistance, // Distance from the element in pixels.
  viewPortDistance, // Distance from the edge of the viewport in pixels.
  distancePercentage, // Distance of the mouse from the target element as a percentage where zero is the viewport edge.
  targetEdge, // Closest point on the edge of the target object to the mouse.
  viewPortEdge, // Closest point on the edge of the viewport to the target edge.
  collision: !mouseDistance, // Boolean if the mouse is over the top of the element.
}
```