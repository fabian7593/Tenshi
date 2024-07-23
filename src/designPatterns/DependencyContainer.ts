import { DependencyInjection } from '@patterns/DependencyInjection';
import { default as Validations } from '@helpers/Validations';
import { default as HttpAction } from '@helpers/HttpAction';
import { Request, Response } from 'express'; 

class SingletonDependencyContainer {
  private static instance: DependencyInjection;

  private constructor() {}

  /**
   * This class is a singleton of the Dependency Injection pattern.
   * It is used to store and retrieve instances of classes and their dependencies.
   * The `register` method is used to register classes and their dependencies.
   * The `getInstance` method returns an instance of the class.
   */
  public static getInstance(): DependencyInjection {
    // Check if the instance is already created
    if (!SingletonDependencyContainer.instance) {
      // Initialize the instance
      SingletonDependencyContainer.instance = new DependencyInjection();

      // Register dependencies
      // HttpAction is a class that handles HTTP actions
      SingletonDependencyContainer.instance.register('HttpAction', (res: Response) =>  
                                                    new HttpAction(res));

      // Validations is a class that handles validations
      SingletonDependencyContainer.instance.register('Validations', (req: Request, res: Response, httpAction: HttpAction) => 
                                                    new Validations(req, res, httpAction));
    }
    // Return the instance
    return SingletonDependencyContainer.instance;
  }

}

export { SingletonDependencyContainer };
