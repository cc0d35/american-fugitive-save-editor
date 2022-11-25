import { CLUES, PAINTINGS, SaveFile, STASHES, UNIQUE_JUMPS, VEHICLES_LIST } from "./Savefile.js";

type Options = {
    cash: number,
    upgradePoints: number,
    health: number,
    ammo_handgun: number,
    ammo_rifle: number,
    ammo_shotgun: number,
    ammo_smg: number,
    ammo_explosive: number,
    ammo_minigun: number,
    upgrade_InventoryCapacity: number,
    upgrade_AutoCase: number,
    upgrade_MetalDetector: number,
    upgrade_ImprovedSprint: number,
    upgrade_IncreaseHoldUpChance: number,
    upgrade_ImprovedSneak: number,
    upgrade_AutoHealth: number,
    upgrade_IncreaseRestrainChance: number,
    upgrade_IncreaseMaxHealth: number,
    upgrade_ReduceVehicleDamage: number,
    upgrade_IncreaseAttackChance: number,
    upgrade_RegenerateHealth: number,
    upgrade_WeldingTorch: number,
    upgrade_IncreaseMeleeDamage: number,
    upgrade_ExtraDamageToVehicles: number,
    upgrade_IncreaseFleeChance: number,
    upgrade_SpawnWithLoadOutBag: number,
    upgrade_SneakDamage: number,
    upgrade_ReduceShopPrices: number,
    upgrade_MeleeDisarm: number
    cheat_allAreasUnlocked: boolean,
    cheat_allStashes: boolean,
    cheat_allPaintings: boolean,
    cheat_allJumps: boolean,
    cheat_allFlyers: boolean,
    cheat_allVehicles: boolean,
    cheat_allCarsStolen: boolean,
    cheat_allShopsHeldUp: boolean,
    cheat_allChallengesComplete: boolean,
    cheat_allChallengesGold: boolean,
    cheat_allRacesCompleted: boolean,
    cheat_allRacesGold: boolean,
    cheat_allVehiclesCrushedByTank: boolean,
    cheat_allEnemyTanksDestroyed: boolean,
    cheat_goldRaceWithNoDamage: boolean,
    cheat_rideInTrainLoop: boolean,
}

export function loadOptionsFromSavefile(save: SaveFile): Options {
    return {
        cash: save['MGR_PLAYERPERSISTANTDATA.Cash'],
        upgradePoints: save['MGR_PLAYERPERSISTANTDATAUpgradePoints'],
        health: save['CurrentHealth'],
        ammo_handgun: save['Handgun'],
        ammo_rifle: save['Rifle'],
        ammo_shotgun: save['Shotgun'],
        ammo_smg: save['SMG'],
        ammo_explosive: save['Explosive'],
        ammo_minigun: save['Minigun'],
        upgrade_InventoryCapacity: save['Unlocks']['InventoryCapacity'],
        upgrade_AutoCase: save['Unlocks']['AutoCase'],
        upgrade_MetalDetector: save['Unlocks']['MetalDetector'],
        upgrade_ImprovedSprint: save['Unlocks']['ImprovedSprint'],
        upgrade_IncreaseHoldUpChance: save['Unlocks']['IncreaseHoldUpChance'],
        upgrade_ImprovedSneak: save['Unlocks']['ImprovedSneak'],
        upgrade_AutoHealth: save['Unlocks']['AutoHealth'],
        upgrade_IncreaseRestrainChance: save['Unlocks']['IncreaseRestrainChance'],
        upgrade_IncreaseMaxHealth: save['Unlocks']['IncreaseMaxHealth'],
        upgrade_ReduceVehicleDamage: save['Unlocks']['ReduceVehicleDamage'],
        upgrade_IncreaseAttackChance: save['Unlocks']['IncreaseAttackChance'],
        upgrade_RegenerateHealth: save['Unlocks']['RegenerateHealth'],
        upgrade_WeldingTorch: save['Unlocks']['WeldingTorch'],
        upgrade_IncreaseMeleeDamage: save['Unlocks']['IncreaseMeleeDamage'],
        upgrade_ExtraDamageToVehicles: save['Unlocks']['ExtraDamageToVehicles'],
        upgrade_IncreaseFleeChance: save['Unlocks']['IncreaseFleeChance'],
        upgrade_SpawnWithLoadOutBag: save['Unlocks']['SpawnWithLoadOutBag'],
        upgrade_SneakDamage: save['Unlocks']['SneakDamage'],
        upgrade_ReduceShopPrices: save['Unlocks']['ReduceShopPrices'],
        upgrade_MeleeDisarm: save['Unlocks']['MeleeDisarm'],
        cheat_allAreasUnlocked: save['AreaUnlocked'] === 3,
        cheat_allStashes: save['MGR_STATSMGR.Stats']['StashesFound'] === 100,
        cheat_allPaintings: save['MGR_STATSMGR.Stats']['PaintingsPawned'] === 20,
        cheat_allJumps: save['MGR_STATSMGR.Stats']['VehicleJumpsCompleted'] === 30,
        cheat_allFlyers: save['MGR_STATSMGR.Stats']['AllFlyersFound'] === 15,
        cheat_allVehicles: save['MGR_STATSMGR.Stats']['UniqueVehiclesDriven'] === 29,
        cheat_allCarsStolen: save['MGR_STATSMGR.Stats']['CarsStolen'] >= 200,
        cheat_allShopsHeldUp: save['MGR_STATSMGR.Stats']['ShopsHeldUp'] >= 50,
        cheat_allChallengesComplete: save['MGR_STATSMGR.Stats']['ChallengesCompleted'] === 10,
        cheat_allChallengesGold: save['MGR_STATSMGR.Stats']['ChallengesGold'] === 10,
        cheat_allRacesCompleted: save['MGR_STATSMGR.Stats']['RacesCompleted'] === 19,
        cheat_allRacesGold: save['MGR_STATSMGR.Stats']['RacesGold'] === 19,
        cheat_allVehiclesCrushedByTank: save['MGR_STATSMGR.Stats']['VehiclesCrushedByTank'] >= 250,
        cheat_allEnemyTanksDestroyed: save['MGR_STATSMGR.Stats']['TanksDestroyed'] >= 100,
        cheat_goldRaceWithNoDamage: save['MGR_STATSMGR.Stats']['GoldRaceWithNoDamage'] === 1,
        cheat_rideInTrainLoop: save['MGR_STATSMGR.Stats']['RideTrainInLoop'] === 1,
    };
}

export function modifySavefile(save: SaveFile, options: Partial<Options>): SaveFile {
    const newSave: SaveFile = JSON.parse(JSON.stringify(save));

    if (options.cash) {
        newSave['MGR_PLAYERPERSISTANTDATA.Cash'] = options.cash;
    }

    if (options.upgradePoints) {
        newSave['MGR_PLAYERPERSISTANTDATAUpgradePoints'] = options.upgradePoints;
    }

    if (options.health) {
        newSave['CurrentHealth'] = Math.max(0, options.health);
    }

    if (options.ammo_handgun) {
        newSave['Handgun'] = Math.max(0, options.ammo_handgun);
    }

    if (options.ammo_rifle) {
        newSave['Rifle'] = Math.max(0, options.ammo_rifle);
    }

    if (options.ammo_shotgun) {
        newSave['Shotgun'] = Math.max(0, options.ammo_shotgun);
    }

    if (options.ammo_smg) {
        newSave['SMG'] = Math.max(0, options.ammo_smg);
    }

    if (options.ammo_explosive) {
        newSave['Explosive'] = Math.max(0, options.ammo_explosive);
    }

    if (options.ammo_minigun) {
        newSave['Minigun'] = Math.max(0, options.ammo_minigun);
    }

    if (options.upgrade_InventoryCapacity) {
        newSave['Unlocks']['InventoryCapacity'] = Math.max(0, Math.min(6, options.upgrade_InventoryCapacity));
    }

    if (options.upgrade_AutoCase) {
        newSave['Unlocks']['AutoCase'] = Math.max(0, Math.min(1, options.upgrade_AutoCase));
    }

    if (options.upgrade_MetalDetector) {
        newSave['Unlocks']['MetalDetector'] = Math.max(0, Math.min(1, options.upgrade_MetalDetector));
    }

    if (options.upgrade_ImprovedSprint) {
        newSave['Unlocks']['ImprovedSprint'] = Math.max(0, Math.min(5, options.upgrade_ImprovedSprint));
    }

    if (options.upgrade_IncreaseHoldUpChance) {
        newSave['Unlocks']['IncreaseHoldUpChance'] = Math.max(0, Math.min(3, options.upgrade_IncreaseHoldUpChance));
    }

    if (options.upgrade_ImprovedSneak) {
        newSave['Unlocks']['ImprovedSneak'] = Math.max(0, Math.min(3, options.upgrade_ImprovedSneak));
    }

    if (options.upgrade_AutoHealth) {
        newSave['Unlocks']['AutoHealth'] = Math.max(0, Math.min(1, options.upgrade_AutoHealth));
    }

    if (options.upgrade_IncreaseRestrainChance) {
        newSave['Unlocks']['IncreaseRestrainChance'] = Math.max(0, Math.min(3, options.upgrade_IncreaseRestrainChance));
    }

    if (options.upgrade_IncreaseMaxHealth) {
        newSave['Unlocks']['IncreaseMaxHealth'] = Math.max(0, Math.min(6, options.upgrade_IncreaseMaxHealth));
    }

    if (options.upgrade_ReduceVehicleDamage) {
        newSave['Unlocks']['ReduceVehicleDamage'] = Math.max(0, Math.min(6, options.upgrade_ReduceVehicleDamage));
    }

    if (options.upgrade_IncreaseAttackChance) {
        newSave['Unlocks']['IncreaseAttackChance'] = Math.max(0, Math.min(3, options.upgrade_IncreaseAttackChance));
    }

    if (options.upgrade_RegenerateHealth) {
        newSave['Unlocks']['RegenerateHealth'] = Math.max(0, Math.min(3, options.upgrade_RegenerateHealth));
    }

    if (options.upgrade_WeldingTorch) {
        newSave['Unlocks']['WeldingTorch'] = Math.max(0, Math.min(1, options.upgrade_WeldingTorch));
    }

    if (options.upgrade_IncreaseMeleeDamage) {
        newSave['Unlocks']['IncreaseMeleeDamage'] = Math.max(0, Math.min(4, options.upgrade_IncreaseMeleeDamage));
    }

    if (options.upgrade_ExtraDamageToVehicles) {
        newSave['Unlocks']['ExtraDamageToVehicles'] = Math.max(0, Math.min(2, options.upgrade_ExtraDamageToVehicles));
    }

    if (options.upgrade_IncreaseFleeChance) {
        newSave['Unlocks']['IncreaseFleeChance'] = Math.max(0, Math.min(1, options.upgrade_IncreaseFleeChance));
    }

    if (options.upgrade_SpawnWithLoadOutBag) {
        newSave['Unlocks']['SpawnWithLoadOutBag'] = Math.max(0, Math.min(4, options.upgrade_SpawnWithLoadOutBag));
    }

    if (options.upgrade_SneakDamage) {
        newSave['Unlocks']['SneakDamage'] = Math.max(0, Math.min(2, options.upgrade_SneakDamage));
    }

    if (options.upgrade_ReduceShopPrices) {
        newSave['Unlocks']['ReduceShopPrices'] = Math.max(0, Math.min(3, options.upgrade_ReduceShopPrices));
    }

    if (options.upgrade_MeleeDisarm) {
        newSave['Unlocks']['MeleeDisarm'] = Math.max(0, Math.min(1, options.upgrade_MeleeDisarm));
    }

    if (options.cheat_allAreasUnlocked) {
        newSave['AreaUnlocked'] = 3;
        // newSave['MGR_STATSMGR.Stats']['Area1Complete'] = 1;
        // newSave['MGR_STATSMGR.Stats']['Area2Complete'] = 1;
        // newSave['MGR_STATSMGR.Stats']['Area3Complete'] = 1;
    }

    if (options.cheat_allStashes) {
        newSave['MGR_STATSMGR.Stats']['StashesFound'] = 100;
        newSave['MGR_STASHMGR.Stashes'] = {
            '$type': 'System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib',
            '$values': STASHES,
        };
        newSave['Clues'] = {
            '$type': 'System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib',
            '$values': CLUES,
        };
    }

    if (options.cheat_allPaintings) {
        newSave['MGR_STATSMGR.Stats']['PaintingsPawned'] = 20;
        newSave['MGR_STASHMGRPaintings'] = {
            '$type': 'System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib',
            '$values': PAINTINGS,
        };
    }

    if (options.cheat_allJumps) {
        newSave['MGR_STATSMGR.Stats']['VehicleJumpsCompleted'] = 30;
        newSave['MGR_VEHICLEJUMPMGR.Records']['$type'] = 'System.Collections.Generic.Dictionary`2[[System.String, mscorlib],[System.Single, mscorlib]], mscorlib';
        UNIQUE_JUMPS.forEach(id => {
            newSave['MGR_VEHICLEJUMPMGR.Records'][id] = 10;
        });
    }

    if (options.cheat_allFlyers) {
        newSave['MGR_STATSMGR.Stats']['AllFlyersFound'] = 15;
        // newSave['MGR_COLLECTABLEViewedItem'] = 
    }

    if (options.cheat_allVehicles) {
        newSave['MGR_STATSMGR.Stats']['UniqueVehiclesDriven'] = 29;
        newSave['MGR_STATSMGRVehiclesDriven'] = {
            $type: 'System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib',
            $values: VEHICLES_LIST,
        };
    }

    if (options.cheat_allCarsStolen) {
        newSave['MGR_STATSMGR.Stats']['CarsStolen'] = 200;
    }

    if (options.cheat_allShopsHeldUp) {
        newSave['MGR_STATSMGR.Stats']['ShopsHeldUp'] = 50;
    }

    if (options.cheat_allChallengesComplete) {
        newSave['MGR_STATSMGR.Stats']['ChallengesCompleted'] = 10;
    }

    if (options.cheat_allChallengesGold) {
        newSave['MGR_STATSMGR.Stats']['ChallengesGold'] = 10;
    }

    if (options.cheat_allRacesCompleted) {
        newSave['MGR_STATSMGR.Stats']['RacesCompleted'] = 19;
    }

    if (options.cheat_allRacesGold) {
        newSave['MGR_STATSMGR.Stats']['RacesGold'] = 19;
    }

    if (options.cheat_allVehiclesCrushedByTank) {
        newSave['MGR_STATSMGR.Stats']['VehiclesCrushedByTank'] = 250;
    }

    if (options.cheat_allEnemyTanksDestroyed) {
        newSave['MGR_STATSMGR.Stats']['TanksDestroyed'] = 100;
    }

    if (options.cheat_goldRaceWithNoDamage) {
        newSave['MGR_STATSMGR.Stats']['GoldRaceWithNoDamage'] = 1;
    }

    if (options.cheat_rideInTrainLoop) {
        newSave['MGR_STATSMGR.Stats']['RideTrainInLoop'] = 1;
    }

    return newSave;
}