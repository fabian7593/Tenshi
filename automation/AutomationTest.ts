import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const entityName = process.argv[2];
if (!entityName) {
    console.error("Please write the entity Name");
    process.exit(1);
}

const entityPath = path.join(__dirname, '../src', 'entity', `${entityName}.ts`);
const modulePath = path.join(__dirname, '../test', 'integration');
const postmanPath = path.join(__dirname, '../test', 'postman');
const testFilePath = path.join(modulePath, `${entityName}.test.ts`);
const postmanCollectionPath = path.join(postmanPath, `${entityName}_postman_collection.json`);

// Create folder if not exists
if (!fs.existsSync(postmanPath)) {
    fs.mkdirSync(postmanPath, { recursive: true });
}

// Excluded fields for automatic generation
const excludedFields = ["id", "created_date", "updated_date", "is_deleted"];

// Extract fields and types from entity with unique validation
function extractEntityFields(entityFilePath: string): { name: string; type: string; unique: boolean }[] {
    const source = fs.readFileSync(entityFilePath, 'utf-8');
    const sourceFile = ts.createSourceFile(entityFilePath, source, ts.ScriptTarget.ES2015, true);

    const fields: { name: string; type: string; unique: boolean }[] = [];
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name?.escapedText === entityName) {
            node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
                    const fieldName = member.name.escapedText.toString();
                    const fieldType = member.type?.getText() || 'any';
                    
                    const isUnique = ts.getDecorators(member)?.some((decorator: ts.Decorator) => 
                        ts.isDecorator(decorator) &&
                        ts.isCallExpression(decorator.expression) &&
                        decorator.expression.expression.getText() === 'Unique'
                    ) ?? false;

                    if (!excludedFields.includes(fieldName)) {
                        fields.push({ name: fieldName, type: fieldType, unique: isUnique });
                    }
                }
            });
        }
    });
    return fields;
}

const fields = extractEntityFields(entityPath);

// Helper to generate test values based on type
function generateTestValue(field: { name: string; type: string; unique: boolean }) {
    switch (field.type) {
        case 'number':
        case 'int':
            return 100;  // Example static number
        case 'boolean':
        case 'tinyint':
            return true;
        case 'Date':
            return `"${new Date().toISOString()}"`;
        case 'string':
        case 'varchar':
            return field.unique ? `"test_${field.name}_"+Date.now()` : `"test_${field.name}"`;
        default:
            return `"test_${field.name}"`;
    }
}

// Generate the test content
const testContent = `
import request from "supertest";
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

describe("${entityName} Endpoints", () => {

  const jwt = config.TEST.JWT_TEST;
  const apiKey = config.SERVER.SECRET_API_KEY;      
  const baseUrl = config.COMPANY.BACKEND_HOST; 
  let created${entityName}Id: any;

  it("should create a new ${entityName}", async () => {
    const response = await request(baseUrl)
      .post("${entityName.toLowerCase()}/add")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        ${fields.map(field => `${field.name}: ${generateTestValue(field)}`).join(',\n        ')}
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id");

    created${entityName}Id = response.body.data.id;
  });

  it("should update an existing ${entityName}", async () => {
    const response = await request(baseUrl)
      .put(\`${entityName.toLowerCase()}/edit?id=\${created${entityName}Id}\`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        ${fields.map(field => `${field.name}: ${generateTestValue(field)}`).join(',\n        ')}
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", created${entityName}Id);
  });

  it("should get a ${entityName} by ID", async () => {
    const response = await request(baseUrl)
      .get(\`${entityName.toLowerCase()}/get?id=\${created${entityName}Id}\`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", created${entityName}Id);
  });

  it("should get all ${entityName} with pagination", async () => {
    const response = await request(baseUrl)
      .get(\`${entityName.toLowerCase()}/get_all\`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should delete an existing ${entityName}", async () => {
    const response = await request(baseUrl)
      .delete(\`${entityName.toLowerCase()}/delete?id=\${created${entityName}Id}\`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
  });
});
`;

// Crear el archivo de prueba si no existe
if (!fs.existsSync(testFilePath)) {
    fs.writeFileSync(testFilePath, testContent);
    console.log(`Test file created in ${testFilePath}`);
} else {
    console.log(`The test file already exists at ${testFilePath}, we do not overwrite.`);
}




const postmanCollection = {
    "info": {
        "name": `${entityName}`,
        "item": [
            {
                "name": `Create ${entityName}`,
                "request": {
                    "method": "POST",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": JSON.stringify(fields.reduce((acc: { [key: string]: any }, field) => {
                            acc[field.name] = generateTestValue(field);
                            return acc;
                        }, {}), null, 2),
                        "options": {
                            "raw": { "language": "json" }
                        }
                    },
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/add`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "add"]
                    }
                }
            },
            {
                "name": `Update ${entityName}`,
                "request": {
                    "method": "PUT",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": JSON.stringify(fields.reduce((acc: { [key: string]: any }, field) => {
                            acc[field.name] = generateTestValue(field);
                            return acc;
                        }, {}), null, 2),
                        "options": {
                            "raw": { "language": "json" }
                        }
                    },
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/edit?id=1`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "edit"],
                        "query": [{ "key": "id", "value": "1" }]
                    }
                }
            },
            {
                "name": `Get ${entityName} by ID`,
                "request": {
                    "method": "GET",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/get?id=1`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "get"],
                        "query": [{ "key": "id", "value": "1" }]
                    }
                }
            },
            {
                "name": `Get All ${entityName}`,
                "request": {
                    "method": "GET",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/get_all`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "get_all"]
                    }
                }
            },
            {
                "name": `Delete ${entityName}`,
                "request": {
                    "method": "DELETE",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/delete?id=1`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "delete"],
                        "query": [{ "key": "id", "value": "1" }]
                    }
                }
            },

            // Bulk Insert
            {
                "name": `Bulk Insert ${entityName}`,
                "request": {
                    "method": "POST",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": JSON.stringify(
                            Array.from({ length: 2 }, () =>
                                fields.reduce((acc: { [key: string]: any }, field) => {
                                    acc[field.name] = generateTestValue(field);
                                    return acc;
                                }, {})
                            ),
                            null,
                            2
                        ),
                        "options": {
                            "raw": { "language": "json" }
                        }
                    },
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/add_multiple`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "add_multiple"]
                    }
                },
                "response": []
            },

            // Bulk Update (full objects)
            {
                "name": `Bulk Update ${entityName}`,
                "request": {
                    "method": "PATCH",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": JSON.stringify(
                            Array.from({ length: 2 }, (_, i) => {
                                // start with the id
                                const obj: Record<string, any> = { id: i + 1 };
                                // then fill in every other field
                                for (const field of fields) {
                                obj[field.name] = generateTestValue(field);
                                }
                                return obj;
                            }),
                            null,
                            2
                            ),
                        "options": {
                            "raw": { "language": "json" }
                        }
                    },
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/edit_multiple`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "edit_multiple"]
                    }
                },
                "response": []
            },

            // Bulk Update by IDs (partial)
            {
                "name": `Bulk Update by Ids ${entityName}`,
                "request": {
                    "method": "PATCH",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": JSON.stringify(
                            {
                                "ids": [1, 2, null],
                                ...fields.reduce((acc: { [key: string]: any }, field) => {
                                    acc[field.name] = generateTestValue(field);
                                    return acc;
                                }, {})
                            },
                            null,
                            2
                        ),
                        "options": {
                            "raw": { "language": "json" }
                        }
                    },
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/edit_multiple_by_ids`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "edit_multiple_by_ids"]
                    }
                },
                "response": []
            },

            // Bulk Delete
            {
                "name": `Bulk Delete ${entityName}`,
                "request": {
                    "method": "POST",
                    "header": [
                        { "key": "authorization", "value": "{{auth_jwt}}", "type": "text" },
                        { "key": "x-api-key",     "value": "{{secret_api_key}}", "type": "text" }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": JSON.stringify({ "ids": [1, 2, 999, null] }, null, 2),
                        "options": {
                            "raw": { "language": "json" }
                        }
                    },
                    "url": {
                        "raw": `{{host}}/${entityName.toLowerCase()}/delete_multiple`,
                        "host": ["{{host}}"],
                        "path": [`${entityName.toLowerCase()}`, "delete_multiple"]
                    }
                },
                "response": []
            }
        ]
    }
};


// Save the Postman collection to a file
if (!fs.existsSync(postmanCollectionPath)) {
    fs.writeFileSync(postmanCollectionPath, JSON.stringify(postmanCollection, null, 2));
    console.log(`Postman collection created at ${postmanCollectionPath}`);
} else {
    console.log(`Postman collection already exists at ${postmanCollectionPath}, not overwriting.`);
}