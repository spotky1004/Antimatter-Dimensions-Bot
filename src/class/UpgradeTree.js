import Decimal from "decimal.js";
import SaveData from "../data/saveData.js";
import { notation } from "../util/functions.js";

export default class UpgradeTree {
    /**
     * @param {object} obj
     * @param {string} obj.UpgradeKey - The parent key of the saveData where bought upgrade's id stored.
     * @param {Decimal[]|number[]} obj.CostTable - Array that contains the costs of upgrades.
     * @param {string} obj.ResourceKey - The key of the resource in saveData.
     * @param {number[]} obj.RequireGrid - Array that specifies Prerequisite upgrade.
     * @param {string[]} obj.Descriptions - Array that contains the Descriptions of the upgrades. ($ will replaced by effect of the upgrade)
     * @param {(function(SaveData): Decimal)[]} obj.effects - Array that contains the Effect calculation functions.
     */
    constructor({ UpgradeKey, CostTable, ResourceKey, RequireGrid, Descriptions, effects }) {
        this.UpgradeKey = UpgradeKey;
        this.CostTable = CostTable;
        this.ResourceKey = ResourceKey;
        this.RequireGrid = RequireGrid;
        this.Descriptions = Descriptions;
        this.effects = effects;
    }

    /**
     * @param {number} id 
     * @param {SaveData} saveData 
     */
    unlocked(id, saveData) {
        return this.RequireGrid[id] === null || saveData[this.UpgradeKey].includes(this.RequireGrid[id]);
    }

    /**
     * @param {number} id 
     * @param {SaveData} saveData 
     */
    canBuy(id, saveData) {
        return this.unlocked(id, saveData) &&
            saveData[CostTable].gte(CostTable[id]) &&
            !saveData[this.UpgradeKey].includes(id);
    }

    /**
     * @param {number} id 
     * @param {SaveData} saveData 
     */
    buy(id, saveData) {
        if (!this.canBuy(id, saveData));

        saveData[CostTable] = saveData[CostTable].sub(this.CostTable[id]);
        saveData[UpgradeKey].push(id);
    }

    /**
     * @typedef UpgradeData
     * @property {number|Decimal} cost
     * @property {number} requires
     * @property {string} description
     * @property {function(SaveData): Decimal} effectFunc
     */
    /**
     * @param {number} id
     * @return {UpgradeData}
     */
    getUpgradeData(id) {
        return {
            cost: this.CostTable[id],
            requires: this.RequireGrid[id],
            description: this.Descriptions[id],
            effectFunc: this.effects[id]
        };
    }

    /**
     * @param {number} id 
     * @param {SaveData} saveData 
     * @param { {width: number, height: number} } size
     * @return {string[]}
     */
    upgradeToString(id, saveData, { width=Infinity, height=Infinity }) {
        const UpgradeData = this.getUpgradeData(id);

        let text = UpgradeData.description;
        text = text.replace("$", notation(UpgradeData.effectFunc(saveData))); // replace $ to effect
        text = Array.from({ length: height-1 }, (_, i) => text.substr(i*width, width)); // spearate text

        let output = [];
        output.push(...text);
        output.push(`Cost: ${notation(UpgradeData.cost)}`);

        output = output.map(e => {
            if (width <= e.length) return e;
            const textLength = e.length;
            return " ".repeat(Math.floor((width - textLength)/2)) + e + " ".repeat(Math.ceil((width - textLength)/2));
        }); // Align text

        // Make it pretty
        if (this.unlocked(id, saveData)) {
            output[0] = `┌${output[0]}┐`;
            for (let i = 1; i < output.length-1; i++) output[i] = `│${output[i]}│`;
            output[output.length-1] = `└${output[output.length-1]}┘`;
        } else {
            output = output.map(e => ` ${e} `);
        }

        return output;
    }
}
