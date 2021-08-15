import Decimal from "decimal.js";
import SaveData from "../data/saveData.js";
import { notation } from "../util/functions.js";

export default class UpgradeTree {
    /**
     * @param {object} obj
     * @param {string} obj.UpgradeKey - The parent key of the saveData where bought upgrade's id stored.
     * @param {string} obj.ResourceKey - The key of the resource in saveData.
     * @param {(number|string)[]} obj.IdList - Array that contains Upgrade's id.
     * @param {(number|string|(number|string)[])[]} obj.RequireGrid - Array that specifies Prerequisite upgrade's id. (null = no Prerequisite, Array = any of it)
     * @param {Decimal[]|number[]} obj.CostTable - Array that contains the costs of upgrades.
     * @param {string[]} obj.Descriptions - Array that contains the Descriptions of the upgrades. ($ will replaced by effect of the upgrade)
     * @param {(function(SaveData): Decimal)[]} obj.effects - Array that contains the Effect calculation functions.
     */
    constructor({ UpgradeKey, ResourceKey, IdList, RequireGrid, CostTable, Descriptions, effects }) {
        this.UpgradeKey = UpgradeKey;
        this.ResourceKey = ResourceKey;
        this.IdList = IdList;
        this.RequireGrid = RequireGrid;
        this.CostTable = CostTable;
        this.Descriptions = Descriptions;
        this.effects = effects;

        this.IdMap = new Map(IdList.map((e, i) => [e, i]));
        this.StartPoints = RequireGrid
            .map((e, i) => [e, i]) // Put index
            .filter(e => e[0] === null) // Check if it has no Prerequisite
            .map(e => e[1]) // Get index
            .map(e => this.IdList[e]); // Transfer index to it's id

        this.UpgradeDatas = this.IdList.map(id => {
            const idx = this.IdMap.get(id);

            const data = {
                idx,
                cost: this.CostTable[idx],
                description: this.Descriptions[idx],
                effectFunc: this.effects[idx],
                requires: this.RequireGrid[idx],
                requiredBy: this.RequireGrid
                    .map((e, i) => [e, i]) // Put index
                    .filter(e => {
                        const requires = e[0];
                        return ( !Array.isArray(requires) && requires === id ) ||
                            ( Array.isArray(requires) && requires.some(_id => _id === id) );
                    }) // Find item that contains id
                    .map(e => e[1]) // Get index (Remove require data)
                    .map(e => this.IdList[e]) // Transfer index to it's id
            };
            if (data.requiredBy.length === 0) data.requiredBy = null;
            
            return data;
        });
    }
    /** @type {Map<(number|string), number>} */
    IdMap = new Map;
    /** @type {(number|string)[]} */
    StartPoints = new Array;
    /**
     * @typedef UpgradeData
     * @property {number} idx
     * @property {number|Decimal} cost
     * @property {string} description
     * @property {function(SaveData): Decimal} effectFunc
     * @property {number|string|(number|string)[]} requires
     * @property {(number|string)[]|null} requiredBy
     */
    /** @type {UpgradeData[]} */
    UpgradeDatas = new Array;

    /**
     * @param {number|string} id
     * @return {UpgradeData}
     */
    getUpgradeData(id) {
        return this.UpgradeDatas[this.IdMap.get(id)];
    }

    /**
     * @param {number|string} id 
     * @param {SaveData} saveData 
     */
    unlocked(id, saveData) {
        const UpgradeData = this.getUpgradeData(id);
        const requires = this.RequireGrid[UpgradeData.idx];
        return requires === null ||
            ( !Array.isArray(requires) && saveData[this.UpgradeKey].includes(requires) ) ||
            ( Array.isArray(requires) && requires.some(e => saveData[this.UpgradeKey].includes(e)) )
    }

    /**
     * @param {SaveData} saveData 
     * @returns {(number|string)[]}
     */
    getEndPoints(saveData) {
        let searchingPoints = [...this.StartPoints];
        let endPoints = [];

        while (searchingPoints.length > 0) {
            const searching = searchingPoints.shift();

            const RequiredBy = this.getUpgradeData(searching).requiredBy;
            if (RequiredBy !== null && saveData[this.UpgradeKey].includes(searching)) {
                searchingPoints.push(...RequiredBy)
                searchingPoints = [...new Set(searchingPoints)];
            } else {
                endPoints.push(searching);
            }
        }
        return endPoints.sort((a, b) => a - b);
    }

    /**
     * @param {(number|string)} id 
     * @param {SaveData} saveData 
     */
    canBuy(id, saveData) {
        const UpgradeData = this.getUpgradeData(id);

        return this.unlocked(id, saveData) &&
            saveData[this.ResourceKey].gte(this.CostTable[UpgradeData.idx])
    }

    /**
     * @param {(number|string)} id 
     * @param {SaveData} saveData 
     */
    buy(id, saveData) {
        const UpgradeData = this.getUpgradeData(id);

        if (
            !this.canBuy(id, saveData) &&
            !saveData[this.UpgradeKey].includes(UpgradeData.idx)
        ) return;

        saveData[ResourceKey] = saveData[ResourceKey].sub(this.CostTable[UpgradeData.idx]);
        saveData[UpgradeKey].push(id);
    }

    /**
     * @param {number|string} id 
     * @param {SaveData} saveData 
     * @param { {width: number, height: number} } size
     * @return {string[]}
     */
    upgradeToString(id, saveData, { width=Infinity, height=Infinity }) {
        const UpgradeData = this.getUpgradeData(id);
        const textWidth = width - 2; // -1 button border

        let text = UpgradeData.description;
        text = text.replace("$", notation(UpgradeData.effectFunc(saveData))); // replace $ to effect
        text = Array.from({ length: height-2 }, (_, i) => text.substr(i*textWidth, textWidth)); // spearate text

        let output = [];
        output.push(...text);
        output.push(`Cost: ${notation(UpgradeData.cost)}`);
        
        output = output.map(e => {
            if (textWidth <= e.length) return e;
            const textLength = e.length;
            return " ".repeat(Math.floor((textWidth - textLength)/2)) + e + " ".repeat(Math.ceil((textWidth - textLength)/2));
        }); // Align text
        
        // Make it pretty
        if (this.unlocked(id, saveData)) {
            output[0] = `┌${output[0]}┐`;
            for (let i = 1; i < output.length-1; i++) output[i] = `│${output[i]}│`;
            output[output.length-1] = `└${output[output.length-1]}┘`;
        } else {
            output = output.map(e => ` ${e} `);
        }
        output.unshift((" " + id).padEnd(width)); // put index
        
        return output;
    }
}
