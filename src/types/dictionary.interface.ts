
export interface IDictionary<TKey, TValue> {
    keys: TKey[];
    values: TValue[];

    isEmpty: boolean;
    count: number;
    add(key: TKey, value: TValue);
    remove(key: TKey);
    clear();
    containsKey(key: TKey): boolean;
}
