import SaveData from "../../data/saveData.js";

/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {string[]} buttonFunc 
 * @returns { {message: string[], components: object[]} }
 */
export default function(dt, saveData, buttonFunc) {
    if (buttonFunc.includes("TabDimensions")) saveData.Tab = "Dimensions";
    if (buttonFunc.includes("TabInfinity")) saveData.Tab = "Infinity";



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
            custom_id: "TabInfinity",
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