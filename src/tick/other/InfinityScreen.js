import Discord from "discord.js";

import { Prestige } from "../../util/game.js";
import SaveData from "../../data/saveData.js";
import TickFunc from "../../types/tickFunc.js";



/** @type {TickFunc} */
export default function(dt, saveData, buttonFunc) {
    if (buttonFunc.includes("BigCrunch")) {
        saveData.InfinityPoint = saveData.InfinityPoint.add(1);
        saveData.Tab = "Dimensions";
        saveData.Unlock.Infinity = true;
        saveData.PrestigeStat.Infinity = saveData.PrestigeStat.Infinity.add(1);
        
        Prestige.Infinity(saveData);
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