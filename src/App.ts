import TrendController from "./controllers/TrendController";

export default class App {
  public run(): void {
    const controller = new TrendController();
    controller.init();
  }
}
