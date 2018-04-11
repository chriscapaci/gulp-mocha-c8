# gulp-mocha-c8

gulp-mocha-c8 is a [gulp](https://github.com/wearefractal/gulp) plugin that runs [mocha](https://github.com/mochajs/mocha) tests through [c8](https://github.com/bcoe/c8).

[![NPM](https://nodei.co/npm/gulp-mocha-c8.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-mocha-c8/)

## Usage

gulp-mocha-c8 provides a function to run mocha tests with c8 within a gulp task.

```javascript
var mochaC8 = require('gulp-mocha-c8');

gulp.task('default', () =>
	gulp.src('test.js', {read: false})
		// `gulp-mocha-c8` needs filepaths so you can't have any plugins before it
		.pipe(mochaC8({ 
            mochaOpts: {
                reporter: 'json'
            },
            c8Opts: {
                coverageDirectory: './coverage'
            })
        );
);
```

## API

### mochaC8({ c8Opts: { [c8options] }, mochaOpts: { [mochaoptions] } })

#### c8options

The c8 options are passed directly to its binary and supports the following options:

##### include

An array of files to include in reporting.

##### exclude

An array of files to exclude from reporting.

##### coverageDirectory

The directory to put coverage files. The final output (if not in the terminal) still goes to ./coverage. This options is just for individual coverage files.


#### mochaoptions

Options are passed directly to the `mocha` binary, so you can use any its [command-line options](http://mochajs.org/#usage) in a camelCased form. Arrays and key/value objects are correctly converted to the comma separated list format Mocha expects. Listed below are some of the more commonly used options:


##### ui

Type: `string`<br>
Default: `bdd`<br>
Values: `bdd` `tdd` `qunit` `exports`

Interface to use.

##### reporter

Type: `string`<br>
Default: `spec`
Values: [Reporters](https://github.com/mochajs/mocha/tree/master/lib/reporters)

Reporter that will be used.

This option can also be used to utilize third-party reporters. For example, if you `npm install mocha-lcov-reporter` you can then do use `mocha-lcov-reporter` as value.

##### reporterOptions

Type: `Object`<br>
Example: `{reportFilename: 'index.html'}`

Reporter specific options.

##### globals

Type: `Array`

List of accepted global variable names, example `['YUI']`. Accepts wildcards to match multiple global variables, e.g. `['gulp*']` or even `['*']`. See [Mocha globals option](http://mochajs.org/#globals-option).

##### timeout

Type: `number`<br>
Default: `2000`

Test-case timeout in milliseconds.

##### bail

Type: `boolean`<br>
Default: `false`

Bail on the first test failure.

##### checkLeaks

Type: `boolean`<br>
Default: `false`

Check for global variable leaks.

##### grep

Type: `string`

Only run tests matching the given pattern which is internally compiled to a RegExp.

##### require

Type: `Array`

Require custom modules before tests are run.

##### compilers

Type: `string`<br>
Example: `js:babel-core/register`

Specify a compiler.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)