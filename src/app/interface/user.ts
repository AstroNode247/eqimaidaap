import { Fingerprint } from "./fingerprint";

export interface User {
    id?: number;
    uid: number | null;
    firstName?: string;
    lastName?: string;
    entity?: string;
    fingerprint?: Fingerprint[];
}