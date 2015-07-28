#Typescript and Webpack

####No Grunt, no Bower, no RequireJS needed.

Compile and bundle typescript applications with ease.

Following the great article by [@jbrantly](https://github.com/jbrantly).
You can read it [here](http://www.jbrantly.com/typescript-and-webpack/).

Install the node modules:
`npm install`

Install the typescript definition files:
`tsd install`

Install Webpack:
`npm install -g webpack`

Run webpack watch:
`webpack --watch`

Every time a typescript file is saved, Webpack will bundle all dependencies into a minified `bundle.js` file and create sourcemaps for debugging. In dev tools look at `webpack://` in the Sources panel.

I recommend using this method with Atom and atom-typescript as it's super fast.
