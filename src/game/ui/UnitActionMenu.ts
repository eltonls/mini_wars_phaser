import { Scene } from "phaser";
import EventData from "../types/EventData";
import Unit from "../entities/units/Unit";

class UnitActionMenu {
    private scene: Scene
    private menu: Phaser.GameObjects.Container;
    private menuButtons: Phaser.GameObjects.Container[] = [];
    private position: Phaser.Math.Vector2;
    private menuOptions = [
        { label: "Mover", value: "move" },
        { label: "Ação", value: "action" },
        { label: "Esperar", value: "wait" }
    ]
    private unit?: Unit;

    constructor(scene: Scene) {
        this.scene = scene;
        this.createMenu();
        this.setupEventListeners();
        this.setMenuEventListeners();
    }

    public createMenu(): void {
        this.menu = new Phaser.GameObjects.Container(this.scene, 0, 0);

        this.menuOptions.forEach((option, index) => {
            const container = new Phaser.GameObjects.Container(this.scene, 0, (1 + 32) * index);
            const text = new Phaser.GameObjects.Text(this.scene, 0, 0, option.label, {
                fontSize: 14,
                fontStyle: "bold",
                fontFamily: "Monogram"
            }).setOrigin(0.5);
            const buttonImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "button").setScale(2);
            buttonImage.setDepth(1);

            container.add([buttonImage, text]);

            // Set everything Interactive or else it wont click
            container.setInteractive();
            buttonImage.setInteractive();
            text.setInteractive();

            const hitboxWidth = buttonImage.width * buttonImage.scaleX;
            const hitboxHeight = buttonImage.height * buttonImage.scaleY;

            container.setDepth(10);
            container.setInteractive(new Phaser.Geom.Rectangle(-hitboxWidth / 2, -hitboxHeight / 2, 100, 100), Phaser.Geom.Rectangle.Contains);

            this.menuButtons.push(container);
        })

        this.menu.add(this.menuButtons);
        this.menu.setDepth(300);
        this.scene.add.existing(this.menu);
        this.menu.setVisible(false);
        this.setMenuEventListeners();
    }

    private setupEventListeners(): void {
        this.scene.events.on("tileClick", this.handleClick.bind(this))
    }

    private setMenuEventListeners(): void {
        this.menuButtons.forEach((button, idx) => {
            // Add the event listener to both elements inside the container
            // Prevents it to be unresponsive
            button.list[0].on("pointerdown", () => this.onMenuClick(this.menuOptions[idx].value))
            button.list[1].on("pointerdown", () => this.onMenuClick(this.menuOptions[idx].value))
        })
    }

    private onMenuClick(actionType: string): void {
        const eventData: EventData = {
            unit: this.unit,
            tile: this.unit?.getCurrentTile(),
            terrain: this.unit?.getCurrentTile().getTerrain(),
        }

        switch (actionType) {
            case "move":
                if (!eventData.unit?.getHasMoved()) {
                    this.scene.events.emit("moveSelected", eventData);
                }
                break;
            case "action":
                if (!eventData.unit?.getHasActed()) {
                    this.scene.events.emit("actionSelected", eventData);
                }
                break;
            case "wait":
                this.scene.events.emit("waitSelected", eventData);
                break;
        }

        this.hideMenu();
    }

    private handleClick(eventData: EventData): void {
        if (eventData.unit && eventData.unit.isPlayerOwner) {
            this.unit = eventData.unit;
            this.position = eventData.position!;

            if (eventData.unit?.getHasMoved()) {
                this.menuButtons[0].setAlpha(0.5);
            } else {
                this.menuButtons[0].setAlpha(1);
            }

            if (eventData.unit?.getHasActed()) {
                this.menuButtons[1].setAlpha(0.5);
            } else {
                this.menuButtons[1].setAlpha(1);
            }

            this.showMenu(this.position);

        } else {
            this.hideMenu();
        }
    }

    public showMenu(position?: Phaser.Math.Vector2): void {
        this.menu.setVisible(true);
        this.menu.setPosition((position!.x + 1) * 32, (position!.y + 2) * 32);
    }

    public hideMenu(): void {
        this.menu.setVisible(false);
    }
}

export default UnitActionMenu;