import Decimal from "decimal.js";
import UpgradeTree from "../../class/UpgradeTree.js";



export default new UpgradeTree({
    UpgradeKey: "InfinityUpgrade",
    ResourceKey: "InfinityPoint",
    IdList: [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
    ],
    RequireGrid: [
        null, 1, 2, 3,
        null, 5, 6, 7,
        null, 9, 10, 11,
        null, 13, 14, 15
    ],
    CostTable: [
        1, 1, 1, 1,
        1, 1, 1, 2,
        3, 5, 7, 10,
        20, 40, 80, 500
    ],
    Descriptions: [
        " Tot.Time -> Dim  (x$)",
        " Inf Stat -> 1, 8 Dim (x$)",
        " Inf Stat -> 3, 6 Dim (x$)",
        " DimBoost, Galaxy cost -9",

        " Mult per 10 Dim  (2x -> 2.2x)",
        " Inf Stat -> 2, 7 Dim (x$)",
        " Inf Stat -> 4, 5 Dim (x$)",
        "Galaxy effect x2",

        " Time this Inf -> Dim (x$)",
        "  IP -> 1st Dim   (x$)",
        "  Dimension Boost  mult 2x -> 2.5x",
        "Fastest Inf -> IP gen ($/s)",

        "Start with 5th Dim",
        "Start with 6th Dim",
        "Start with 7th Dim",
        "Start with 8th Dim and a Galaxy"
    ],
    effects: [
        (saveData) => new Decimal( ((new Date().getTime() - saveData.StartTime)/60_000/4)**0.15 ),
        (saveData) => saveData.PrestigeStat.Infinity.div(5).add(1),
        (saveData) => saveData.PrestigeStat.Infinity.div(5).add(1),
        (_)        => new Decimal(-9),

        (_)        => new Decimal(2.2),
        (saveData) => saveData.PrestigeStat.Infinity.div(5).add(1),
        (saveData) => saveData.PrestigeStat.Infinity.div(5).add(1),
        (_)        => new Decimal(2),

        (saveData) => Decimal.max(1, ((new Date().getTime() - saveData.PrestigeTime.Infinity )/60_000/2)**0.25 ),
        (saveData) => saveData.InfinityPoint.div(2).pow(1.5).add(1),
        (_)        => new Decimal(2.5),
        (saveData) => new Decimal(1000/saveData.FastPrestige.Infinity/10),

        (_)        => new Decimal(1),
        (_)        => new Decimal(1),
        (_)        => new Decimal(1),
        (_)        => new Decimal(1),
    ]
});
