import Decimal from "decimal.js";
import { notation } from "../../util/functions.js";
import { NotationLength } from "../../data/literal.js";
import Upgrade from "../../class/Upgrade.js";

export default new Upgrade({
    name: "AntiGalaxy",
    cost(bought) {
        return new Decimal(80).add(bought.mul(60));
    },
    effect(bought) {
        return new Decimal(100).mul(
            new Decimal(0.8).mul(
                new Decimal(0.965).pow(
                    new Decimal(bought.add(1)).sub(2).mul(1).sub(2)
                )
            )
        ).div(100);
    },
    canBuy(saveData) {
        return saveData.Dimensions[7].have.gte(this.cost(saveData.AntiGalaxy));
    },
    toString(saveData) {
        const bought = saveData.AntiGalaxy;

        let output = "";
        output += "Antimatter Galaxies";
        output += " " + `(${notation(bought)})`.padEnd(NotationLength+2);
        output += " " + `: requires ${notation(this.cost(bought)).padEnd(NotationLength)} Eighth Dimensions `;

        return output;
    },
    buyFunc(saveData, max=false) { // TODO: max buy
        if (!AntiGalaxy.canBuy(saveData)) return;

        saveData.AntiGalaxy = saveData.AntiGalaxy.add(1);

        saveData.DimBoost = new Decimal(0);
        saveData.Antimatter = new Decimal(10);
        for (let i = 0; i < 8; i++) {
            const _DimData = saveData.Dimensions[i];
            _DimData.have = new Decimal(0);
            _DimData.bought = new Decimal(0);
        }
        saveData.TickSpeed = new Decimal(0);
        saveData.DimSacrifice = new Decimal(0);
    }
});