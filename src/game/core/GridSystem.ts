import Tile from "../entities/Tile";
import GameScene from "../scenes/GameScene";
import TerrainType from "../types/TerrainType";
import Unit from "../entities/units/Unit";

class GridSystem {
    private grid: Array<Array<Tile>>;
    private scene: GameScene;
    private width: number;
    private height: number;

    constructor(scene: GameScene, width: number, height: number) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
    }

    private createGrid(): Tile[][] {
        const grid: Tile[][] = [];

        for (let i = 0; i < this.width; i++) {
            grid[i] = [];

            for (let j = 0; j < this.height; j++) {
                const terrain = this.generateTerrain(i, j);
                const tile = new Tile(this.scene, i, j, terrain);
                grid[i][j] = tile;
            }
        }

        return grid;
    }

    private generateTerrain(x: number, y: number): TerrainType {
        return TerrainType.PLAINS;
    }

    /*
     * @params
     * tiles: Tile[] - Tiles to be changed
     * newType: TerrainType - Type to be used now
     */
    public changeTerrain(tiles: Tile[], newType: TerrainType) {
        tiles.forEach((tile) => {
            tile.changeTileType(newType);
        })
    }

    public getTilesInRange(unit: Unit, origin: Tile, range: number, isMovement = true): Tile[] {
        const tiles: Tile[] = [];
        const originCoordinates = origin.getPosition();

        const movements = [
            [-1, -1], [0, 1], [1, 1],
            [-1, 0], [1, 0], [-1, 1],
            [0, -1], [1, -1]
        ];

        movements.forEach((direction: number[]) => {
            let actualCoordinates = originCoordinates;

            for (let x = 0; x < range; x++) {
                const tile: Tile | undefined = this.getTile(actualCoordinates.x, actualCoordinates.y);
                if(!tile) break;

                if (!tile.getOccupyingUnit()) {
                    tiles.push(tile);
                }

                if(isMovement) 
                    x += tile.getMovementCost(unit.getUnitType());

                actualCoordinates = new Phaser.Math.Vector2(actualCoordinates.x + direction[0], actualCoordinates.y + direction[1]);
            }
        })

        return tiles;
    }

    public findPath(start: Tile, end: Tile, unit: Unit): Tile[] {
        const openSet: Tile[] = [start];
        const closedSet: Set<Tile> = new Set();
        const cameFrom: Map<Tile, Tile> = new Map();
        const gScore: Map<Tile, number> = new Map();
        const fScore: Map<Tile, number> = new Map();

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, end, unit));

        while (openSet.length > 0) {
            const current = this.getLowestFScore(openSet, fScore);

            if (current === end) {
                return this.reconstructPath(cameFrom, end);
            }

            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(current);

            for (const neighbor of this.getNeighbors(current)) {
                if (closedSet.has(neighbor) || !neighbor.canBeEnteredBy(unit)) {
                    continue;
                }

                const tentativeGScore = gScore.get(current)! + neighbor.getMovementCost(unit.getUnitType());

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighbor)) {
                    continue;
                }

                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, gScore.get(neighbor)! + this.heuristic(neighbor, end, unit))
            }
        }

        return [];
    }

    private heuristic(a: Tile, b: Tile, unit: Unit) {
        return this.weightedManhattanDistance(a, b, unit);
    }

    private weightedManhattanDistance(a: Tile, goal: Tile, unit: Unit) {
        const baseDistance = this.manhattanDistance(a, goal);
        const startingPosition = a.getPosition();
        const goalPosition = goal.getPosition();

        const weightTerrains: Map<TerrainType, number> = new Map();
        weightTerrains.set(TerrainType.FOREST, 1.5);
        weightTerrains.set(TerrainType.MOUNTAINS, 3);
        weightTerrains.set(TerrainType.PLAINS, 1);

        let x = startingPosition.x;
        let y = startingPosition.y;

        let totalCost = 0;
        let steps = 0;

        while (x !== goalPosition.x || y !== goalPosition.y) {
            totalCost += this.getTile(x, y).getMovementCost(unit.getUnitType());
            steps += 1;

            if (x < goalPosition.x) {
                x += 1;
            } else if (x > goalPosition.x) {
                x -= 1;
            } else if (y < goalPosition.y) {
                y += 1;
            } else if (y > goalPosition.y) {
                y -= 1;
            }
        }

        return baseDistance * (totalCost / steps);
    }

    private manhattanDistance(a: Tile, b: Tile) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private getLowestFScore(openSet: Tile[], fScore: Map<Tile, number>): Tile {
        return openSet.reduce((lowest, tile) => (fScore.get(tile)! < fScore.get(lowest)!) ? tile : lowest)
    }

    private reconstructPath(cameFrom: Map<Tile, Tile>, current: Tile) {
        const path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current)!;
            path.unshift(current);
        }

        return path;
    }

    private getNeighbors(tile: Tile): Tile[] {
        const neighbors: Tile[] = [];
        const pos = tile.getPosition();

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]

        for (const [dx, dy] of directions) {
            const newX = pos.x + dx;
            const newY = pos.y + dy;

            if (this.isInBounds(newX, newY)) {
                neighbors.push(this.grid[newX][newY]);
            }
        }

        return neighbors;
    }

    public isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    public getTile(x: number, y: number): Tile | undefined {
        if(!this.grid[x]) return undefined;
        return this.grid[x][y];
    }
}

export default GridSystem;