import Tile from "../entities/Tile";
import Unit from "../entities/units/Unit";
import GameModes from "../entities/utils/GameModes";
import GameScene from "../scenes/GameScene";
import EventData from "../types/EventData";
import UnitTypes from "../types/UnitTypes";

class UnitManager {
    private scene: GameScene;
    private units: Unit[] = [];
    private selectedUnit?: Unit;
    private highlightedTiles?: Tile[] = []
    private mode?: string
    private isRoundOver: boolean;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.setupEventListeners();
    }

    public addUnit(unit: Unit, tile: Tile): void {
        unit.setCurrentTile(tile);
        unit.setPosition(tile.x, tile.y);
        tile.setOccupyingUnit(unit);
        this.units.push(unit);
        this.scene.add.existing(unit);
    }

    private setupEventListeners(): void {
        // Events
        this.scene.events.on("moveSelected", this.showMovementRange.bind(this));
        this.scene.events.on("actionSelected", this.showActionRange.bind(this));
        this.scene.events.on("waitSelected", this.waitUnit.bind(this));
        this.scene.events.on("tileClick", this.handleTileClick.bind(this));
        this.scene.events.on("unitTurnEnd", this.checkIfTurnIsOver.bind(this));
        this.scene.events.on("turnChange", this.turnChangeHandler.bind(this));
    }

    private removeEventListeners(): void {
        this.scene.events.on("moveSelected", () => { });
        this.scene.events.on("actionSelected", () => { });
        this.scene.events.on("waitSelected", () => { });
        this.scene.events.on("tileClick", () => { });
        this.scene.events.on("unitTurnEnd", () => { });
        this.scene.events.on("turnChange", () => { });
    }

    /* 
     * @params
     * eventData: { unit?: Unit, position?: Phaser.Math.Vector2, tile?: Tile  }
     * */
    private showMovementRange(eventData: EventData): void {
        const gridSystem = this.scene.getGridSystem();
        if (!gridSystem) return;

        if (eventData.unit) {
            const tilesInRange = gridSystem.getTilesInRange(eventData.unit, eventData.unit.getCurrentTile(), eventData.unit.stats.movement);

            tilesInRange.forEach((tile) => {
                tile.highlight();
                this.highlightedTiles?.push(tile);
            })

            this.mode = "movement"
        }
    }

    private clearSelection(): void {
        if (this.selectedUnit) {
            this.selectedUnit.setSelected(false);
        }

        this.selectedUnit = undefined;

        this.highlightedTiles?.forEach((tile) => {
            tile.clearHighlight();
        })

        this.highlightedTiles = [];
    }

    private showActionRange(eventData: EventData): void {
        const gridSystem = this.scene.getGridSystem();
        if (!gridSystem) return;

        const tilesInRange = gridSystem.getTilesInRange(eventData.unit!, eventData.unit!.getCurrentTile(), eventData.unit!.stats.range, false);
        let rangeColor: number;

        // Change color based on unit action
        switch (eventData.unit?.getUnitType()) {
            case UnitTypes.MAGE:
                rangeColor = 0x54C6EB;
                break;
            case UnitTypes.KNIGHT:
                rangeColor = 0xF24333;
                break;
        }

        tilesInRange.forEach((tile) => {
            tile.highlight(rangeColor);
            this.highlightedTiles?.push(tile);
        })

        this.mode = "action"
    }

    private waitUnit(eventData: EventData): void {
        if (eventData.unit) {
            eventData.unit.endTurn();
            this.checkIfTurnIsOver();
        }
    }

    private handleTileClick(eventData: EventData): void {
        if (this.scene.mode === GameModes.DEPLOYMENT) return;

        if (this.mode === "action" && this.highlightedTiles?.includes(eventData.tile!) && this.selectedUnit) {
            // THIS WILL RUN THE ACTION ON THE TILE SELECTED
            this.selectedUnit.performAction(eventData.tile!, this.highlightedTiles);
            this.clearSelection();
            this.checkIfTurnIsOver();
            return;
        }

        if (this.mode === "movement" && this.highlightedTiles?.includes(eventData.tile!) && !eventData.tile!.getOccupyingUnit() && this.selectedUnit) {
            this.moveSelectedUnit(eventData.tile!);
            return;
        }

        if (eventData.unit) {
            this.clearSelection();
            this.setSelectedUnit(eventData);
        }
    }

    private setSelectedUnit(eventData: EventData): void {
        this.selectedUnit = eventData.unit;
    }

    private moveSelectedUnit(destiny: Tile): void {
        if (!this.selectedUnit) return;

        const gridSystem = this.scene.getGridSystem();

        if (this.highlightedTiles?.includes(destiny)) {
            const path = gridSystem.findPath(
                this.selectedUnit.getCurrentTile(),
                destiny,
                this.selectedUnit
            )

            if (path.length > 0) {
                this.selectedUnit.setPath(path);
                this.selectedUnit.moveAlongPath();
                this.clearSelection();
            }
        } else {
            this.clearSelection();
        }

        this.checkIfTurnIsOver();
    }

    public checkIfTurnIsOver(): void {
        let isRoundOver = true;

        this.units.forEach((unit) => {
            if (!unit.getIsTurnOver() && unit.isPlayerOwner) {
                isRoundOver = false;
            }
        })

        if (isRoundOver) {
            this.scene.events.emit("playerTurnEnd");
        }
    }

    private turnChangeHandler(turnData: any): void {
        this.resetAllUnitTurns(turnData.isPlayerTurn);
    }

    private resetAllUnitTurns(isPlayer: boolean): void {
        if (isPlayer) {
            this.units.forEach((unit) => {
                if (unit.isPlayerOwner) {
                    unit.resetTurn();
                }
            })
        }

        if (!isPlayer) {
            this.units.forEach((unit) => {
                if (!unit.isPlayerOwner) {
                    unit.resetTurn();
                }
            })
        }
    }

    public getAllUnits(): Unit[] {
        return this.units;
    }

    public disableUnitInteractions(): void {
        this.removeEventListeners();
    }

    public enableUnitInteractions(): void {
        this.setupEventListeners();
    }
}

export default UnitManager;