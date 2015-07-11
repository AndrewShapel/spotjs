# SpotJS

SpotJS used for asynchronous load CSS files and cache it in localStorage. This
script does not have any dependencies on a libraries. The standard SpotJS file
is around 3KB when minified via UglifyJS

SpotJS works in all major browsers which supports localStorage

## Directories

* **test**: Tests for SpotJS

## Tests

SpotJS tests dependence in the following frameworks and libraries

* [Mocha](https://github.com/mochajs/mocha)
* [Should](https://github.com/shouldjs/should.js)

Open tests/index.html in all the browsers to run all the tests

#### Configuration

Call the configure method and pass configuration object
``` javascript
Spot.configure({
  baseUrl: '',
  stylesheets: {
    'asssociated-stylesheet-name': 'path/to/stylesheet.css'
  },
  options: {
    'asssociated-stylesheet-name': {
      // set configuration properties here
    }
  }
});
Spot.load(['asssociated-stylesheet-name'], function(link) {
  // use link object below
});
```

Options object properties
- `name`: Associated name of loaded stylesheet. If name is not set, then
will be taken a href (optional)
- `before`: Set before what DOM object will be inserted your stylesheet. By
default, your stylesheet will be inserted before the first `script` tag
in the DOM (optional)
- `media`: Set string which will be used as a media attribute in
your stylesheet. By default is set to 'all' (optional)
- `expire`: Lifetime of the saved cache which measured in hours. By default
is set to 1 hour (optional)

## Usage

Place the `spot.js` or `spot.min.js` inline in the your page.
Then call it by using 3 ways

#### Way 1

Load CSS file
``` javascript
Spot.cssAsyncLoad(href, options, function(link) {
  // use link object below
});
```

#### Way 2

Load multiple CSS files
``` javascript
Spot.load([{
  href: 'path/to/stylesheet.css',
  options: {}
},
{
  href: 'path/to/another-stylesheet.css',
  options: {}
}], function(stylesheetLink, anotherStylesheetLink) {
  // use stylesheetLink and anotherStylesheetLink object below
});
```

#### Way 3

Load multiple CSS files using config
``` javascript
Spot.load(['asssociated-stylesheet-name'], function(link) {
  // use link object below
});
```

## License

Licensed MIT
