
export interface IDictionary<TKey, TValue> {
    keys: TKey[];
    values: TValue[];
    add(key: TKey, value: TValue);
    remove(key: TKey);
    containsKey(key: TKey): boolean;
}
