import {AppStore} from "./AppStore";
import {AuthStore} from "./AuthStore";

export class RootStore {
    appStore: AppStore;
    authStore: AuthStore;

    constructor() {
        this.appStore = new AppStore();
        this.authStore = new AuthStore();
    }
}
export const store = new RootStore()
