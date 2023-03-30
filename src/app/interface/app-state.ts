import { ActionState } from "../enum/action-state.enum";
import { DataState } from "../enum/data-state.enum";

export interface AppState<T> {
    dataState: DataState;
    actionState: ActionState;
    appData?: T;
    error?: string;
}