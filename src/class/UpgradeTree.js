import Upgrade from "./Upgrade.js";

class UpgradeTree {
    /**
     * @param {Upgrade[]} upgrades 
     */
    constructor(upgrades) {
        for (let i = 0; i < upgrades.length; i++) {
            this[i] = upgrades[i];
        }
    }

    buy(id, saveData) {

    }
}
