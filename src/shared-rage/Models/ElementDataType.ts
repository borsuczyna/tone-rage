export type ElementDataEntity = PlayerMp | VehicleMp;

export type ElementDataListenerCallback = (element: ElementDataEntity, key: string, oldValue: any, newValue: any) => void;

export interface ElementDataListener {
    key: string;
    callback: ElementDataListenerCallback;
}