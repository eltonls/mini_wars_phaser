import Tile from "../Tile";
import Unit from "./Unit";


class Knight extends Unit {
    performAction(target: Tile | Tile[], highlightedTiles: Tile[]): void {
        if(target.getOccupyingUnit()) {
            this.scene.events.emit("initiateBattle", this, target.getOccupyingUnit());
            this.hasActedThisTurn = true;
            this.setTurnEnd();
        }
    }
}

export default Knight;
