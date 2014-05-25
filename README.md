# SVG Palette picker #

A demo application that allows you to edit a svg file's color palette and save a copy.

# Design Approach #
I began this experiment with choosing between two different competing ways of implementing the SVG updates.

I could:
 - Keep the svg purely as strings or basic serialized xml objects, make the updates to the colors as simple string updates, and rerender the whole document every change.

 This approach will probably run fairly slowly, as the browser would have to repaint and recalculate the svg tree every render cycle, but it has the added benefit of not having to worry too much about how the browser generates the SVGDOM tree (possibly even using another technology such as Canvas or VML as fallbacks if necessary for browser support).

 - Augment the SVGDOM tree with extra behaviour. Obviously this requires good browser support for a correctly behaving SVGDOM API, which according to [caniuse.com](http://caniuse.com/#feat=svg-html5) has support from IE since IE9.

I went with the second approach (backed by AngularJS, as i wanted to see how well Angular's `$compile` directive plays with SVG elements). It was a fairly good learning experience, digging into how SVG's color inheritance works, as well as working out wierd edge cases.

One such edge case was what to do with the default fill/stroke color. All drawable svg elements have a default fill color of black, but how does one modify it without fundamentally changing what the svg image is (i.e. by setting a drawable child of a `<g>` element with a different color, it breaks the normal rules of color inheritance that happens with svg container elements). The solution i ended up with was setting a fill color on the svg root element (the `<svg>` element counts as a SVGContainerElement), and letting that cascade down as needed. This unfortunately didn't work well with `stroke-color`, as it appears there is always a default `stroke-width`, meaning if one sets the `stroke-color` on a parent container element, all children elements get a default stroke applied to it. I worked around this issue by setting the `stroke-width` property on the `<svg>` element to 0, which, although breaks that default `stroke-width` behaviour, ends up allowing me to control the default stroke color.

Another edge case that was discovered is that Chrome (tested on Chrome 36.0.1985.18 beta) doesn't seem to like to update `spot-color` of a gradient more than once. If you try and use the linux penguin sample image in this application on Chrome, you'll note that the gradient colors don't like to update more than once on that browser, whereas on Firefox, it updates correctly.

One thing i would've liked to do with more time would be to implement an export function, using `XMLSerializer` against the newly modified SVGDOM tree to create an SVG string, and using `window.URL.createObjURL` to create a local download link for the user.

Another thing would be to dynamically create the palette from an user supplied .svg file. It shouldn't be too difficult, just a matter of traversing the SVGTree and creating the appropriate Color objects.

Some more tests, especially around the SVG aspects of the application would be ideal too.

# Install #

requires Node & Ruby to compile.

```
npm install -g bower grunt-cli
npm install
bundle install
bower install
```

# Develop #

```
grunt
```

Now hit localhost:3000 for the application

# Package #

```
grunt package
```

# Test #

```
npm test
```