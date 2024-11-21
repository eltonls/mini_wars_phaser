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
import { loadTileMap, miniMapData, createPhaseUnits } from "../maps/phase_one.ts";
import GameScene from "./GameScene";

class PrototypeOne extends GameScene {
    private listOfPlayerUnits: Unit[];
    private listOfEnemyUnits: Unit[];
    private tilemapData: TiledMapData;

    constructor() {
        super();
    }

    preload() {
        this.load.setPath("assets");
        this.tilemapData = miniMapData;

        // Tiles
        this.load.image("terrain_plains", "Tiles/terrain_plains.png");
        this.load.image("terrain_forest", "Tiles/terrain_forest.png");
        this.load.image("terrain_mountain", "Tiles/terrain_lava.png");
        this.load.image("terrain_water", "Tiles/terrain_water.png");
        
        this.load.image("terrain_water_corner_left_top", "Tiles/terrain_water_corner_left_top.png");
        this.load.image("terrain_water_corner_right_top", "Tiles/terrain_water_corner_right_top.png");
        this.load.image("terrain_water_corner_top", "Tiles/terrain_water_edge_top.png");
        this.load.image("terrain_water_edge_bottom", "Tiles/terrain_water_edge_bottom.png");
        this.load.image("terrain_water_corner_left_bottom", "Tiles/terrain_water_corner_left_bottom.png");
        this.load.image("terrain_water_corner_right_bottom", "Tiles/terrain_water_corner_right_bottom.png");
        this.load.image("terrain_water_edge_top", "Tiles/terrain_water_edge_top.png");
        this.load.image("terrain_water_edge_left", "Tiles/terrain_water_edge_left.png");
        this.load.image("terrain_water_edge_right", "Tiles/terrain_water_edge_right.png");
        
        this.load.image("terrain_plains_corner_left_top", "Tiles/terrain_plains_corner_left_top.png");
        this.load.image("terrain_plains_corner_right_top", "Tiles/terrain_plains_corner_right_top.png");
        this.load.image("terrain_plains_corner_right_bottom", "Tiles/terrain_plains_corner_right_bottom.png");
        this.load.image("terrain_plains_corner_left_bottom", "Tiles/terrain_plains_corner_left_bottom.png");
        this.load.image("terrain_plains_corner_top", "Tiles/terrain_plains_edge_top.png");
        this.load.image("terrain_plains_edge_bottom", "Tiles/terrain_plains_edge_bottom.png");    
        this.load.image("terrain_plains_edge_left", "Tiles/terrain_plains_edge_left.png");
        this.load.image("terrain_plains_edge_right", "Tiles/terrain_plains_edge_right.png");
        this.load.image("terrain_plains_edge_top", "Tiles/terrain_plains_edge_top.png");
        this.load.image("terrain_lava_corner_left_top", "Tiles/terrain_lava_corner_left_top.png");
        this.load.image("terrain_lava_corner_right_top", "Tiles/terrain_lava_corner_right_top.png");
        this.load.image("terrain_lava_corner_top", "Tiles/terrain_lava_edge_top.png");
        this.load.image("terrain_lava_edge_bottom", "Tiles/terrain_lava_edge_bottom.png");
        this.load.image("terrain_lava_corner_left_bottom", "Tiles/terrain_lava_corner_left_bottom.png");
        this.load.image("terrain_lava_corner_right_bottom", "Tiles/terrain_lava_corner_right_bottom.png");
        this.load.image("terrain_lava_edge_top", "Tiles/terrain_lava_edge_top.png");
        this.load.image("terrain_lava_edge_left", "Tiles/terrain_lava_edge_left.png");
        this.load.image("terrain_lava_edge_right", "Tiles/terrain_lava_edge_right.png");
        
        // Sprites for Units
        this.load.spritesheet("mage", "Units/Elf Enchanter/ElfEnchanterIdleSide.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("knight", "Units/Elf Lord/ElfLordIdleSide.png", { frameWidth: 16, frameHeight: 16 });

        // UI
        this.load.image("button", "UI/Button.png");
        this.load.image("unitInfo", "UI/unit_info.png");
        this.load.image("menuBG", "UI/menu_bg.png");
        this.load.image("deploymentBook", "UI/Ui_base.png");
        this.load.image("dialogBox", "UI/dialogue_box.png");
    }

    create() {
        this.gridSize = 30;
        this.gridSystem = new GridSystem(this, 39, 23, this.tilemapData);
        this.unitsManager = new UnitManager(this);
        this.unitActionMenu = new UnitActionMenu(this);
        this.turnManager = new TurnManager(this);
        this.aiSystem = new AISystem(this);
        this.uiManager = new UIManager(this);
        this.startDeploymentPhase();
        this.initializeDeploymentPool(createPhaseUnits(this));
        this.createDeploymentUI();


        this.startUnits();

        EventBus.emit("current-scene-ready", this);
    }

    private startUnits(): void {
    }
}

export default PrototypeOne;