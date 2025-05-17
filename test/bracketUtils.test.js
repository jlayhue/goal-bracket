import assert from 'node:assert/strict';
import { test } from 'vitest';
import { generateMatchups, getNextRoundMatchups, isRoundComplete, shuffleArray, calculateRounds, getCurrentRoundMatchups } from '../dist/bracketUtils.js';

// Helper: deterministic shuffle by mocking Math.random
function withMockedRandom(values, fn) {
  const original = Math.random;
  let i = 0;
  Math.random = () => (values[i++] ?? 0.5);
  try { fn(); } finally { Math.random = original; }
}

test('generateMatchups basic even case', () => {
  const goals = ['a','b','c','d'];
  withMockedRandom([0.9,0.1,0.8,0.2], () => {
    const matchups = generateMatchups(goals, 2);
    assert.equal(matchups.length, 2);
    assert.equal(matchups[0].round, 2);
    assert.ok(matchups[0].id);
    // ensure selected initially null
    assert.strictEqual(matchups[0].selected, null);
  });
});

test('generateMatchups odd goals gives bye', () => {
  const goals = ['a','b','c'];
  withMockedRandom([0.1,0.2,0.3], () => {
    const matchups = generateMatchups(goals);
    assert.equal(matchups.length, 2);
    const byeMatchup = matchups.find(m => m.goalA === m.goalB);
    assert.ok(byeMatchup);
    assert.equal(byeMatchup.selected, byeMatchup.goalA);
  });
});

test('generateMatchups input validation', () => {
  assert.throws(() => generateMatchups('not array'), /Goals must be an array/);
  assert.deepEqual(generateMatchups([],1), []);
});

test('getNextRoundMatchups', () => {
  const current = [
    {id:'1', round:1, goalA:'a', goalB:'b', selected:'a'},
    {id:'2', round:1, goalA:'c', goalB:'d', selected:'d'}
  ];
  const next = getNextRoundMatchups(current,2);
  assert.equal(next.length,1);
  const ids = new Set([current[0].selected, current[1].selected]);
  assert.ok(ids.has(next[0].goalA));
  assert.ok(ids.has(next[0].goalB));
});

test('isRoundComplete', () => {
  const m1 = {id:'1',round:1,goalA:'a',goalB:'b',selected:'a'};
  const m2 = {id:'2',round:1,goalA:'c',goalB:'d',selected:null};
  assert.strictEqual(isRoundComplete([m1,m2]), false);
  assert.strictEqual(isRoundComplete([m1,{...m2,selected:'c'}]), true);
  assert.throws(() => isRoundComplete('bad'), /Matchups must be an array/);
});

test('shuffleArray keeps values', () => {
  const arr = [1,2,3];
  withMockedRandom([0.2,0.2], () => {
    const shuffled = shuffleArray(arr);
    assert.deepEqual(arr, [1,2,3]); // original not modified
    assert.deepEqual(new Set(shuffled), new Set(arr));
  });
  assert.throws(() => shuffleArray('bad'), /Input must be an array/);
});

test('calculateRounds', () => {
  assert.equal(calculateRounds(1), 0);
  assert.equal(calculateRounds(2), 1);
  assert.equal(calculateRounds(3), 2);
  assert.throws(() => calculateRounds(-1), /positive number/);
});

test('getCurrentRoundMatchups', () => {
  const m1 = {id:'1',round:1,goalA:'a',goalB:'b',selected:null};
  const m2 = {id:'2',round:2,goalA:'c',goalB:'d',selected:null};
  const list = [m1,m2];
  assert.deepEqual(getCurrentRoundMatchups(list,1), [m1]);
  assert.throws(() => getCurrentRoundMatchups('bad',1), /Matchups must be an array/);
  assert.throws(() => getCurrentRoundMatchups(list,0), /positive number/);
});
