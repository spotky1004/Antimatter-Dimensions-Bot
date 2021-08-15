import SaveData from "../../data/saveData.js";
import TickFunc from "../../types/tickFunc.js";



/** @type {TickFunc} */
export default function(dt, saveData, buttonFunc) {
    if (buttonFunc.includes("TabDimensions")) saveData.Tab = "Dimensions";
    if (buttonFunc.includes("TabInfinityUpgrades")) saveData.Tab = "InfinityUpgrades";



    let tabComponents = [
        {
            type: "BUTTON",
            custom_id: "TabDimensions",
            label: "Dimensions",
            style: "SECONDARY"
        }
    ];
    if (saveData.Unlock.Infinity) {
        tabComponents.push({
            type: "BUTTON",
            custom_id: "TabInfinityUpgrades",
            label: "Infinity",
            style: "SECONDARY"
        });
    };



    return {
        message: ["null"],
        components: [
            {
                type: "ACTION_ROW",
                components: tabComponents
            }
        ]
    }
}