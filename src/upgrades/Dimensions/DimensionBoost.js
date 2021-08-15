import Decimal from "decimal.js";
import { notation } from "../../util/functions.js";
import { Prestige } from "../../util/game.js";
import { NotationLength } from "../../data/literal.js";
import Upgrade from "../../class/Upgrade.js";
import { OrdinalNumbers } from "../../data/literal.js";
// Infinity
import InfinityUpgrades from "../Infinity/InfinityUpgrades.js";

export default new Upgrade({
    name: "DimBoost",
    cost(bought, saveData) {
        let cost;

        if (bought.lt(4)) cost = new Decimal(20);
        else cost = new Decimal(20).add(new Decimal(15).mul(bought.sub(4)));

        // Infinity
        cost = InfinityUpgrades.applyEffect(4, saveData, cost, "sub");

        return cost;
    },
    /**
     * @param {Decimal} bought 
     */
    costDimTier(bought) {
        return Math.min(7, bought.toNumber()+3);
    },
    effect(bought, saveData) {
        let base = new Decimal(2);
        base = InfinityUpgrades.applyEffect(11, saveData, base, "mul");

        return new Decimal(base).pow(bought);
    },
    canBuy(saveData) {
        const bought = saveData.DimBoost;
        return saveData.Dimensions[this.costDimTier(bought)].have.gte(this.cost(bought, saveData));
    },
    toString(saveData) {
        const bought = saveData.DimBoost;
        const namespace = bought.gte(4) ? "Dimension Boost" : "Dimension Shift";

        let output = "";
        output += namespace.padEnd(19);
        output += " " + `(${notation(bought)})`.padEnd(NotationLength+2);
        output += " " + `: requires ${notation(this.cost(bought, saveData)).padEnd(NotationLength)}`;
        output += " " + (OrdinalNumbers[this.costDimTier(bought)] + " Dimensions").padEnd(18);

        return output;
    },
    buy(saveData, max=false) { // TODO: make max
        if (this.canBuy(saveData)) {
            saveData.DimBoost = saveData.DimBoost.add(1);

            Prestige.DimensionBoost(saveData);
        }
    }
});