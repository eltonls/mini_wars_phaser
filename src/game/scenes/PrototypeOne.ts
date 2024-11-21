import { EventBus } from "../EventBus";
import AISystem from "../core/AISystem";
import GridSystem from "../core/GridSystem";
import Knight from "../entities/units/Knight";
import Mage from "../entities/units/Mage";
import Unit from "../entities/units/Unit";
import TurnManager from "../managers/TurnManager";
import UIManager from "../managers/UIManager";
import UnitManager from "../managers/UnitManager";
import UnitStats from "../types/UnitStats";
import UnitTypes from "../types/UnitTypes";
import UnitActionMenu from "../ui/UnitActionMenu";
import GameScene from "./GameScene";

class PrototypeOne extends GameScene {
    private listOfPlayerUnits: Unit[];
    private listOfEnemyUnits: Unit[];

    constructor() {
        super();
    }

    preload() {
        this.load.setPath("assets");

        // Tiles
        this.load.image("terrain_plains", "Tiles/plains_terrain.png");
        this.load.image("terrain_forest", "Tiles/forest_terrain.png");
        this.load.image("terrain_mountain", "Tiles/lava_terrain.png");
        this.load.image("terrain_water", "Tiles/water_terrain.png");

        // Sprites for Units
        this.load.spritesheet("mage", "Units/Elf Enchanter/ElfEnchanterIdleSide.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("knight", "Units/Elf Lord/ElfLordIdleSide.png", { frameWidth: 16, frameHeight: 16 });

        // UI
        this.load.image("button", "UI/Button.png");
        this.load.image("unitInfo", "UI/unit_info.png");
        this.load.image("menuBG", "UI/menu_bg.png");
    }

    create() {
        this.gridSize = 30;
        this.gridSystem = new GridSystem(this, 39, 21);
        this.unitsManager = new UnitManager(this);
        this.unitActionMenu = new UnitActionMenu(this);
        this.turnManager = new TurnManager(this);
        this.aiSystem = new AISystem(this);
        this.uiManager = new UIManager(this);

        this.startUnits();

        EventBus.emit("current-scene-ready", this);
    }

    private startUnits(): void {
        const mageUnitStats = new UnitStats(
            20,
            20,
            3,
            2,
            3,
            4,
            4,
            10,
            "mage"
        )

        const knightUnitStats = new UnitStats(
            30,
            30,
            3,
            2,
            3,
            4,
            4,
            6,
            "knight"
        )

        for (let i = 0; i < 10; i++) {
            if(i < 5) {
                const newKnight = new Knight(this, this.gridSystem.getTile(5, 5 + i)!, false, knightUnitStats, UnitTypes.KNIGHT, "knight");
                this.aiSystem.addUnit(newKnight, newKnight.getCurrentTile());
            } else {
                const newMage = new Mage(this, this.gridSystem.getTile(6, 5 + i)!, false, mageUnitStats, UnitTypes.MAGE, "mage");
                this.aiSystem.addUnit(newMage, newMage.getCurrentTile());
            }
        }
    }
}

export default PrototypeOne;