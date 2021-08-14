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
        if (typeof cost !== "undefined") this.cost = cost;
        if (typeof effect !== "undefined") this.effect = effect;
        if (typeof toString !== "undefined") this.toString = toString;
        if (typeof canBuy !== "undefined") this.canBuy = canBuy;
        if (typeof buy !== "undefined") this.buy = buy;

        for (const key in arguments[0]) {
            if (this.#baseArguments.includes(key)) continue;
            this[key] = arguments[0][key];
        }
    }

    #baseArguments = ["cost", "effect", "toString", "canBuy", "buy"];
}
