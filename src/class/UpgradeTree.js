import Decimal from "decimal.js";
import SaveData from "../data/saveData.js";

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

    canBuy(id, saveData) {
        if (
            saveData[this.UpgradeKey].includes(RequireGrid[id]) ||
            saveData[CostTable].gte(CostTable[id]) ||
            !saveData[this.UpgradeKey].includes(id)
        ) return true;
        return false;
    }

    buy(id, saveData) {
        if (!this.canBuy(id, saveData));

        saveData[CostTable] = saveData[CostTable].sub(this.CostTable[id]);
        saveData[UpgradeKey].push(id);
    }
}
