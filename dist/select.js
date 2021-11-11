function isObject(obj) {
    let type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}
function isValidMap(map) {
    return Array.isArray(map) || isObject(map);
}
function normalizeMap(map) {
    if (!isValidMap(map)) {
        return [];
    }
    return Array.isArray(map)
        ? map.map((key) => ({ key, val: key }))
        : Object.keys(map).map((key) => ({ key: key, val: map[key] }));
}
export function select(store, map) {
    if (!isValidMap(map)) {
        console.error('[use-mobx] select: mapping must be either an Array or an Object');
    }
    return (res = {}) => {
        normalizeMap(map).forEach(({ key, val }) => {
            Object.defineProperty(res, key, { get: () => store[val], enumerable: true });
        });
        return res;
    };
}
