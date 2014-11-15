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
  it("should find intersection", function() {
    expect(ArrayUtil).toBeDefined();
    expect(ArrayUtil.intersection).toBeDefined();
    expect(ArrayUtil.intersection([], []).length).toBe(0);
    expect(ArrayUtil.intersection([1, 2, 3], [1, 4]).length).toBe(1);
    expect(ArrayUtil.intersection(['1', '4'], ['1', '2', '3']).length).toBe(
      1);
    expect(ArrayUtil.intersection([1, 2, 3], [1, 2, 3]).length).toBe(3);
    expect(ArrayUtil.intersection(['1', '2', 3], ['0', 2, 3]).length).toBe(
      1);
  });
});