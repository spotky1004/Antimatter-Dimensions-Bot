import Decimal from "decimal.js";
import { notation } from "../../util/functions.js";
import { NotationLength } from "../../data/literal.js";
import Upgrade from '../../class/Upgrade.js';
import AntimatterGalaxy from "./AntimatterGalaxy.js";

export default new Upgrade({
    name: "Tickspeed",
    cost(bought) {
        return new Decimal(10).pow(bought.add(3))
    },
    effect(bought, saveData) {
        return new Decimal(AntimatterGalaxy.effect(saveData.AntiGalaxy, saveData)).pow(bought).mul(1000);
    },
    toString(saveData) {
        const bought = saveData.TickSpeed;
        return `Tickspeed (${notation(new Decimal(1).sub(AntimatterGalaxy.effect(saveData.AntiGalaxy, saveData)).mul(100))}%): ${notation(this.effect(bought, saveData)).padEnd(NotationLength)} [Cost: ${notation(this.cost(bought)).padEnd(NotationLength)}]`;
    },
    canBuy(saveData) {
        return saveData.Dimensions[1].have.gte(1) && saveData.Antimatter.gte(this.cost(saveData.TickSpeed));
    },
    buy(saveData, max=false) {
        if (saveData.Antimatter.eq(0)) return;
        const bulkAmount = saveData.Antimatter.log(10).sub(3).floor().add(1);
        if (bulkAmount.gt(saveData.TickSpeed)) {
            if (max) {
                saveData.Antimatter.sub(this.cost(bulkAmount.sub(1)));
                saveData.TickSpeed = bulkAmount;
            } else {
                saveData.Antimatter = saveData.Antimatter.sub(this.cost(saveData.TickSpeed));
                saveData.TickSpeed = saveData.TickSpeed.add(1);
            }
        }
    }
});
