import Tile from "../entities/Tile";
import Unit from "../entities/units/Unit";
import TerrainType from "./TerrainType";

interface EventData {
    unit?: Unit,
    terrain?: TerrainType,
    position?: Phaser.Math.Vector2,
    tile?: Tile,
    typeOfEvent?: string
}

export default EventData;