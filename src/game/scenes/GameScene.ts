import { Scene } from "phaser";
import UnitManager from "../managers/UnitManager";
import GridSystem from "../core/GridSystem";
import UnitActionMenu from "../ui/UnitActionMenu";
import TurnManager from "../managers/TurnManager";
import AISystem from "../core/AISystem";
import Unit from "../entities/units/Unit";
import UIManager from "../managers/UIManager";
import EventData from "../types/EventData";
import Tile from "../entities/Tile";
import Knight from "../entities/units/Knight";
import Mage from "../entities/units/Mage";
import GameModes from "../entities/utils/GameModes";

abstract class GameScene extends Scene {
    protected gridSize: number = 40;
    protected gridSystem: GridSystem;
    protected unitsManager: UnitManager;
    protected turnManager: TurnManager;
    protected aiSystem: AISystem;
    protected unitActionMenu: UnitActionMenu;
    protected tilemap: Phaser.Tilemaps.MapData;
    protected uiManager: UIManager;
    public mode: GameModes;
    protected deploymentUnits: Unit[];
    protected selectedUnit?: Unit;

    constructor() {
        super("Game");
    }

    public getGridSystem(): GridSystem {
        return this.gridSystem;
    }

    public getPlayerUnits(): Unit[] {
        return this.unitsManager.getAllUnits();
    }

    private setupEventListeners(): void {
        this.events.on("tileClick", this.handleDeploymentTileClick.bind(this));
    }

    protected startDeploymentPhase(): void {
        // Define deployment zone tiles (for example, first two rows of player's side)

        this.setupEventListeners();
        const deploymentZones = this.getDeploymentZones();

        // Highlight deployment zones
        deploymentZones.forEach(tile => {
            tile.highlight(0x00FF00)

            let graphics = this.add.graphics();
            graphics.lineStyle(1, 0xffffff, 1);
            graphics.strokeRectShape(tile.getSprite().getBounds());
        }); // Green highlight

        // Enable unit placement mode
        this.mode = GameModes.DEPLOYMENT;

        // Disable regular unit selection/interaction
        this.unitsManager.disableUnitInteractions();
    }

    private getDeploymentZones(): Tile[] {
        const gridSystem = this.getGridSystem();
        const deploymentZones: Tile[] = [];

        // Example: First two rows for player deployment
        for (let x = 10; x < 14; x++) {
            for (let y = 13; y < 15; y++) {
                const tile = gridSystem.getTile(x, y);
                if (tile && !tile.getOccupyingUnit()) {
                    tile.getSprite().on("pointerdown", this.handleDeploymentTileClick.bind(this));
                    deploymentZones.push(tile);
                }
            }
        }

        return deploymentZones;
    }

    protected handleDeploymentTileClick(eventData: EventData): void {
        if (eventData.tile && this.mode === GameModes.DEPLOYMENT &&
            this.selectedUnit &&
            this.getDeploymentZones().includes(eventData.tile)) {

            // Place unit on selected tile
            if (eventData.tile) {
                this.unitsManager.addUnit(this.selectedUnit, eventData.tile);
            }

            // Potentially remove unit from deployment pool
            this.selectedUnit = undefined;
        }
    }
    protected initializeDeploymentPool(phaseUnits: Unit[]): void {
        this.deploymentUnits = phaseUnits;
    }

    protected createDeploymentUI(): void {
        const middleOfCanvasX = this.sys.canvas.width / 2;
        const BottomOfCanvasY = this.sys.canvas.height - 100;
        const endOfCanvasX = this.sys.canvas.width;

        const confirmDialogContainer = new Phaser.GameObjects.Container(this, endOfCanvasX, BottomOfCanvasY);
        const confirmText = new Phaser.GameObjects.Text(this, -200, -20, "Confirmar unidades?", { fontFamily: "garamond", color: "black", fontSize: 18 }).setOrigin(0.5);
        const textYes = new Phaser.GameObjects.Text(this, -200, 0, "Sim", { fontFamily: "garamon", color: "black", fontSize: 16});
        textYes.setInteractive();
        textYes.on("pointerdown", this.endDeploymentPhase.bind(this));

        const textNo = new Phaser.GameObjects.Text(this, -200, 20, "Não", { fontFamily: "garamon", color: "black", fontSize: 16});
        const confirmDialogBackground = new Phaser.GameObjects.Image(this, 0, 0, "dialogBox").setOrigin(0.5);
        confirmDialogContainer.add([confirmDialogBackground, confirmText, textYes, textNo]);

        const deploymentUIContainer = new Phaser.GameObjects.Container(this, middleOfCanvasX, BottomOfCanvasY);
        const deploymentUIBackground = new Phaser.GameObjects.Image(this, 0, 0, "deploymentBook").setOrigin(0.5).setScale(1.5);
        deploymentUIContainer.add(deploymentUIBackground);

        this.deploymentUnits.forEach((unit, index) => {
            // Create clickable UI representation of each unit
            const startingPlace = deploymentUIBackground.x - 120;
            const unitIcon = this.add.image(startingPlace + 42 * index, 0, unit.texture).setScale(2);

            unitIcon.setInteractive();
            unitIcon.on('pointerdown', () => {
                this.selectedUnit = unit;
            });

            deploymentUIContainer.add(unitIcon);
        });

        this.add.existing(deploymentUIContainer);
        this.add.existing(confirmDialogContainer);
    }

    protected endDeploymentPhase(): void {
        // Clear deployment zone highlights
        this.getDeploymentZones().forEach(tile => tile.clearHighlight());

        // Enable normal game interactions
        this.mode = GameModes.NORMAL;
        this.unitsManager.enableUnitInteractions();

        // Start first turn
        this.turnManager.startPlayerTurn();
    }
}

export default GameScene;