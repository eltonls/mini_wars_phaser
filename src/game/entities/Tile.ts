import { Scene } from "phaser";
import EventData from "../types/EventData";
import TerrainProperties from "../types/TerrainProperties";
import TerrainType from "../types/TerrainType";
import UnitTypes from "../types/UnitTypes";
import Unit from "./units/Unit";
import { config } from "../configs/global";

class Tile extends Phaser.GameObjects.Container {
    private terrain: TerrainType;
    private properties: TerrainProperties;
    private positionVec: Phaser.Math.Vector2; // Position on Grid
    private sprite: Phaser.GameObjects.Sprite;
    private spriteKey: string;
    private highlighted: boolean = false;
    private highlightRect?: Phaser.GameObjects.Rectangle;
    private occupyingUnit?: Unit;
    private waterTween?: Phaser.Tweens.Tween;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        terrain: TerrainType = TerrainType.PLAINS,
        spriteKey: string
    ) {
        super(scene, (x + 1) * 32, (y + 1) * 32);

        // position on the grid;
        this.positionVec = new Phaser.Math.Vector2(x, y);

        this.terrain = terrain;
        this.spriteKey = spriteKey;
        this.properties = this.getTerrainProperties(terrain);

        this.initializeVisuals();
        this.setupInteractive();
    }

    private getTerrainProperties(terrain: TerrainType): TerrainProperties {
        const terrainProps: Record<TerrainType, TerrainProperties> = {
            [TerrainType.PLAINS]: {
                movementCost: 1,
                defenseBonus: 0,
                passable: true
            },
            [TerrainType.MOUNTAINS]: {
                movementCost: 3,
                defenseBonus: 2,
                passable: false
            },
            [TerrainType.FOREST]: {
                movementCost: 2,
                defenseBonus: 1,
                passable: true
            },
            [TerrainType.WATER]: {
                movementCost: 2,
                defenseBonus: 1.5,
                passable: false
            },
            [TerrainType.DESERT]: {
                movementCost: 3,
                defenseBonus: 0,
                passable: true
            }
        }

        return terrainProps[terrain];
    }

    private startWaterAnimation(): void {
        // Create a subtle wave-like movement
        this.waterTween = this.scene.tweens.add({
            targets: this.sprite,
            duration: 2000, // 2 seconds for a full cycle
            repeat: -1, // Infinite repeat
            yoyo: true, // Reverse the animation back and forth
            props: {
                x: {
                    from: 0,
                    to: 2,
                    ease: 'Sine.easeInOut'
                },
                y: {
                    from: 0,
                    to: 5, // Small vertical movement
                    ease: 'Sine.easeInOut' // Smooth sine wave movement
                }
            }
        });
    }

    private initializeVisuals(): void {
        this.sprite = this.scene.add.sprite(0, 0, this.spriteKey);
        this.add(this.sprite);
        this.sprite.setScale(1);
        this.scene.add.existing(this);

        if (this.terrain === TerrainType.WATER) {
            this.startWaterAnimation();
        }
    }

    private setupInteractive(): void {
        this.sprite.setInteractive();

        this.sprite.on("pointerdown", this.onClick.bind(this));
        this.sprite.on("pointerover", this.onHover.bind(this));
    }

    private onClick(): void {
        const eventData: EventData = {
            position: this.positionVec,
            terrain: this.terrain,
            unit: this.occupyingUnit,
            tile: this
        }

        this.scene.events.emit("tileClick", eventData);
    }

    private onHover(): void {
        const eventData: EventData = {
            position: this.positionVec,
            terrain: this.terrain,
            unit: this.occupyingUnit,
            tile: this
        }

        this.scene.events.emit("tileHover", eventData);
    }

    highlight(color: number = 0x74F2CE, alpha: number = 0.6): void {
        if (!this.highlighted) {
            if (!this.highlightRect) {
                this.highlightRect = this.scene.add.rectangle(
                    0, 0,
                    config.pixelWidth, config.pixelHeight,
                    color, alpha
                )

                this.add(this.highlightRect);
            } else {
                this.highlightRect.setFillStyle(color, alpha);
                this.highlightRect.setVisible(true);
            }

            this.highlighted = true;
        }
    }

    clearHighlight(): void {
        if (this.highlighted) {
            this.highlightRect?.setVisible(false);
            this.highlighted = false;
        }
    }

    getMovementCost(unitType: UnitTypes): number {
        const baseCost = this.properties.movementCost;

        // TODO: Need to see the modifiers again
        const modifiers = {
            [UnitTypes.MAGE]: this.terrain === TerrainType.MOUNTAINS ? 2 : 1,
            [UnitTypes.ROGUE]: this.terrain === TerrainType.FOREST ? -1 : 1,
            [UnitTypes.KNIGHT]: this.terrain === TerrainType.WATER ? 20 : 1,
            [UnitTypes.BLADEMASTER]: this.terrain === TerrainType.PLAINS ? -0.5 : 1
        }

        return baseCost * modifiers[unitType];
    }

    canBeEnteredBy(unit: Unit): boolean {
        if (this.occupyingUnit && this.occupyingUnit?.owner !== unit.owner) return false;
        return this.getMovementCost(unit.type) !== Infinity;
    }

    getDefenseBonus(unitType: UnitTypes): number {
        const baseBonus = this.properties.defenseBonus;
        const modifiers = {
            [UnitTypes.KNIGHT]: 1,
            [UnitTypes.BLADEMASTER]: 1,
            [UnitTypes.ROGUE]: 2,
            [UnitTypes.MAGE]: 0.5
        }

        return baseBonus * modifiers[unitType];
    }

    getPosition(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.positionVec.x, this.positionVec.y);
    }

    public changeTileType(newType: TerrainType): void{
        this.terrain = newType;
        this.properties = this.getTerrainProperties(newType);
        this.sprite.setTexture(`terrain_${newType}`); 

        if (newType === TerrainType.WATER) {
            this.startWaterAnimation();
        }
    }

    public setOccupyingUnit(unit?: Unit): void {
        this.occupyingUnit = unit;
    }

    public getOccupyingUnit(): Unit | undefined {
        return this.occupyingUnit;
    }

    public getPositionVec(): Phaser.Math.Vector2 {
        return this.positionVec;
    }

    public getSprite(): Phaser.GameObjects.Sprite {
        return this.sprite;
    }

    public getTerrain(): TerrainType {
        return this.terrain;
    }
}

export default Tile;