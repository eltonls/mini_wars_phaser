class UnitStats {
    public health: number;
    public maxHealth: number;
    public attack: number;
    public defense: number;
    public evasion: number;
    public resistance: number;
    public range: number;
    public movement: number;
    public sprite: string;

    constructor(health: number, maxHealth: number, attack: number, defense: number, evasion: number, resistance: number, range: number, movement: number, sprite: string) {
        this.health = health;
        this.maxHealth = maxHealth;
        this.attack = attack;
        this.defense = defense;
        this.evasion = evasion;
        this.resistance = resistance;
        this.range = range;
        this.movement = movement;
        this.sprite = sprite;
    }
}

export default UnitStats;
