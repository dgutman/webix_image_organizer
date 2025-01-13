class Datastore{
    constructor(){
        this._map = new WeakMap();
    }
    set(element, key, value) {
        if (!this._map.has(element)) {
            this._map.set(element, new Map());
        }
        if(typeof key === 'object'){
            const obj = key;
            const e = this._map.get(element);
            for(const [key, value] of Object.entries(obj)){
                e.set(key, value);
            }
        } else {
            this._map.get(element).set(key, value);
        }
        
    }
    get(element, key) {
        if (!this._map.has(element)) {
            this._map.set(element, new Map());
            return; //return undefined by default
        }
        if(typeof key === 'undefined'){
            return Object.fromEntries(this._map.get(element));
        } else {
            return this._map.get(element).get(key);
        }
    }
    remove(element, key) {
        if (!this._map.has(element)) {
            return;
        }
        var ret = this._map.get(element).delete(key);
        if (this._map.get(element).size === 0) {
            this._map.delete(element);
        }
        return ret;
    }
}

const datastore = new Datastore();
export { datastore };