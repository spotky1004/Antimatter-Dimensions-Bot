import Decimal from "decimal.js";
import SaveData from "../data/saveData.js";

export default class Upgrade {
    /**
     * @typedef {object} UpgradeConstructor
     * @property {function(Decimal): Decimal} cost
     * @property {function(Decimal, SaveData?): Decimal} effect
     * @property {function(SaveData): string} toString
     * @property {function(SaveData): boolean} canBuy
     * @property {function(SaveData, boolean): undefined} buy
     */
    /**
     * @param {UpgradeConstructor} obj
     */
    constructor({ cost, effect, toString, canBuy, buy }) {
        for (const key in arguments[0]) {
            if (this.#baseArguments.includes(key)) continue;
            this[key] = arguments[0][key];
        }
        
        this.cost = cost ?? ((_) => {return { amount: new Decimal(Infinity), resource: ["Antimatter"] } });
        this.effect = effect ?? ((_) => new Decimal(0));
        this.toString = toString ?? ((_) => {});
        this.canBuy = canBuy;
        this.buy = buy;
    }
    cost = new Function;
    effect = new Function;
    toString = new Function;
    canBuy = new Function;
    buy = new Function;

    #baseArguments = ["cost", "effect", "toString", "canBuy", "buy"];
}
