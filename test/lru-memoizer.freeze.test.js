const memoizer = require('./..');
const assert = require('chai').assert;

describe('lru-memoizer (clone)', function () {
  var loadTimes = 0, memoized;

  beforeEach(function () {
    loadTimes = 0;

    memoized = memoizer({
      load: function (key, callback) {
        loadTimes++;
        callback(null, { foo: 'bar' });
      },
      hash: function (key) {
        return key;
      },
      freeze: true
    });
  });

  it('should return a clone every time with the same cached structure', function (done) {
    memoized('test', function (err, r1) {

      assert.isNull(err);
      assert.strictEqual(loadTimes, 1);
      assert.equal(r1.foo, 'bar');
      r1.foo = 'bax';
      assert.isFrozen(r1);

      memoized('test', function (err, r2) {
        assert.isNull(err);

        assert.strictEqual(loadTimes, 1);
        assert.equal(r2.foo, 'bar');
        assert.strictEqual(r1, r2);
        assert.isFrozen(r2);

        done();
      });
    });
  });

});

