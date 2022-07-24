import EventEmitter from "events";

type eventListenerCallbackType<D> = (data: D) => void

export class GlobalEvent {

  private _event: EventEmitter
  private static _instance: GlobalEvent

  private constructor() {
    this._event = new EventEmitter()
  }

  static get() {
    if (!this._instance) {
      GlobalEvent._instance = new GlobalEvent()
    }

    return this._instance
  }

  subscribe<D>(eventName: string, callback: eventListenerCallbackType<D>) {
    this._event.addListener(eventName, (data: D) => {
      callback(data)
    })
  }

  emit<D = any>(eventName: string, data: D) {
    this._event.emit(eventName, data)
  }

  unsubscribe<D = any>(eventName: string, callback: eventListenerCallbackType<D>) {
    //this._event.removeListener(eventName,callback)
    //this._event.off(eventName,callback)
    this._event.removeAllListeners(eventName)
  
 
  }

}