import Discord from "discord.js";
import Decimal from "decimal.js";

import * as SaveLoad from "./saveload.js";
import SaveData from "./saveData.js";

class Upgrade {
    constructor({ name }) {
        this.name = name;
    }
    name = new String;

    /**
     * @param {Decimal} bought 
     * @returns {Decimal} - Cost of the upgrade
     */
    cost(bought) {
        return new Decimal(1);
    }

    /**
     * @param {SaveData} saveData
     * @returns {string}
     */
    toString(saveData) {
        return "";
    }
}

const _OrdinalNumbers = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"];
const _DimensionBaseCosts = [1, 2, 4, 6, 9, 13, 18, 24];
const _DimensionCostIncreases = [3, 4, 5, 6, 8, 10, 12, 15];
class Dimension extends Upgrade {
    constructor({ tier }) {
        super({
            name: `${_OrdinalNumbers[tier]} Dimension`,
        })
        this.tier = tier;
    }
    tier = new Number;

    /**
     * @param {Decimal} bought 
     * @returns {Decimal} - Cost of the upgrade
     */
    cost(bought) {
        return new Decimal(10).pow(_DimensionBaseCosts[this.tier] ?? 0).mul(new Decimal(10).pow(_DimensionCostIncreases[this.tier]).pow(bought.div(10).floor()));
    }

    /**
     * Production multiply based on bought.
     * @param {Decimal} bought 
     * @returns {Decimal} 
     */
    mult(bought) {
        return new Decimal(2).pow(bought.div(10).floor());
    }

    /**
     * Production of this Dimension.
     * @param {Decimal} have 
     * @param {Decimal} bought 
     * @returns {Decimal}
     */
    production(have, bought) {
        return have.mul(this.mult(bought));
    }

    /**
     * @param {SaveData} saveData
     * @param {Dimension[]} a 
     * @returns 
     */
    toString(saveData, a) {
        const DimData = saveData.Dimensions[this.tier];

        let output = "";
        output += (this.name).padEnd(18, " ");
        output += " " + (`x${notation(this.mult(DimData.bought))}`).padEnd(8, " ");
        output += " " + `${notation(DimData.have).padEnd(9, " ")}` + `(${notation(DimData.bought)})`.padEnd(9, " ");
        if (this.tier !== 7) {
            const nextDimData = saveData.Dimensions[this.tier+1];
            const nextProduction = a[this.tier+1].production(nextDimData.have, nextDimData.bought);
            const per = nextProduction.div(DimData.have).mul(100).toNumber();

            output += " " + (`(+${!isNaN(per) ? per.toString().substr(0, 4) : "0.00"}%)`).padEnd(9, " ");
        } else {
            output += " ".repeat(10);
        }
        output += " " + `[Cost: ${notation(this.cost(DimData.bought))}]`.padEnd(15, " ");

        return output;
    }
}

const TickSpeedUpgrade = new Upgrade({
    name: "Tickspeed",
    cost: function (bought) {
        return new Decimal(10).pow(bought.add(3));
    },
    effect: function (bought) {
        return new Decimal(0.9).pow(bought);
    },
    /**
     * @param {SaveData} saveData 
     * @returns {string}
     */
    toString: function (saveData) {
        const bought = saveData.TickSpeed;
        return `Tickspeed: ${this.effect(bought)} [Cost: ${this.cost(bought)}]`;
    },
});
const Dimensions = Array.from({ length: 8 }, (_, i) => new Dimension({ tier: i }));

/**
 * Apply notation to the number.
 * @param {Decimal|number} x 
 * @returns {string}
 */
function notation(x) {
    x = new Decimal(x);

    if (x.lt(1e3)) {
        return x.floor(0).toString();
    } else if (x.lt(new Decimal(2).pow(1024))) {
        return x.div(new Decimal(10).pow(x.log(10).floor())).toFixed(3-x.log(10).log(10).floor().toNumber()) + "e" + x.log(10).floor().toString();
    } else {
        return "Infinite";
    }
}

/**
 * @returns {Discord.MessageOptions} - Display of the Game
 */
export function tick(id, buttonFunc) {
    /** @type {SaveData} */
    const saveData = SaveLoad.load(id);

    const Time = new Date().getTime();
    const dt = (Time - saveData.LastTick)/1000;
    saveData.LastTick = Time;

    const Cache = {
        UnlockedDims: [1]
    };

    // Compute buttonFunc
    for (let i = 0; i < buttonFunc.length; i++) {
        /** @type {string[]} */
        const rawFunc = buttonFunc[i].split("_");

        const funcName = rawFunc.shift();
        const funcParam = rawFunc;
        if (funcName.startsWith("BuyDimension")) {
            const Tier = +funcParam[0] - 1;
            
            const _DimData = saveData.Dimensions[Tier];
            const cost = Dimensions[Tier].cost(_DimData.bought);
            if (saveData.Antimatter.gte(cost)) {
                saveData.Antimatter = saveData.Antimatter.sub(cost);
                _DimData.bought = _DimData.bought.add(1);
                _DimData.have = _DimData.have.add(1);
            }
        }
    }

    // ComputeTick
    for (let Tier = 7-1; Tier >= 0; Tier--) {
        const _DimData = saveData.Dimensions[Tier];
        const _NextDimData = saveData.Dimensions[Tier+1];
        if (_DimData.bought.gte(1)) Cache.UnlockedDims.push(Tier+2);
        _DimData.have = _DimData.have.add(Dimensions[Tier+1].production(_NextDimData.have, _NextDimData.bought).mul(dt));
    }
    const AntimatterProduction = Dimensions[0].production(
        saveData.Dimensions[0].have,
        saveData.Dimensions[0].bought
    )
    saveData.Antimatter = saveData.Antimatter.add(AntimatterProduction.mul(dt));

    // fix
    Cache.UnlockedDims.sort((a, b) => a-b)

    // Display
    let output = [];
    output.push(`You have ${notation(saveData.Antimatter)} Antimatters (+${notation(AntimatterProduction)}/s)`);
    output.push("");
    for (let i = 0; i < 8; i++) {
        if (Cache.UnlockedDims.includes(i+1)) output.push(Dimensions[i].toString(saveData, Dimensions));
        else output.push("");
    }

    const width = 80; // max char = 2000 -> max 25 lines
    output = output.map(e => {
        const len = e.length;
        const whitespace = (width-len)/2;
        return `│${" ".repeat(Math.floor(whitespace))}${e}${" ".repeat(Math.ceil(whitespace))}│`;
    });
    output.unshift(`┌${"─".repeat(width)}┐\n│${" ".repeat(width-6)}- □ x │\n├${"─".repeat(width)}┤`);
    output.push(`└${"─".repeat(width)}┘`); // Window display by plat
    output = output.join("\n");

    // Compnents
    let components = [];

    const DimensionsBtn = Cache.UnlockedDims.map(e => {
        const Tier = e-1;
        const cost = Dimensions[Tier].cost(saveData.Dimensions[Tier].bought);
        const canAfford = saveData.Antimatter.gte(cost);
        return {
            type: "BUTTON",
            custom_id: "BuyDimension_"+e,
            label: "D"+e,
            disabled: !canAfford,
            style: canAfford ? "SUCCESS" : "DANGER"
        }
    });
    
    components.push({
        type: "ACTION_ROW",
        components: DimensionsBtn.slice(0, 5)
    });
    if (DimensionsBtn.length > 5) components.push({
        type: "ACTION_ROW",
        components: DimensionsBtn.slice(5, 10)
    });


    SaveLoad.save(id, saveData);
    return {
        content: `\`\`\`\n${output}\n\`\`\``,
        components
    }
}