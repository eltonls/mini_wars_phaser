import Tile from "../Tile";
import Unit from "./Unit";


class Rogue extends Unit {
    performAction(target: Tile | Tile[], highlightedTiles: Tile[]): void {
        throw new Error("Method not implemented.");
    }
}

export default Rogue;
