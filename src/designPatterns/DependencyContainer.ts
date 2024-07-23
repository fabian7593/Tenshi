export default class DependencyContainer {
    private dependencies = new Map<string, any>();
  
    register(name: string, dependency: any) {
      this.dependencies.set(name, dependency);
    }
  
    resolve<T>(name: string): T {
      const dependency = this.dependencies.get(name);
      if (!dependency) {
        throw new Error(`Dependency ${name} not found`);
      }
      return dependency;
    }
  }