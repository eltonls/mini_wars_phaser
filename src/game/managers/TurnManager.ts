import GameScene from "../scenes/GameScene";
import AISystem from "../core/AISystem";

class TurnManager {
    private scene: GameScene;
    private isPlayerRound: boolean;
    private actualRound: number;
    private aiManager: AISystem;
    
    constructor(scene: GameScene) {
        this.scene = scene;
        this.isPlayerRound = true;
        this.actualRound = 1;
        this.aiManager = new AISystem(scene);
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.scene.events.on("playerTurnEnd", this.handleRoundChange.bind(this));
        this.scene.events.on("aiTurnEnd", this.startPlayerTurn.bind(this));
    }

    private handleRoundChange(): void {
        this.isPlayerRound = false;
        this.scene.events.emit("turnChange", { isPlayerTurn: false });
        // Start AI turn
        this.aiManager.startAITurn();
    }

    public startPlayerTurn(): void {
        this.isPlayerRound = true;
        this.actualRound++;
        this.scene.events.emit("turnChange", { isPlayerTurn: true, round: this.actualRound });
    }

    public getIsPlayerTurn(): boolean {
        return this.isPlayerRound;
    }

    public getAIManager(): AISystem {
        return this.aiManager;
    }
}

export default TurnManager;
