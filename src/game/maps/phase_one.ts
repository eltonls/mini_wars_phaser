import Knight from "../entities/units/Knight";
import Mage from "../entities/units/Mage";
import Unit from "../entities/units/Unit";
import { KnightStats, MageStats } from "../entities/units/UnitStatsBase";
import GameScene from "../scenes/GameScene";
import UnitTypes from "../types/UnitTypes";
import { TiledMapData } from "./map_1";

function loadTileMap(name: string, data: TiledMapData): void {
    // Check if we're in a module environment
    if (typeof module === 'object' && module && module.exports) {
        module.exports = data;
    }

    // Check if there's a global TileMaps object
    if (typeof globalThis.TileMaps === 'undefined') {
        (globalThis as any).TileMaps = {};
    }

    // Store the tilemap data
    (globalThis as any).TileMaps[name] = data;

    // If a callback is defined, call it
    if (typeof (globalThis as any).onTileMapLoaded === 'function') {
        (globalThis as any).onTileMapLoaded(name, data);
    }
}

// The actual mini tilemap data
const miniMapData: TiledMapData = {
    compressionlevel: -1,
    height: 21,
    infinite: false,
    layers: [
        {
            compression: "",
            data: "IAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAWAAAAFAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAABYAAAAQAAAAFAAAABkAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAABAAAAAUAAAAIAAAACAAAAAgAAAAIAAAABYAAAAQAAAAEAAAAA8AAAAPAAAADwAAABQAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAWAAAAEAAAABAAAAABAAAAAQAAAA8AAAAPAAAAFAAAACAAAAAgAAAAIAAAABcAAAATAAAADwAAAA8AAAABAAAAAQAAAAEAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAAAEAAAABAAAADwAAAA8AAAAPAAAADwAAABQAAAAZAAAAIAAAACAAAAAgAAAAEgAAAA8AAAABAAAAAQAAAAEAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAAA8AAAAPAAAADwAAAA8AAAAPAAAADwAAABEAAAAZAAAAIAAAABAAAAAQAAAADwAAAA8AAAAPAAAAAQAAAAEAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAAA8AAAAPAAAADwAAAA8AAAAPAAAADwAAABEAAAAZAAAAIAAAABIAAAAPAAAADwAAAA8AAAABAAAAAQAAABEAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAWAAAAEAAAABAAAAAUAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAAA8AAAAPAAAADwAAAA8AAAAPAAAADwAAABUAAAAZAAAAIAAAABIAAAAPAAAADwAAAAEAAAABAAAADwAAABEAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAAA8AAAAPAAAAEAAAABQAAAAgAAAAIAAAACAAAAAXAAAADwAAAA8AAAAPAAAADwAAAA8AAAAPAAAAEQAAABkAAAAgAAAAIAAAABcAAAATAAAAEwAAABMAAAATAAAAEwAAABUAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAABAAAAAQAAAA8AAAAPAAAADwAAAA8AAAAUAAAAIAAAACAAAAAbAAAAEgAAAA8AAAAPAAAADwAAAA8AAAAPAAAAAQAAABQAAAAZAAAAIAAAABsAAAAbAAAAGwAAABsAAAAbAAAAGwAAABsAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAABAAAAAQAAAAEAAAAPAAAADwAAAA8AAAARAAAAIAAAACAAAAAgAAAAFwAAABMAAAASAAAADwAAAA8AAAABAAAADwAAABUAAAAZAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAAAQAAAAEAAAAPAAAADwAAAA8AAAARAAAAIAAAACAAAAAgAAAAGwAAABsAAAAXAAAAEwAAABMAAAATAAAAFQAAABkAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAASAAAADwAAAAEAAAABAAAADwAAAA8AAAARAAAAIAAAACAAAAAgAAAAIAAAACAAAAAbAAAAGwAAABsAAAAbAAAAGwAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAXAAAAEwAAABMAAAATAAAAEwAAABMAAAAVAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAA",
            encoding: "base64",
            height: 21,
            id: 1,
            name: "Camada de Blocos 1",
            opacity: 1,
            type: "tilelayer",
            visible: true,
            width: 39,
            x: 0,
            y: 0
        }
    ],
    nextlayerid: 2,
    nextobjectid: 1,
    orientation: "orthogonal",
    renderorder: "right-down",
    tiledversion: "1.11.0",
    tileheight: 32,
    tilesets: [
        {
            columns: 0,
            firstgid: 1,
            grid: {
                height: 1,
                orientation: "orthogonal",
                width: 1
            },
            margin: 0,
            name: "Minis",
            spacing: 0,
            tilecount: 18,
            tileheight: 32,
            tiles: [
  {
    id: 0,
    image: "Resources/Tiles_mini/terrain_forest.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 4,
    image: "Resources/Tiles_mini/terrain_lava.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 5,
    image: "Resources/Tiles_mini/terrain_lava_edge_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 6,
    image: "Resources/Tiles_mini/terrain_lava_edge_right.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 7,
    image: "Resources/Tiles_mini/terrain_lava_edge_left.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 8,
    image: "Resources/Tiles_mini/terrain_lava_edge_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 9,
    image: "Resources/Tiles_mini/terrain_lava_corner_right_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 10,
    image: "Resources/Tiles_mini/terrain_lava_corner_right_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 11,
    image: "Resources/Tiles_mini/terrain_lava_corner_left_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 12,
    image: "Resources/Tiles_mini/terrain_lava_corner_left_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 13,
    image: "Resources/Tiles_mini/terrain_water.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 14,
    image: "Resources/Tiles_mini/terrain_plains.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 15,
    image: "Resources/Tiles_mini/terrain_plains_edge_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 16,
    image: "Resources/Tiles_mini/terrain_plains_edge_right.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 17,
    image: "Resources/Tiles_mini/terrain_plains_edge_left.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 18,
    image: "Resources/Tiles_mini/terrain_plains_edge_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 19,
    image: "Resources/Tiles_mini/terrain_plains_corner_right_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 20,
    image: "Resources/Tiles_mini/terrain_plains_corner_right_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 21,
    image: "Resources/Tiles_mini/terrain_plains_corner_left_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 22,
    image: "Resources/Tiles_mini/terrain_plains_corner_left_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 23,
    image: "Resources/Tiles_mini/terrain_water_edge_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 24,
    image: "Resources/Tiles_mini/terrain_water_edge_right.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 25,
    image: "Resources/Tiles_mini/terrain_water_edge_left.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 26,
    image: "Resources/Tiles_mini/terrain_water_edge_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 27,
    image: "Resources/Tiles_mini/terrain_water_corner_top_right.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 28,
    image: "Resources/Tiles_mini/terrain_water_corner_right_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 29,
    image: "Resources/Tiles_mini/terrain_water_corner_left_top.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 30,
    image: "Resources/Tiles_mini/terrain_water_corner_left_bottom.png",
    imageheight: 32,
    imagewidth: 32
  },
  {
    id: 31,
    image: "../dev/mini_wars_phaser/public/assets/Tiles/terrain_water.png",
    imageheight: 32,
    imagewidth: 32
  }

            ],
            tilewidth: 32
        }
    ],
    tilewidth: 32,
    type: "map",
    version: "1.10",
    width: 39
};


export function createPhaseUnits(scene: GameScene): Unit[] {
    const units: Unit[] = [
        new Mage(scene, undefined, true, MageStats, UnitTypes.MAGE, "mage"),
        new Mage(scene, undefined, true, MageStats, UnitTypes.MAGE, "mage"),
        new Knight(scene, undefined, true, KnightStats, UnitTypes.KNIGHT, "knight"),
        new Knight(scene, undefined, true, KnightStats, UnitTypes.KNIGHT, "knight"),
        new Knight(scene, undefined, true, KnightStats, UnitTypes.KNIGHT, "knight"),
        new Knight(scene, undefined, true, KnightStats, UnitTypes.KNIGHT, "knight"),
    ];

    return units;
}

export const enemyUnits = [
    "Knight",
    "Knight",
    "Knight",
    "Knight",
]

// Load the tilemap
loadTileMap("mini", miniMapData);

export { miniMapData, loadTileMap };
