export function compareObjects(obj1, obj2) {
  const differences = {};

  const allKeys = new Set([
    ...Object.keys(obj1 || {}),
    ...Object.keys(obj2 || {}),
  ]);

  for (const key of allKeys) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (value1 !== value2) {
      differences[key] = value2;
    }
  }

  return differences;
}
