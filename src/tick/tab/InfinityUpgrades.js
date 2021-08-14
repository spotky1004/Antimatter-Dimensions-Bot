import Decimal from "decimal.js";
import SaveData from "../../data/saveData.js";
import { InfinityUpgrades } from "../../upgrades/_init.js";

const InfinityUpgradesCount = 16;



/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {string[]} buttonFunc 
 * @returns { {message: string[], components: object[]} }
 */
export default function(dt, saveData, buttonFunc) {
    let output = new Array(16).fill("");

    for (let i = 0; i < InfinityUpgradesCount; i++) {
        const text = InfinityUpgrades.upgradeToString(i, saveData, { width: 18, height: 3 });

        for (let j = 0; j < 3; j++) output[(i%4)*4 + j] += text[j];
    }

    return {
        message: output,
        components: [{
            type: "ACTION_ROW",
            components: [
                {
                    type: "BUTTON",
                    custom_id: "test",
                    label: "테스트",
                    style: "PRIMARY"
                }
            ]
        }]
    }
}
