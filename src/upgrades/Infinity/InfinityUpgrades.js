import Upgrade from "../../class/Upgrade.js";
import infinityUpgradesEnum from "../../data/infinityUpgradesEnum.js";



const InfinityUpgradeCosts = [
    1, 1, 1, 1,
    1, 1, 1, 2,
    3, 5, 7, 10,
    20, 40, 80, 500
];



let InfinityUpgrades = [];
InfinityUpgrades.push(new Upgrade({
    name: "timeMult",
    prevUpgrade: null,
    effect(_, saveData) {
        return new Decimal(((new Date().getTime() - saveData.StartTime)/60_000/4)**0.15);
    }
}));





export default InfinityUpgrades;