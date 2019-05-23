import fs from 'fs';
import path from 'path';
import test from 'ava';
import Vinyl from 'vinyl';
import pEvent from 'p-event';
import mochaC8 from '../lib';
import rimraf from 'rimraf';
import tmp from 'tmp';

function fixture(name) {
    const fileName = path.join(__dirname, 'fixtures', name);

    return new Vinyl({
        path: fileName,
        contents: fs.existsSync(fileName) ? fs.readFileSync(fileName) : null
    });
}

test('run unit test and pass', async t => {
    const stream = mochaC8({ mochaOpts: {suppress: true}, c8Opts: { 'temp-directory': tmp.dirSync().name, reporter: 'none' } });
    const result = pEvent(stream, '_result');
    stream.end(fixture('fixture-pass.js'));
    t.regex((await result).stdout, /1 passing/);
});

test('run unit test and fail', async t => {
    const stream = mochaC8({ mochaOpts: {suppress: true}, c8Opts: { 'temp-directory': tmp.dirSync().name, reporter: 'none' } });
    const error = pEvent(stream, 'error');
    stream.end(fixture('fixture-fail.js'));
    t.regex((await error).stdout, /1 failing/);
});

test('pass async AssertionError to mocha', async t => {
    const stream = mochaC8({ mochaOpts: {suppress: true}, c8Opts: { 'temp-directory': tmp.dirSync().name, reporter: 'none' } });
    const event = pEvent(stream, 'error');
    stream.end(fixture('fixture-async.js'));
    const error = await event;
    t.regex(error.stdout, /throws after timeout|Uncaught AssertionError.*: The expression evaluated to a falsy value/);
});

test('require two files', async t => {
    const stream = mochaC8({ 
        mochaOpts: {
            suppress: true,
            require: [
                'test/fixtures/fixture-require1.js',
                'test/fixtures/fixture-require2.js'
            ]
        }, c8Opts: { 
            reporter: 'none',
            'temp-directory': tmp.dirSync().name
        } 
    });
    const result = pEvent(stream, '_result');
    stream.end(fixture('fixture-pass.js'));
    t.regex((await result).stdout, /1 passing/);
});

test('run unit test and assert coverage is generated', async t => {
    const tmpDir = tmp.dirSync();
    const stream = mochaC8({ mochaOpts: {suppress: true}, c8Opts: { 'temp-directory': tmpDir.name, reporter: 'json', exclude: "\\!test/fixtures/testlib/*" } });
    const result = pEvent(stream, '_result');
    stream.end(fixture('fixture-coverage.js'));
    t.regex((await result).stdout, /1 passing/);

    t.true(fs.existsSync('./coverage'));
    t.true(fs.existsSync('./coverage/coverage-final.json'));
    let data = fs.readFileSync('./coverage/coverage-final.json');
    rimraf.sync('./coverage/');
    if (data.indexOf('test/fixtures/testlib/index.js') !== -1) {
        t.pass();
    } else {
        t.fail();
    }
});
