import UpgradeTree from "../../class/UpgradeTree.js";



export default new UpgradeTree({
    UpgradeKey: "InfinityUpgrade",
    CostTable: [
        1, 1, 1, 1,
        1, 1, 1, 2,
        3, 5, 7, 10,
        20, 40, 80, 500
    ],
    ResourceKey: "InfinityPoint",
    RequireGrid: [
        null, 0, 1, 2,
        null, 4, 5, 6,
        null, 8, 9, 10,
        null, 12, 13, 14
    ],
    Descriptions: [
        "Mult Dimemsions based on time played (x$)",
        "Mult 1 and 8 Dim based on Inf Stat (x$)",
        "Mult 3 and 6 Dim based on Inf Stat (x$)",
        "Decrease DimBoost and Galaxy cost by 9",
        "Increase mult per 10 Dim (2x -> 2.2x)",
        "Mult 2 and 7 Dim based on Inf Stat (x$)",
        "Mult 4 and 5 Dim based on Inf Stat (x$)",
    ]
});