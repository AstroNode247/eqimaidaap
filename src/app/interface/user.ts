import { Fingerprint } from "./fingerprint";

export interface User {
    id?: number;
    uid: string | null;
    firstName?: string;
    lastName?: string;
    entity?: string;
    fingerprint?: Fingerprint[];
}