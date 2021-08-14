import Decimal from "decimal.js";
import { notation } from "../../util/functions.js";
import { Prestige } from "../../util/game.js";
import { NotationLength } from "../../data/literal.js";
import Upgrade from "../../class/Upgrade.js";

const GalaxyEffect = [
    [11, 12, 14, 17.09844, 20, 22.8, 25.502, 28.10943, 30.6256, 33.0537, 35.39682],
    [11, 14, 18, 20, 25.502, 30.6256, 35.39682, 39.83991, 43.97742, 47.83037, 51.41834],
    [7, 9, 11, 13.98963, 17, 19.905, 22.70833, 25.41353, 28.02406, 30.54322, 32.97421],
    [7, 11, 15, 17, 22.70833, 28.02406, 32.97421, 37.5839, 41.87657, 45.87401, 49.59652],
    [11, 16, 22, 22.8, 30.6256, 37.65794, 43.97742, 49.65631, 54.75954, 59.34547, 63.46653],
    [7, 13, 19, 19.905, 28.02406, 35.32011, 41.87657, 47.76842, 53.06302, 57.82093, 62.09653],
    [11, 16.06, 22.12, 22.88247, 30.77374, 37.85751, 44.21642, 49.92463, 55.04874, 59.6485, 63.77758],
    [11, 16.6, 23.2, 23.62073, 32.09283, 39.62519, 46.32205, 52.27609, 57.56969, 62.27612, 66.46051],
    [11, 16.666, 23.332, 23.71048, 32.25232, 39.83776, 46.5739, 52.55581, 57.86795, 62.58531, 66.77449]
]; // Tickspeed effect table from [https://antimatter-dimensions.fandom.com/wiki/Ticks#Tickspeed_upgrades]

export default new Upgrade({
    name: "AntiGalaxy",
    cost(bought) {
        return new Decimal(80).add(bought.mul(60));
    },
    effect(bought) {
        return new Decimal(1).sub(GalaxyEffect[0][bought.toNumber()]/100);
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

        Prestige.AntimatterGalaxy(saveData)
    }
});