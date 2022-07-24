import { CLEAR_ALL_TOAST, SHOW_TOAST } from "../@types/events";
import { IToastMessage } from "../UI/ToastGroup/Item/Item";
import { GlobalEvent } from "./event-emitter";

class Toast {

  static show(options: IToastMessage) {
    GlobalEvent.get().emit(SHOW_TOAST, options)
  }

  static clearAll() {
    GlobalEvent.get().emit(CLEAR_ALL_TOAST, undefined)
  }

}

export default Toast