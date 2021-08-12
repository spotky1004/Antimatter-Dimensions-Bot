import Upgrade from "../class/Upgrade.js";
import { OrdinalNumbers } from "../data/literal.js";

export default new Upgrade({
    name: "DimBoost",
    cost(bought) {
        if (bought.lt(4)) return new Decimal(20);
        return new Decimal(20).add(new Decimal(15).mul(bought.sub(4)));
    },
    /**
     * @param {Decimal} bought 
     */
    costDimTier(bought) {
        return Math.min(7, bought.toNumber()+3);
    },
    effect(bought) {
        return new Decimal(2).pow(bought);
    },
    canBuy(saveData) {
        const bought = saveData.DimBoost;
        return saveData.Dimensions[this.costDimTier(bought)].have.gte(this.cost(bought));
    },
    toString(saveData) {
        const bought = saveData.DimBoost;
        const namespace = bought.gte(4) ? "Dimension Boost" : "Dimension Shift";

        let output = "";
        output += namespace.padEnd(19, " ");
        output += " " + `(${notation(bought)})`.padEnd(9, " ");
        output += " " + `: requires ${notation(this.cost(bought)).padEnd(7, " ")}`;
        output += " " + (OrdinalNumbers[this.costDimTier(bought)] + " Dimensions").padEnd(18, " ");

        return output;
    },
    buy(saveData, max=false) { // TODO: make max
        if (DimensionBoost.canBuy(saveData)) {
            saveData.DimBoost = saveData.DimBoost.add(1);

            saveData.Antimatter = new Decimal(10);
            for (let i = 0; i < 8; i++) {
                const _DimData = saveData.Dimensions[i];
                _DimData.have = new Decimal(0);
                _DimData.bought = new Decimal(0);
            }
            saveData.TickSpeed = new Decimal(0);
            saveData.DimSacrifice = new Decimal(0);
        }
    }
});