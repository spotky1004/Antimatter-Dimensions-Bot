import Discord from "discord.js"
import Decimal from "decimal.js";

import SaveData from "../data/saveData.js";

/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {string[]} buttonFunc 
 * @returns { {message: string[], components: Discord.MessageButton[]} }
 */
export default function(dt, saveData, buttonFunc) {
    if (buttonFunc.includes("BigCrunch")) {
        saveData.Unlock.Infinity = true;
        saveData.InfinityPoint = saveData.InfinityPoint.add(1);
        saveData.Tab = "Dimensions";

        saveData.AntiGalaxy = new Decimal(0);
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

    return {
        message: [
            "┌─────────────────────┐",
            "│ B i g   C r u n c h │",
            "└─────────────────────┘",
            "",
            "The world has collapsed on itself due to excess of antimatter.",
        ],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        custom_id: "BigCrunch",
                        label: "Big Crunch",
                        style: "SUCCESS"
                    }
                ]
            }
        ]
    };
}