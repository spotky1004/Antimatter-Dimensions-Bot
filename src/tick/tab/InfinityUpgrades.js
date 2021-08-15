import Decimal from "decimal.js"
import { InfinityUpgrades } from "../../upgrades/_init.js";
import { startDimBoost, startGalaxy } from "../../util/game.js";
import TickFunc from "../../types/tickFunc.js";



/** @type {TickFunc} */
export default function(dt, saveData, event) {
    // Compute event
    if (event.has("BuyInfinityUpgrade")) InfinityUpgrades.buy(event.get("BuyInfinityUpgrade"), saveData);



    // Display
    let output = new Array(16).fill("");
    for (let i = 1; i <= 16; i++) {
        const text = InfinityUpgrades.upgradeToString(i, saveData, { width: 20, height: 4 });
        for (let j = 0; j < 4; j++) output[((i-1)%4)*4 + j] += text[j];
    }

    // Infinity Upgrades work
    saveData.InfinityPoint = saveData.InfinityPoint.add(InfinityUpgrades.getEffect(12, saveData).mul(dt));
    saveData.DimBoost = Decimal.max(saveData.DimBoost, startDimBoost(saveData));
    saveData.AntiGalaxy = Decimal.max(saveData.AntiGalaxy, startGalaxy(saveData));



    // Compnents
    const unlockedUpgrades = InfinityUpgrades.getEndPoints(saveData);

    let buttons;
    if (unlockedUpgrades.length > 0) {
        buttons = unlockedUpgrades
            .filter(e => !saveData.InfinityUpgrade.includes(e))
            .map(e => {
                const CanBuy = InfinityUpgrades.canBuy(e, saveData);

                return {
                    type: "BUTTON",
                    custom_id: "BuyInfinityUpgrade_" + e,
                    label: e,
                    disabled: !CanBuy,
                    style: CanBuy ? "SUCCESS" : "DANGER"
                };
            });
    }
    
    let components;
    if (buttons && buttons.length > 0) {
        components = [{
            type: "ACTION_ROW",
            components: buttons
        }]
    } else {
        components = [];
    }

    return {
        message: output,
        components: components
    }
}
