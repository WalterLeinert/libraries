import { IUniqueIdentifiable } from './uniqueIdentifiable.interface';
export declare abstract class Identifiable implements IUniqueIdentifiable {
    readonly abstract instanceId: number;
}
export declare abstract class UniqueIdentifiable extends Identifiable {
    private static __id;
    private _instanceId;
    protected constructor();
    readonly instanceId: number;
}
