// DependencyContainer.ts
type Factory<T> = (...args: any[]) => T;

export class DependencyInjection {
  private factories = new Map<string, Factory<any>>();

  register<T>(name: string, factory: Factory<T>) {
    this.factories.set(name, factory);
  }

  resolve<T>(name: string, ...args: any[]): T {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Dependency ${name} not found`);
    }
    return factory(...args);
  }
}
