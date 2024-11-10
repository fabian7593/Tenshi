import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const entityName = process.argv[2];
if (!entityName) {
    console.error("Por favor, proporciona el nombre de la entidad.");
    process.exit(1);
}

const entityPath = path.join(__dirname, '../src', 'entity', `${entityName}.ts`);
const modulePath = path.join(__dirname, '../src', 'modules', entityName.toLowerCase());
const dtoPath = path.join(modulePath, 'dtos');
const routerPath = path.join(modulePath, 'routers');

// Campos que deben omitirse en la generación automática
const excludedFields = ["id", "created_date", "updated_date", "is_deleted"];

// Función para extraer campos y tipos desde la entidad
function extractEntityFields(entityFilePath: string): { name: string; type: string }[] {
    const source = fs.readFileSync(entityFilePath, 'utf-8');
    const sourceFile = ts.createSourceFile(entityFilePath, source, ts.ScriptTarget.ES2015, true);

    const fields: { name: string; type: string }[] = [];
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name?.escapedText === entityName) {
            node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
                    const fieldName = member.name.escapedText.toString();
                    const fieldType = member.type?.getText() || 'any';
                    // Omitir campos excluidos
                    if (!excludedFields.includes(fieldName)) {
                        fields.push({ name: fieldName, type: fieldType });
                    }
                }
            });
        }
    });
    return fields;
}


function extractAllFields(entityFilePath: string): { name: string; type: string }[] {
    const source = fs.readFileSync(entityFilePath, 'utf-8');
    const sourceFile = ts.createSourceFile(entityFilePath, source, ts.ScriptTarget.ES2015, true);

    const fields: { name: string; type: string }[] = [];
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name?.escapedText === entityName) {
            node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
                    const fieldName = member.name.escapedText.toString();
                    const fieldType = member.type?.getText() || 'any';
                    fields.push({ name: fieldName, type: fieldType });
                }
            });
        }
    });
    return fields;
}

// Función para extraer campos y determinar si tienen relaciones o si son nullable
// Función para extraer campos y determinar si tienen relaciones o si son nullable
function extractEntityFieldsAndRelations(entityFilePath: string): {
    fields: string[];
    relations: string[];
    requiredFields: string[];
} {
    const source = fs.readFileSync(entityFilePath, 'utf-8');
    const sourceFile = ts.createSourceFile(entityFilePath, source, ts.ScriptTarget.ES2015, true);

    const fields: string[] = [];
    const relations: string[] = [];
    const requiredFields: string[] = []; 
    const getFields: string[] = [];

    ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name?.escapedText === entityName) {
            node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
                    const fieldName = member.name.escapedText.toString();
                    const isNullable = member.questionToken !== undefined;
                    const isRelation = ts.getDecorators(member)?.some((decorator: any) =>
                        ts.isCallExpression(decorator.expression) &&
                        ['OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'].includes(
                            decorator.expression.expression.getText()
                        )
                    );

                    if(isNullable){
                        requiredFields.push(`req.body.${fieldName}`); 
                    }

                    if (!['id', 'created_date', 'updated_date', 'is_deleted'].includes(fieldName)) {
                        fields.push(`req.body.${fieldName}`);
                    }

                    if (isRelation) {
                        relations.push(fieldName);
                    }
                }
            });
        }
    });
    return { fields, relations, requiredFields };
}




// Crear carpeta del módulo si no existe
if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
}

// Crear carpetas para DTO y Router si no existen
if (!fs.existsSync(dtoPath)) {
    fs.mkdirSync(dtoPath, { recursive: true });
}
if (!fs.existsSync(routerPath)) {
    fs.mkdirSync(routerPath, { recursive: true });
}

// Extraer campos de la entidad para el DTO
const fields = extractEntityFields(entityPath);
const getfields = extractAllFields(entityPath);

// Extraer campos y relaciones de la entidad para Routes
const { fields: routeFields, relations } = extractEntityFieldsAndRelations(entityPath);

// Generar contenido para el archivo DTO
const dtoContent = `
import { ${entityName} } from "@index/entity/${entityName}";
import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";

export default class ${entityName}DTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): ${entityName} {
        const entity = new ${entityName}();
        ${fields.map(field => `        entity.${field.name} = this.req.body.${field.name};`).join('\n')}
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): ${entityName} {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): ${entityName} {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: ${entityName}): any {
        return {
            ${getfields.map(field => `            ${field.name}: entity.${field.name},`).join('\n')}
        };
    }

    entitiesToResponse(entities: ${entityName}[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
`;

// Generar archivo DTO solo si no existe
const dtoFilePath = path.join(dtoPath, `${entityName}DTO.ts`);
if (!fs.existsSync(dtoFilePath)) {
    fs.writeFileSync(dtoFilePath, dtoContent);
    console.log(`Archivo DTO creado en ${dtoFilePath}`);
} else {
    console.log(`El archivo DTO ya existe en ${dtoFilePath}, no se sobrescribió.`);
}

// Generar contenido para el archivo Routes
const routesContent = `import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { ${entityName} } from "@index/entity/${entityName}";
import ${entityName}DTO from "@modules/${entityName.toLowerCase()}/dtos/${entityName}DTO";

class ${entityName}Routes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(${entityName}), "/${entityName.toLowerCase()}");
        ${relations.length > 0 ? `this.filters.relations = ${JSON.stringify(relations)};` : ''}
    }

    protected initializeRoutes() {
        this.router.get(\`\${this.getRouterName()}/get\`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ${entityName}DTO(req))
                                    .setMethod("get${entityName}ById")
                                    .isValidateRole("${entityName.toUpperCase()}")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(\`\${this.getRouterName()}/get_all\`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ${entityName}DTO(req))
                                    .setMethod("get${entityName}s")
                                    .isValidateRole("${entityName.toUpperCase()}")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(\`\${this.getRouterName()}/add\`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                ${routeFields.join(',\n                ')}
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ${entityName}DTO(req))
                                    .setMethod("insert${entityName}")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("${entityName.toUpperCase()}")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(\`\${this.getRouterName()}/edit\`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ${entityName}DTO(req))
                                    .setMethod("update${entityName}")
                                    .isValidateRole("${entityName.toUpperCase()}")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(\`\${this.getRouterName()}/delete\`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ${entityName}DTO(req))
                                    .setMethod("delete${entityName}")
                                    .isValidateRole("${entityName.toUpperCase()}")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default new ${entityName}Routes();
`;

const routerFilePath = path.join(routerPath, `${entityName}Routes.ts`);
if (!fs.existsSync(routerFilePath)) {
    fs.writeFileSync(routerFilePath, routesContent);
    console.log(`Archivo de rutas creado en ${routerFilePath}`);
} else {
    console.log(`El archivo de rutas ya existe en ${routerFilePath}, no se sobrescribió.`);
}
