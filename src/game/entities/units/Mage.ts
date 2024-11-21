import { off } from "process";
import Tile from "../Tile";
import Unit from "./Unit";
import TerrainType from "../../types/TerrainType";


class Mage extends Unit {
    performAction(target: Tile): void {
        let path: Tile[];
        const gridSystem = this.scene.getGridSystem();
        // Get all the tiles from unit place to the target
        path = this.getActionPath(target);

        gridSystem.changeTerrain(path, TerrainType.WATER);

        this.hasActedThisTurn = true;
        this.setTurnEnd();
    }

    private getActionPath(target: Tile): Tile[] {
        const gridSystem = this.scene.getGridSystem();
        const tiles: Tile[] = [];
        let offsetX: number = 0;
        let offsetY: number = 0;
        const targetX = target.getPositionVec().x;
        const targetY = target.getPositionVec().y;
        const originX = this.currentTile.getPositionVec().x;
        const originY = this.currentTile.getPositionVec().y;

        // get the offsets
        if(this.currentTile.getPositionVec().x > targetX) {
            offsetX = -1;
        }
        
        if(this.currentTile.getPositionVec().x < targetX){ 
            offsetX = 1;
        }

        if(this.currentTile.getPositionVec().y > targetY) {
            offsetY = -1;
        }

        if(this.currentTile.getPositionVec().y < targetY) {
            offsetY = 1;
        }

        for (let i = 1; i < this.stats.range; i++) {
            const tile = gridSystem.getTile(originX + (offsetX * i), originY + (offsetY * i));
            if(tile) {
                tiles.push(tile);
            }
        }

        return tiles;
    }
}

export default Mage;