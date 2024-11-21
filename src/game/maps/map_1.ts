// Defines the structure of a Tiled tileset
interface TiledTile {
    id: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    type?: string;
}

// Defines the structure of a Tiled layer
interface TiledLayer {
    compression: string;
    data: string;
    encoding: string;
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

// Defines the structure of a Tiled tileset
interface TiledTileset {
    columns: number;
    firstgid: number;
    grid: {
        height: number;
        orientation: string;
        width: number;
    };
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
    tiles?: TiledTile[];
}

// Defines the complete Tiled map structure
interface TiledMapData {
    compressionlevel: number;
    height: number;
    infinite: boolean;
    layers: TiledLayer[];
    nextlayerid: number;
    nextobjectid: number;
    orientation: string;
    renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilesets: TiledTileset[];
    tilewidth: number;
    type: string;
    version: string;
    width: number;
}

// Utility function to handle tilemap loading
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
            data: "GQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAhAAAAEQAAABEAAAAgAAAAIAAAACAAAAAgAAAAIAAAABsAAAAZAAAAGQAAABkAAAAdAAAAGgAAABoAAAAaAAAAGgAAABoAAAAbAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAhAAAAIAAAABEAAAARAAAAIAAAACAAAAAgAAAAEQAAACAAAAAbAAAAGQAAABkAAAAhAAAAFgAAABMAAAATAAAAEwAAABQAAAAiAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAhAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAiAAAAGQAAABkAAAAhAAAAEgAAABkAAAAZAAAAGQAAABcAAAAiAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAhAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAiAAAAGQAAABkAAAAhAAAAFwAAABgAAAAYAAAAGAAAABUAAAAiAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAeAAAAIAAAACAAAAAgAAAAIAAAABEAAAARAAAAEQAAACAAAAAcAAAAGQAAABkAAAAhAAAAIAAAACAAAAAgAAAAIAAAACAAAAAcAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAHgAAAB8AAAAfAAAAIAAAACAAAAAiAAAAHwAAABwAAAAZAAAAGQAAABkAAAAeAAAAHwAAAB8AAAAfAAAAHwAAABwAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAHwAAAB8AAAAcAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAAGQAAABkAAAAZAAAA",
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
                    id: 16,
                    image: "Tiles/terrain_forest.png",
                    imageheight: 32,
                    imagewidth: 32,
                    type: "forest"
                },
                {
                    id: 17,
                    image: "Tiles/terrain_lava.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 18,
                    image: "Tiles/terrain_lava_edge_top.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 19,
                    image: "Tiles/terrain_lava_corner_right_top.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 20,
                    image: "Tiles/terrain_lava_corner_right_bottom.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 21,
                    image: "Tiles/terrain_lava_corner_left_top.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 22,
                    image: "Tiles/terrain_lava_corner_left_bottom.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 23,
                    image: "Tiles/terrain_lava_edge_bottom.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 24,
                    image: "Tiles/terrain_water.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 25,
                    image: "Tiles/terrain_plains_edge_top.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 26,
                    image: "Tiles/terrain_plains_corner_right_top.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 27,
                    image: "Tiles/terrain_plains_corner_right_bottom.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 28,
                    image: "Tilesterrain_plains_corner_left_top.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 29,
                    image: "Resources/Tiles_mini/terrain_plains_corner_left_bottom.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 30,
                    image: "Resources/Tiles_mini/terrain_plains_edge_bottom.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 31,
                    image: "Resources/Tiles_mini/terrain_plains.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 32,
                    image: "Resources/Tiles_mini/terrain_plains_edge_left.png",
                    imageheight: 32,
                    imagewidth: 32
                },
                {
                    id: 33,
                    image: "Resources/Tiles_mini/terrain_plains_edge_right.png",
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

// Load the tilemap
loadTileMap("mini", miniMapData);

export { miniMapData, loadTileMap, TiledMapData, TiledLayer, TiledTileset, TiledTile };
