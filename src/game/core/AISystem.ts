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
            
            await this.executeUnitTurn(unit);
            // Add delay between unit moves for better visualization
            await new Promise(resolve => setTimeout(resolve, 500));
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
            await new Promise(resolve => {
                unit.moveAlongPath();
                this.scene.time.delayedCall(path.length * 200 + 100, resolve);
            });
        }

        // Execute action if there's a target
        if (bestMove.targetTile) {
            unit.performAction([bestMove.targetTile], []);
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

        // Add current position to possible movement tiles
        movementTiles.push(currentTile);

        for (const moveTile of movementTiles) {
            // Get possible action tiles from this position
            const actionTiles = this.scene.getGridSystem().getTilesInRange(
                unit,
                moveTile,
                unit.stats.range,
                false
            );

            // Score this position and possible actions
            const move = this.evaluateMove(unit, moveTile, actionTiles);
            possibleMoves.push(move);
        }

        // Return the move with the highest score
        return possibleMoves.reduce((best, current) => 
            current.score > best.score ? current : best
        );
    }

    private evaluateMove(unit: Unit, moveTile: Tile, actionTiles: Tile[]): Move {
        let bestScore = -Infinity;
        let bestTarget: Tile | undefined;

        // Base position score
        let positionScore = this.evaluatePosition(unit, moveTile);

        // Evaluate each possible action from this position
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

        // Terrain advantages
        score += this.getTerrainScore(unit, tile);

        // Distance to nearest enemy
        const distanceScore = this.getDistanceScore(unit, tile);
        score += distanceScore;

        // Strategic positioning (e.g., controlling important areas)
        score += this.getStrategicScore(tile);

        return score;
    }

    private getTerrainScore(unit: Unit, tile: Tile): number {
        const defenseBonus = tile.getDefenseBonus(unit.getUnitType());
        const movementCost = tile.getMovementCost(unit.getUnitType());
        
        // Higher defense bonus is good, lower movement cost is good
        return (defenseBonus * 10) - (movementCost * 5);
    }

    private getDistanceScore(unit: Unit, tile: Tile): number {
        let score = 0;
        const playerUnits = this.scene.getPlayerUnits();
        
        for (const playerUnit of playerUnits) {
            const distance = this.getManhattanDistance(
                tile.getPosition(),
                playerUnit.getCurrentTile().getPosition()
            );

            // Score based on unit type and optimal engagement range
            switch (unit.getUnitType()) {
                case UnitTypes.MAGE:
                    // Mages prefer medium range
                    score += Math.abs(distance - 3) * -5;
                    break;
                case UnitTypes.KNIGHT:
                    // Knights prefer close range
                    score += distance * -10;
                    break;
                case UnitTypes.ROGUE:
                    // Rogues prefer very close range
                    score += distance * -15;
                    break;
                case UnitTypes.BLADEMASTER:
                    // Blademasters prefer close to medium range
                    score += Math.abs(distance - 2) * -8;
                    break;
            }
        }

        return score;
    }

    private getStrategicScore(tile: Tile): number {
        let score = 0;

        // Prefer tiles that control more area
        const adjacentTiles = this.scene.getGridSystem().getNeighbors(tile);
        score += adjacentTiles.length * 5;

        // Bonus for controlling certain terrain types
        switch (tile.getTerrain()) {
            case TerrainType.MOUNTAINS:
                score += 15; // Good vantage point
                break;
            case TerrainType.FOREST:
                score += 10; // Good cover
                break;
            case TerrainType.PLAINS:
                score += 5; // Good mobility
                break;
        }

        return score;
    }

    private evaluateAction(unit: Unit, targetTile: Tile): number {
        const targetUnit = targetTile.getOccupyingUnit();
        if (!targetUnit || targetUnit === unit) return -Infinity;

        let score = 0;

        // Base damage potential
        score += unit.stats.attack * 10;

        // Target's remaining health
        score += (100 - targetUnit.stats.health) * 5;

        // Terrain advantages/disadvantages
        const terrainBonus = targetTile.getDefenseBonus(targetUnit.getUnitType());
        score -= terrainBonus * 8;

        return score;
    }

    private getManhattanDistance(pos1: Phaser.Math.Vector2, pos2: Phaser.Math.Vector2): number {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
    }
}

export default AISystem;
