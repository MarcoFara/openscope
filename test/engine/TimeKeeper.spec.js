import ava from 'ava';
import TimeKeeper from '../../src/assets/scripts/client/engine/TimeKeeper';

ava.afterEach(() => {
    TimeKeeper.reset();
});

ava('throws when attempting to instantiate', (t) => {
    t.throws(() => new TimeKeeper());
});

ava('#deltaTime is the product of #_frameDeltaTime and #_timescale', (t) => {
    TimeKeeper._frameDeltaTime = 33;
    TimeKeeper._timescale = 1;

    t.true(TimeKeeper.deltaTime === 33);
});

ava('#deltaTime returns a max value of 100', (t) => {
    TimeKeeper._frameDeltaTime = 33;
    TimeKeeper._timescale = 10;

    t.true(TimeKeeper.deltaTime === 100);
});

ava.skip('#accumulatedDeltaTime is the sum of each deltaTime value from instantiation to now', (t) => {
    const deltaValues = [];

    deltaValues.push(TimeKeeper.deltaTime);

    TimeKeeper.update();
    deltaValues.push(TimeKeeper.deltaTime);

    TimeKeeper.update();
    deltaValues.push(TimeKeeper.deltaTime);

    TimeKeeper.update();
    deltaValues.push(TimeKeeper.deltaTime);

    const sum = deltaValues.reduce((accumulator, item) => accumulator + item, 0);

    t.true(sum === TimeKeeper.accumulatedDeltaTime);
});

ava.skip('#accumulatedDeltaTime is the sum of each deltaTime value from instantiation to now offset by timewarp', (t) => {
    const deltaValues = [];

    deltaValues.push(TimeKeeper.deltaTime);

    TimeKeeper.update();
    deltaValues.push(TimeKeeper.deltaTime);

    TimeKeeper.update();
    deltaValues.push(TimeKeeper.deltaTime);

    TimeKeeper._timescale = 5;

    TimeKeeper.update();
    deltaValues.push(TimeKeeper.deltaTime);

    const sum = deltaValues.reduce((accumulator, item) => accumulator + item, 0);

    t.true(sum === TimeKeeper.accumulatedDeltaTime);
});

ava('.getDeltaTimeForGameStateAndTimewarp() returns 0 when #isPaused is true', (t) => {
    const result = TimeKeeper.getDeltaTimeForGameStateAndTimewarp(true);

    t.true(result === 0);
});

ava('.getDeltaTimeForGameStateAndTimewarp() returns 0 when #deltaTime > 1 and #timewarp is 1', (t) => {
    TimeKeeper._frameDeltaTime = 2;
    TimeKeeper._timescale = 1;

    const result = TimeKeeper.getDeltaTimeForGameStateAndTimewarp(false);

    t.true(result === 0);
});

ava('.getDeltaTimeForGameStateAndTimewarp() returns #deltaTime when if conditions are not met', (t) => {
    const result = TimeKeeper.getDeltaTimeForGameStateAndTimewarp(false);

    t.true(result === TimeKeeper.deltaTime);
});

ava('.setDeltaTimeBeforeFutureTrackCalculation() ', (t) => {
    TimeKeeper._frameDeltaTime = 3;

    TimeKeeper.setDeltaTimeBeforeFutureTrackCalculation();

    t.true(TimeKeeper._futureTrackDeltaTimeCache === 3);
    t.true(TimeKeeper._frameDeltaTime === 5);
});

ava('.setDeltaTimeAfterFutureTrackCalculation() ', (t) => {
    TimeKeeper._frameDeltaTime = 5;
    TimeKeeper._futureTrackDeltaTimeCache = 3;

    TimeKeeper.setDeltaTimeAfterFutureTrackCalculation();

    t.true(TimeKeeper._futureTrackDeltaTimeCache === -1);
    t.true(TimeKeeper._frameDeltaTime === 3);
});

ava('.update() increments #_elapsedFrameCount by 1', (t) => {
    t.true(TimeKeeper._elapsedFrameCount === 0);

    TimeKeeper.update();

    t.true(TimeKeeper._elapsedFrameCount === 1);
});

ava('.update() resets #_frameStartTimestamp to #currentTime when elapsed time is > frameDelay', (t) => {
    TimeKeeper._frameStartTimestamp = 10;
    TimeKeeper.update();

    t.true(TimeKeeper._frameStartTimestamp === TimeKeeper._previousFrameTimestamp);
});

ava('.update() recalculates the #_frameStep value based on the current #_timescale value', (t) => {
    TimeKeeper._timescale = 1;
    TimeKeeper.update();

    t.true(TimeKeeper._frameStep === 30);

    TimeKeeper._timescale = 2;
    TimeKeeper.update();

    t.true(TimeKeeper._frameStep === 27);

    TimeKeeper._timescale = 5;
    TimeKeeper.update();

    t.true(TimeKeeper._frameStep === 17);

    TimeKeeper._timescale = 25;
    TimeKeeper.update();

    t.true(TimeKeeper._frameStep === 1);

    TimeKeeper._timescale = 50;
    TimeKeeper.update();

    t.true(TimeKeeper._frameStep === 1);
});

ava('.updateTimescale() only accepts positive numbers', (t) => {
    TimeKeeper._timescale = 1;

    TimeKeeper.updateTimescale(-3);

    t.true(TimeKeeper._timescale === 1);
});

ava('.updateTimescale() updates #timescale value', (t) => {
    TimeKeeper._timescale = 1;

    TimeKeeper.updateTimescale(3);

    t.true(TimeKeeper._timescale === 3);
});
