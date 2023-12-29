import { EventCB } from "../data";

type Constructor = new (...args: any[]) => {};


export default function StateEventMixin<TBase extends Constructor>(Base:TBase) {
    class StateEvent extends Base{
        private static _listener = new Map<any, EventCB<object>[]>();
    
        private static _getListener(state:any): EventCB<object>[]{
            if(!this._listener.has(state))
                this._listener.set(state, []);
    
            return this._listener.get(state)!;
        }
    
        static trigger(state:any, obj:object){ 
            this._getListener(state).forEach(fn => fn(obj)); 
        }
        static addEventListener(state:any, cb:EventCB<object>){ 
            this._getListener(state).push(cb); 
        }
        static removeEventListener(state:any, cb:EventCB<object>){ 
            let removedList = this._getListener(state)?.filter(fn => fn !== cb);
            this._listener.set(state, removedList ?? []);
        }
    }

    return StateEvent;
};