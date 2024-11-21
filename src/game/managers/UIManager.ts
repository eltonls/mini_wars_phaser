import GameScene from "../scenes/GameScene";
import EventData from "../types/EventData";
import UnitStats from "../types/UnitStats";

class UIManager {
    private scene: GameScene;
    private unitInfoMenu: Phaser.GameObjects.Container;
    private unitInfoBackground: Phaser.GameObjects.Image;
    private unitInfoText: Phaser.GameObjects.Text[];

    // Constants for positioning and animation
    private readonly MENU_WIDTH = 200;
    private readonly MENU_HEIGHT = 100;
    private readonly PEEK_PERCENTAGE = 0.01; // 10% in view
    private readonly ANIMATION_DURATION = 300; // milliseconds

    constructor(scene: GameScene) {
        this.scene = scene;
        this.unitInfoMenu = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.unitInfoText = new Array<Phaser.GameObjects.Text>;
        
        this.createUnitInfoMenu();
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.scene.events.on("tileHover", this.showUnitInfo.bind(this));
        this.scene.events.on("tileHoverEnd", this.hideUnitInfo.bind(this));
    }

    private createUnitInfoMenu(): void {
        // Create background
        this.unitInfoBackground = new Phaser.GameObjects.Image(
            this.scene, 
            0, 
            0, 
            "menuBG"
        );
        this.unitInfoBackground.setScale(2);

        // Create text placeholder for Health
        this.unitInfoText.push(new Phaser.GameObjects.Text(
            this.scene, 
            0, 
            0, 
            "", 
            {
                fontSize: 16,
                color: "black",
                fontStyle: "bold",
                fontFamily: "monogram"
            }
        ).setOrigin(0.5));

        // create text placeholder for defense
        this.unitInfoText.push(new Phaser.GameObjects.Text(
            this.scene, 
            0,
            0,
            "",
            {
                fontSize: 16,
                color: "black",
                fontStyle: "bold",
                fontFamily: "monogram"
            }
        ))

        this.unitInfoText.push(new Phaser.GameObjects.Text(
            this.scene, 
            0,
            0,
            "",
            {
                fontSize: 16,
                color: "black",
                fontStyle: "bold",
                fontFamily: "monogram"
            }
        ))

        // Add to container
        this.unitInfoMenu.add([this.unitInfoBackground, ...this.unitInfoText]);

        // Position initially
        const canvasWidth = this.scene.sys.canvas.width;
        const canvasHeight = this.scene.sys.canvas.height;
        
        // Calculate initial peek position (bottom left, 10% visible)
        const peekHeight = canvasHeight * this.PEEK_PERCENTAGE - 50;
        const xPosition = 66; // Slight offset from left edge
        const yPosition = canvasHeight - peekHeight;

        this.unitInfoMenu.setPosition(xPosition, yPosition);
        this.unitInfoMenu.setDepth(100);

        // Add to scene
        this.scene.add.existing(this.unitInfoMenu);
    }

    private showUnitInfo(eventData: EventData): void {
        if (!eventData.unit) return;

        // Update text with unit information
        this.unitInfoText[0].setText(`Vida: ${eventData.unit.stats.health}/${eventData.unit.stats.maxHealth}`).setOrigin(0.5, 2);
        this.unitInfoText[1].setText(`Resistência: ${eventData.unit.stats.resistance}`).setOrigin(0.5, 2).setPosition(0, 16);
        this.unitInfoText[2].setText(`Defesa: ${eventData.unit.stats.defense}`).setOrigin(0.5, 2).setPosition(0, 32).setAlign("left");

        // Animate menu sliding up
        this.scene.tweens.add({
            targets: this.unitInfoMenu,
            y: this.scene.sys.canvas.height - this.MENU_HEIGHT + 50,
            duration: this.ANIMATION_DURATION,
            ease: 'Power1'
        });
    }

    private hideUnitInfo(eventData: EventData): void {
        // Animate menu sliding back down to peek position
        const canvasHeight = this.scene.sys.canvas.height;
        const peekHeight = canvasHeight * this.PEEK_PERCENTAGE - 50;
        const yPosition = canvasHeight - peekHeight;

        this.scene.tweens.add({
            targets: this.unitInfoMenu,
            y: yPosition,
            duration: this.ANIMATION_DURATION,
            ease: 'Power1'
        });
    }
}

export default UIManager;
