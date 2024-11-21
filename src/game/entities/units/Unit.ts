import GameScene from "../../scenes/GameScene";
import EventData from "../../types/EventData";
import UnitStats from "../../types/UnitStats";
import UnitTypes from "../../types/UnitTypes";
import Tile from "../Tile";

abstract class Unit extends Phaser.GameObjects.Sprite {
    public stats: UnitStats;
    public isPlayerOwner: boolean;
    protected currentTile: Tile;
    protected unitType: UnitTypes;
    protected path: Tile[] = [];
    protected hasMovedThisTurn: boolean;
    protected hasActedThisTurn: boolean;
    protected isTurnOver: boolean;
    public scene: GameScene;
    private selectionIndicator?: Phaser.GameObjects.Rectangle;

    constructor(scene: GameScene, tile: Tile, isPlayerOwner: boolean, stats: UnitStats, unitType: UnitTypes, spriteKey: string) {
        super(scene, tile.x, tile.y, spriteKey)
        this.scene = scene;

        this.unitType = unitType;
        this.currentTile = tile;
        this.isPlayerOwner = isPlayerOwner;
        this.stats = stats;

        this.hasMovedThisTurn = false;
        this.hasActedThisTurn = false;
        this.isTurnOver = false;

        this.setInteractive();

        this.setOrigin(0.5);
        this.setScale(2);

        this.scene.add.existing(this);
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.setInteractive();

        this.on("pointerdown", this.onClick.bind(this));
        this.on("pointerover", this.onHover.bind(this));
        this.on("pointerout", this.onHoverEnd.bind(this));
    }

    private onHover(): void {
        const eventData: EventData = {
            position: this.currentTile.getPosition(),
            terrain: this.currentTile.getTerrain(),
            unit: this,
            tile: this.currentTile
        }

        this.scene.events.emit("tileHover", eventData);
    }

    private onHoverEnd(): void {
        console.log("HOVER END");
        const eventData: EventData = {
            position: this.currentTile.getPosition(),
            terrain: this.currentTile.getTerrain(),
            unit: this,
            tile: this.currentTile
        }

        this.scene.events.emit("tileHoverEnd", eventData);
    }

    public setSelected(selected: boolean): void {
        if (selected) {
            this.selectionIndicator = this.scene.add.rectangle(
                this.x,
                this.y,
                config.pixelWidth,
                config.pixelHeight,
                0xffff00,
                0.5
            )

            this.selectionIndicator.setVisible(selected);
        } else {
            this.selectionIndicator?.destroy();
        }
    }

    public getCurrentTile(): Tile {
        return this.currentTile;
    }

    public setPath(path: Tile[]): void {
        this.path = path;
        // TODO: Test it to see if its working
        /* this.currentTile.setOccupyingUnit(undefined);
        path[path.length - 1].setOccupyingUnit(this); */
    }

    public getMovementRange(): number {
        return this.stats.movement;
    }

    moveAlongPath(): void {
        if (this.path.length > 0) {
            this.currentTile.setOccupyingUnit(undefined);
            const nextTile = this.path[0];

            this.scene.tweens.add({
                targets: this,
                x: nextTile.x,
                y: nextTile.y,
                duration: 200,
                onComplete: () => {
                    this.currentTile = nextTile;
                    this.currentTile.setOccupyingUnit(this);

                    this.path.shift();
                    this.moveAlongPath();
                }
            })
        } else {
            this.currentTile.setOccupyingUnit(undefined);
            // TODO: CHECK TO SEE IF THE PATH IS WORKING AND THE UNIT IS CHANGING PLACES
            // this.path[this.path.length - 1].setOccupyingUnit(this);
            this.hasMovedThisTurn = true;
            this.setTurnEnd();
        }


    }

    protected setTurnEnd(): void {
        if (this.hasActedThisTurn && this.hasMovedThisTurn) {
            this.setAlpha(0.5);
            this.isTurnOver = true;
            this.scene.events.emit("unitTurnEnd");
        }
    }

    public getUnitType(): UnitTypes {
        return this.unitType;
    }

    private onClick(): void {
        const eventData: EventData = {
            position: this.currentTile.getPositionVec(),
            terrain: this.currentTile.getTerrain(),
            unit: this,
            tile: this.getCurrentTile()
        };

        if(this.hasActedThisTurn && this.hasMovedThisTurn) {
        } else { 
            this.scene.events.emit("tileClick", eventData);
        }
    }

    public setHasMoved(state: boolean): void {
        this.hasMovedThisTurn = state;
    }

    public setHasActed(state: boolean): void {
        this.hasActedThisTurn = state;
    }

    public getHasMoved(): boolean {
        return this.hasMovedThisTurn;
    }

    public getHasActed(): boolean {
        return this.hasActedThisTurn;
    }

    public getIsTurnOver(): boolean {
        return this.isTurnOver;
    }

    public resetTurn(): void {
        this.hasActedThisTurn = false;
        this.hasMovedThisTurn = false;
        this.isTurnOver = false;
        setTimeout(() => {
            this.setAlpha(1); 
        }, 500);
    }

    abstract performAction(target: Tile | Tile[], highlightedTiles: Tile[]): void
}

export default Unit;