import Decimal from "decimal.js";
import { notation } from "../../util/functions.js";
import { NotationLength } from "../../data/literal.js";
import Upgrade from "../../class/upgrade.js";
import { DimensionBaseCosts, DimensionCostIncreases, OrdinalNumbers } from "../../data/literal.js";
import Tickspeed from "./Tickspeed.js";
import DimensionBoost from "./DimensionBoost.js";

/**
 * @typedef {object} Dimension
 * @property {number} tier
 * @property {string} name
 * @property {function(Decimal): UpgradeCostReturn} cost
 * @property {function(Decimal): Decimal} effect
 * @property {function(SaveData): string} toString
 * @property {function} buyFunc
 */

/** @type {Dimension[]} */
const Dimensions = Array.from({ length: 8 }, (_, i) => new Upgrade({
    tier: i,
    name: `${OrdinalNumbers[i]} Dimension`,
    cost(bought) {
        return new Decimal(10).pow(DimensionBaseCosts[this.tier] ?? 0).mul(
            new Decimal(10).pow(DimensionCostIncreases[this.tier]).pow(bought.div(10).floor())
        );
    },
    /**
     * @param {SaveData} saveData 
     * @returns {Decimal}
     */
    mult(saveData) {
        let mult = new Decimal(2)
            .pow(saveData.Dimensions[this.tier].bought.div(10).floor())
            .mul( Decimal.max(1, DimensionBoost.effect(saveData.DimBoost).div(new Decimal(2).pow(this.tier)) ) );

        if (this.tier === 7) mult = mult.mul(DimensionBoost.effect(saveData.DimSacrifice));

        return mult;
    },
    /**
     * @param {SaveData} saveData 
     * @returns {Decimal}
     */
    production(saveData) {
        return saveData.Dimensions[this.tier].have
            .mul(this.mult(saveData))
            .mul( new Decimal(1000).div(Tickspeed.effect(saveData.TickSpeed, saveData)) );
    },
    /**
     * @param {SaveData} saveData
     * @param {Dimension[]} a 
     * @returns 
     */
    toString(saveData, a) {
        const DimData = saveData.Dimensions[this.tier];

        let output = "";
        output += (this.name).padEnd(18);
        output += " " + `x${notation(this.mult(saveData)).padEnd(NotationLength)}`;
        output += " " + `${notation(DimData.have).padEnd(NotationLength)} ` + `(${notation(DimData.bought)})`.padEnd(NotationLength+2);
        if (this.tier !== 7) {
            const nextProduction = a[this.tier+1].production(saveData);
            const per = nextProduction.div(DimData.have).mul(100).toNumber();

            output += " " + (`(+${!isNaN(per) ? per.toString().substr(0, 4) : "0.00"}%)`).padEnd(9, " ");
        } else {
            output += " ".repeat(10);
        }
        output += " " + `[Cost: ${notation(this.cost(DimData.bought)).padEnd(NotationLength)}]`;

        return output;
    },
    canBuy(saveData) {
        return this.tier <= saveData.DimBoost.add(3).toNumber() && saveData.Antimatter.gte(this.cost(saveData.Dimensions[this.tier].bought));
    },
    buy(saveData, max=false) {
        const tier = this.tier;
    
        const _DimData = saveData.Dimensions[tier];
    
        if (max) {
            if (saveData.Antimatter.eq(0)) return;
    
            const bulkAmount = saveData.Antimatter.log(10).sub(1).sub(DimensionBaseCosts[tier]).div(DimensionCostIncreases[tier]).floor().add(1).mul(10);
            if (bulkAmount.gt(_DimData.bought)) {
                const sub = bulkAmount.sub(_DimData.bought);
                
                saveData.Antimatter = saveData.Antimatter.sub(this.cost(bulkAmount.sub(1)).mul(sub.mod(10)));
                
                _DimData.have = _DimData.have.add(sub);
                _DimData.bought = bulkAmount;
            }
        } else {
            const cost = this.cost(_DimData.bought);
            if (saveData.Antimatter.gte(cost)) {
                saveData.Antimatter = saveData.Antimatter.sub(cost);
                _DimData.bought = _DimData.bought.add(1);
                _DimData.have = _DimData.have.add(1);
            }
        }
    }
}));

export default Dimensions;