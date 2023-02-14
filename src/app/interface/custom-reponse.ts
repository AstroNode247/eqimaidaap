import { Fingerprint } from "./fingerprint";
import { User } from "./user";

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data: { users?: User[], user?: User, fingerprint?: Fingerprint, fingerprints?: Fingerprint[] }
}