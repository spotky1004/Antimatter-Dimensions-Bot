import Decimal from "decimal.js";
import SaveData from "../../data/saveData.js";
import TickFunc from "../../types/tickFunc.js";

import { InfinityUpgrades } from "../../upgrades/_init.js";

const InfinityUpgradesCount = 16;



/** @type {TickFunc} */
export default function(dt, saveData, buttonFunc) {
    let output = new Array(16).fill("");

    for (let i = 1; i <= InfinityUpgradesCount; i++) {
        const text = InfinityUpgrades.upgradeToString(i, saveData, { width: 20, height: 4 });
        for (let j = 0; j < 4; j++) output[((i-1)%4)*4 + j] += text[j];
    }

    const buttons = InfinityUpgrades.getEndPoints(saveData)
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
    
    let components;
    if (buttons.length > 0) {
        components = [{
            type: "ACTION_ROW",
            components: buttons
        }]
    } else {
        components = undefined;
    }

    return {
        message: output,
        components: components
    }
}
