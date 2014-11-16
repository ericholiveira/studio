ArrayUtil = require('../../compiled/core/util/arrayUtil');

describe("An arrayUtils", function() {
  it("should recognize an array", function() {
    expect(ArrayUtil).toBeDefined();
    expect(ArrayUtil.isArray).toBeDefined();
    expect(ArrayUtil.isArray([])).toBe(true);
    expect(ArrayUtil.isArray([1])).toBe(true);
    expect(ArrayUtil.isArray([1, 2])).toBe(true);
    expect(ArrayUtil.isArray({})).toBe(false);
    expect(ArrayUtil.isArray(1)).toBe(false);
    expect(ArrayUtil.isArray('1')).toBe(false);
    expect(ArrayUtil.isArray(null)).toBe(false);
  });
});