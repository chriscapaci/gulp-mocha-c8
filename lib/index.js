'use strict';
const dargs = require('dargs');
const execa = require('execa');
const PluginError = require('plugin-error');
const through = require('through2');
const npmRunPath = require('npm-run-path');

const HUNDRED_MEGABYTES = 1000 * 1000 * 100;

// Mocha options that can be specified multiple times
const MULTIPLE_OPTS_MOCHA = new Set([
    'require'
]);

const MULTIPLE_OPTS_C8 = new Set([
    'include',
    'exclude'
]);

module.exports = opts => {

    let suppress = false;
    if ('suppress' in opts) {
        suppress = true;
    }

    let mochaOpts = { colors: true };
    if ('mochaOpts' in opts) {
        mochaOpts = Object.assign({
            colors: true
        }, opts.mochaOpts);
    }

    let c8Opts = {};
    if ('c8Opts' in opts) {
        c8Opts = Object.assign({
        }, opts.c8Opts);
    }

    for (const key of Object.keys(mochaOpts)) {
        const val = mochaOpts[key];

        if (Array.isArray(val)) {
            if (!MULTIPLE_OPTS_MOCHA.has(key)) {
                // Convert arrays into comma separated lists
                mochaOpts[key] = val.join(' ');
            }
        }
    }

    for (const key of Object.keys(c8Opts)) {
        const val = c8Opts[key];

        if (Array.isArray(val)) {
            if (!MULTIPLE_OPTS_C8.has(key)) {
                // Convert arrays into comma separated lists
                c8Opts[key] = val.join(' ');
            }
        }
    }

    const mochaArgs = dargs(mochaOpts, {
        ignoreFalse: true,
        useEquals: false
    });

    const c8Args = dargs(c8Opts, {
        ignoreFalse: true,
        useEquals: false
    });

    const files = [];

    function aggregate(file, encoding, done) {
        if (file.isStream()) {
            done(new PluginError('gulp-c8-mocha', 'Streaming not supported'));
            return;
        }

        files.push(file.path);
        done();
    }

    function flush(done) {
        const env = npmRunPath.env({cwd: __dirname});
        const proc = execa('c8 ' + c8Args.concat(['mocha'].concat(files.concat(mochaArgs))).join(' '), {
            env,
            maxBuffer: HUNDRED_MEGABYTES,
            shell: true
        });

        proc.then(result => {
            this.emit('_result', result);
            done();
        })
            .catch(err => {
                this.emit('error', new PluginError('gulp-c8-mocha', err));
                done();
            });

        if (!suppress) {
            proc.stdout.pipe(process.stdout);
            proc.stderr.pipe(process.stderr);
        }
    }

    return through.obj(aggregate, flush);
};