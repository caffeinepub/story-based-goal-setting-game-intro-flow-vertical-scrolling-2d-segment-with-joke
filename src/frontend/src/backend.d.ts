import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WallOfFameEntry {
    id: bigint;
    name: string;
}
export interface backendInterface {
    addEntry(id: bigint, name: string): Promise<void>;
    generateId(): Promise<bigint>;
    getAllEntries(): Promise<Array<WallOfFameEntry>>;
    getEntries(): Promise<Array<WallOfFameEntry>>;
    getEntriesCount(): Promise<bigint>;
}
