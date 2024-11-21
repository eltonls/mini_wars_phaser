import { Scene } from "phaser";
import UnitManager from "../managers/UnitManager";
import GridSystem from "../core/GridSystem";
import UnitActionMenu from "../ui/UnitActionMenu";
import TurnManager from "../managers/TurnManager";
import AISystem from "../core/AISystem";
import Unit from "../entities/units/Unit";
import UIManager from "../managers/UIManager";

abstract class GameScene extends Scene {
    protected gridSize: number = 40;
    protected gridSystem: GridSystem;
    protected unitsManager: UnitManager;
    protected turnManager: TurnManager;
    protected aiSystem: AISystem;
    protected unitActionMenu: UnitActionMenu;
    protected tilemap: Phaser.Tilemaps.MapData;
    protected uiManager: UIManager;

    constructor() {
        super("Game");
    }

    public getGridSystem(): GridSystem {
        return this.gridSystem;
    }

    public getPlayerUnits(): Unit[] {
        return this.unitsManager.getAllUnits();
    }
}

export default GameScene;