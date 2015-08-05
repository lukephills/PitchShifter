#Pitch Shifter

Inspired by Chris Wilson's [Jungle](https://github.com/cwilso/Audio-Input-Effects/blob/master/js/jungle.js)


### Development

Install the node modules:
`npm install`

Install Webpack:
`npm install -g webpack`

Run webpack watch:
`webpack --watch`

Every time a typescript file is saved, Webpack will bundle all dependencies into a minified `bundle.js` file and create sourcemaps for debugging. In dev tools look at `webpack://` in the Sources panel.
