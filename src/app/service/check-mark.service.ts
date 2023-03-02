import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FingerprintService } from "./fingerprint.service";

@Injectable({
    providedIn: "root"
})
export class CheckMarkService {
    private successSubject = new BehaviorSubject<boolean>(false);
    successAction$ = this.successSubject.asObservable();
    private failSubject = new BehaviorSubject<boolean>(false);
    failAction$ = this.failSubject.asObservable();
    

    showSuccess() {
        this.successSubject.next(true)
    }

    hideSuccess() {
        this.successSubject.next(false);
    }

    showFail() {
        this.failSubject.next(true);
    }

    hideFail() {
        this.failSubject.next(false);
    }

    hideAll() {
        this.hideSuccess();
        this.hideFail();
    }
}