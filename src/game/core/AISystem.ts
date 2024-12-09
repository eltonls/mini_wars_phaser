import GameScene from "../scenes/GameScene";
import Unit from "../entities/units/Unit";
import Tile from "../entities/Tile";
import TerrainType from "../types/TerrainType";
import UnitTypes from "../types/UnitTypes";

interface Move {
    unit: Unit;
    destinationTile: Tile;
    targetTile?: Tile;
    score: number;
}

class AISystem {
    private scene: GameScene;
    private aiUnits: Unit[] = [];

    constructor(scene: GameScene) {
        this.scene = scene;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.scene.events.on("playerTurnEnd", this.startAITurn.bind(this));
    }

    public addUnit(unit: Unit, tile: Tile): void {
        tile.setOccupyingUnit(unit);
        this.aiUnits.push(unit);
        this.scene.add.existing(unit);
    }

    public async startAITurn(): Promise<void> {
        for (const unit of this.aiUnits) {
            if (unit.getIsTurnOver()) continue;

            try {
                await this.executeUnitTurn(unit);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error executing turn for unit ${unit.id}:`, error);
            }
        }
        this.scene.events.emit("aiTurnEnd", true);
    }

    private async executeUnitTurn(unit: Unit): Promise<void> {
        const bestMove = this.findBestMove(unit);
        if (!bestMove) return;
        
        // Execute movement
        if (bestMove.destinationTile !== unit.getCurrentTile()) {
            const path = this.scene.getGridSystem().findPath(
                unit.getCurrentTile(),
                bestMove.destinationTile,
                unit
            );
            unit.setPath(path);
            unit.moveAlongPath();
        }

        // Execute action if there's a target
        if (bestMove.targetTile) {
            unit.performAction(bestMove.targetTile);
        }
    }

    private findBestMove(unit: Unit): Move | null {
        const possibleMoves: Move[] = [];
        const currentTile = unit.getCurrentTile();
        const movementTiles = this.scene.getGridSystem().getTilesInRange(
            unit,
            currentTile,
            unit.getMovementRange()
        );

        movementTiles.push(currentTile);

        for (const moveTile of movementTiles) {
            const actionTiles = this.scene.getGridSystem().getTilesInRange(
                unit,
                moveTile,
                unit.stats.range,
                false
            );

            const move = this.evaluateMove(unit, moveTile, actionTiles);
            if (move.score > -Infinity) {
                possibleMoves.push(move);
            }
        }

        if (possibleMoves.length === 0) {
            return null;
        }

        return possibleMoves.reduce((best, current) =>
            current.score > best.score ? current : best
        )    
    }

    private evaluateMove(unit: Unit, moveTile: Tile, actionTiles: Tile[]): Move {
        let bestScore = -Infinity;
        let bestTarget: Tile | undefined;

        let positionScore = this.evaluatePosition(unit, moveTile);

        for (const targetTile of actionTiles) {
            const actionScore = this.evaluateAction(unit, targetTile);
            if (actionScore > bestScore) {
                bestScore = actionScore;
                bestTarget = targetTile;
            }
        }

        return {
            unit,
            destinationTile: moveTile,
            targetTile: bestTarget,
            score: positionScore + (bestScore === -Infinity ? 0 : bestScore)
        };
    }

    private evaluatePosition(unit: Unit, tile: Tile): number {
        let score = 0;

        score += this.getTerrainScore(unit, tile);
        score += this.getAttackScore(unit, tile);
        score += this.getStrategicScore(tile);

        return score;
    }
    
    private getAttackScore(unit: Unit, tile: Tile): number {
        const gridSystem = this.scene.getGridSystem();
        const tilesInRange = gridSystem.getTilesInRange(unit, tile, unit.stats.range, false); 
        
        for (const targetTile of tilesInRange) {
            const targetUnit = targetTile.getOccupyingUnit();
            if (targetUnit && targetUnit.isPlayerOwner) {
                return 999;
            }
        }
        
        return 0;
    }

    private getTerrainScore(unit: Unit, tile: Tile): number {
        const defenseBonus = tile.getDefenseBonus(unit.getUnitType());
        const movementCost = tile.getMovementCost(unit.getUnitType());
        
        return (defenseBonus * 10) - (movementCost * 5);
    }
    
    private getStrategicScore(tile: Tile): number {
        let score = 0;

        // Prefer tiles that control more area
        const adjacentTiles = this.scene.getGridSystem().getNeighbors(tile);
        score += adjacentTiles.length * 5;

        switch (tile.getTerrain()) {
            case TerrainType.MOUNTAINS:
                score += 15; 
                break;
            case TerrainType.FOREST:
                score += 10; 
                break;
            case TerrainType.PLAINS:
                score += 5;
                break;
        }

        return score;
    }

    private evaluateAction(unit: Unit, targetTile: Tile): number {
        const targetUnit = targetTile.getOccupyingUnit();
        if (!targetUnit || targetUnit === unit) return -Infinity;

        let score = 0;

        score += unit.stats.attack * 10;

        score += (100 - targetUnit.stats.health) * 5;

        const terrainBonus = targetTile.getDefenseBonus(targetUnit.getUnitType());
        score -= terrainBonus * 8;

        return score;
    }

    private getManhattanDistance(pos1: Phaser.Math.Vector2, pos2: Phaser.Math.Vector2): number {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
    }
}

export default AISystem;
