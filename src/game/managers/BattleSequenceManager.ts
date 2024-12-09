import Phaser from 'phaser';
import GameScene from '../scenes/GameScene';
import Unit from '../entities/units/Unit';
import Tile from '../entities/Tile';

interface BattleData {
    attacker: Unit;
    defender: Unit;
    attackerStartPos: Phaser.Math.Vector2;
    defenderStartPos: Phaser.Math.Vector2;
}

class BattleSequenceManager {
    private scene: GameScene;
    private battleOverlay?: Phaser.GameObjects.Rectangle;
    private attackerSprite?: Phaser.GameObjects.Sprite;
    private defenderSprite?: Phaser.GameObjects.Sprite;
    private damageText?: Phaser.GameObjects.Text;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.setupEventListeners();
    }
    
    private setupEventListeners(): void {
        this.scene.events.on('initiateBattle', this.initiateBattle.bind(this));
        this.scene.events.on("battleComplete", this.handleBattleComplete.bind(this));
    }

    async initiateBattle(attacker: Unit, defender: Unit): void {
        const battleData: BattleData = {
            attacker,
            defender,
            attackerStartPos: new Phaser.Math.Vector2(attacker.x, attacker.y),
            defenderStartPos: new Phaser.Math.Vector2(defender.x, defender.y)
        };

        this.createBattleOverlay();
        this.setupBattleSequence(battleData);
    }

    private createBattleOverlay(): void {
        this.battleOverlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000,
            0.7
        ).setDepth(1000);
    }

    private setupBattleSequence(battleData: BattleData): void {
        const { attacker, defender } = battleData;

        // Create battle sprites
        this.attackerSprite = this.scene.add.sprite(
            this.scene.cameras.main.centerX - 150,
            this.scene.cameras.main.centerY,
            attacker.texture.key
        ).setScale(3).setDepth(1001);

        this.defenderSprite = this.scene.add.sprite(
            this.scene.cameras.main.centerX + 150,
            this.scene.cameras.main.centerY,
            defender.texture.key
        ).setScale(3).setDepth(1001);

        // Calculate damage
        const damage = this.calculateDamage(attacker, defender);

        // Create damage text
        this.damageText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100,
            `Damage: ${damage}`,
            { fontSize: '32px', color: '#ff0000' }
        ).setOrigin(0.5).setDepth(1002);

        // Add battle animation sequence
        this.animateBattleSequence(battleData, damage);
    }

    private calculateDamage(attacker: Unit, defender: Unit): number {
        // Basic damage calculation - can be expanded
        return Math.max(0, attacker.stats.attack - defender.stats.defense);
    }

    private animateBattleSequence(battleData: BattleData, damage: number): void {
        // Attacker movement
        this.scene.tweens.add({
            targets: this.attackerSprite,
            x: this.scene.cameras.main.centerX,
            duration: 300,
            yoyo: true,
            onComplete: () => {
                battleData.defender.stats.health -= damage;

                this.createHitEffect();

                console.log(battleData);
                
                this.endBattleSequence(battleData);
                this.scene.events.emit('battleComplete', battleData);
            }
        });
    }

    private createHitEffect(): void {
        const hitEffect = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xffffff,
            0.5
        ).setDepth(1003);

        this.scene.tweens.add({
            targets: hitEffect,
            alpha: 0,
            duration: 200,
            onComplete: () => hitEffect.destroy()
        });
    }
    
    private handleBattleComplete(battleData: BattleData): void {
        const { attacker, defender } = battleData;

        if (defender.stats.health <= 0) {
            const defenderTile = this.scene.getGridSystem().getTileAt(defender.x, defender.y);
            defenderTile.setOccupyingUnit(undefined);
            defender.destroy();
        } 
        
        this.endBattleSequence(battleData);
    }

    private endBattleSequence(battleData: BattleData): void {
        this.attackerSprite?.destroy(true);
        this.defenderSprite?.destroy(true);
        this.battleOverlay?.destroy(true);
        this.damageText?.destroy(true)
        
        // this.scene.events.emit('battleComplete', battleData);
    }
}

export default BattleSequenceManager;