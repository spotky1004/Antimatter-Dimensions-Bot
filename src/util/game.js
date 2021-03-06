import Decimal from "decimal.js";

export const Prestige = {
    DimensionBoost(saveData) {
        saveData.Antimatter = new Decimal(10);
        for (let i = 0; i < 8; i++) {
            const _DimData = saveData.Dimensions[i];
            _DimData.have = new Decimal(0);
            _DimData.bought = new Decimal(0);
        }
        saveData.TickSpeed = new Decimal(0);
        saveData.DimSacrifice = new Decimal(0);
    },
    AntimatterGalaxy(saveData) {
        saveData.DimBoost = new Decimal(startDimBoost(saveData));
        this.DimensionBoost(saveData);
    },
    Infinity(saveData) {
        saveData.PrestigeStat.Infinity = saveData.PrestigeStat.Infinity.add(1);
        saveData.FastPrestige.Infinity = Math.min(
            saveData.FastPrestige.Infinity,
            new Date().getTime() - saveData.PrestigeTime.Infinity,
            new Date().getTime() - saveData.StartTime // For first Infinity
        );
        saveData.PrestigeTime.Infinity = new Date().getTime();

        saveData.AntiGalaxy = new Decimal(startGalaxy(saveData));

        this.AntimatterGalaxy(saveData);
    }
};

export function startDimBoost(saveData) {
    return saveData.InfinityUpgrade.includes(13) +
        saveData.InfinityUpgrade.includes(14) +
        saveData.InfinityUpgrade.includes(15) +
        saveData.InfinityUpgrade.includes(16);
}
export function startGalaxy(saveData) {
    return Number(saveData.InfinityUpgrade.includes(16));
}