export default class EventStore {
  private queue: Array<any> = new Array<any>();
  private map: Map<any, (event: any) => void> = new Map<any, (event: any) => void>();
  
  public publish(event: any): void {
    this.queue.push(event);
  }

  public process_events(): void {
    let event = this.queue.shift();
    while (event) {
      const handler = this.map.get(event.constructor);
      handler!(event);
      event = this.queue.shift();
    }
  }

  public register(eventClass: any, handler: (event: any) => void) {
    this.map.set(eventClass, handler);
  }
}