import { OpenAPIParser } from '../parser/OpenAPIParser';

async function analyzeOpenAPISpec() {
  const parser = new OpenAPIParser();
  
  // Your OpenAPI specification
  const specContent = `openapi: 3.1.0
info:
  title: Simple Example API
  description: A simple API example using OpenAPI 3.1.0
  version: 1.0.0

servers:
  - url: https://api.example.com/v1

paths:
  /users:
    get:
      summary: Get all users
      description: Returns a list of users.
      responses:
        '200':
          description: A JSON array of user objects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create a user
      description: Creates a new user and returns the created object.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: The created user object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          example: "123"
        name:
          type: string
          example: "Alice"
        email:
          type: string
          format: email
          example: "alice@example.com"`;

  // Parse the specification
  const result = await parser.parse(specContent);
  
  if (result.isValid && result.document) {
    // Get OpenAPI version
    const version = parser.getVersion(result.document);
    console.log('OpenAPI Version:', version);

    // Get API information
    const info = parser.getInfo(result.document);
    console.log('API Info:', info);

    // Get servers
    const servers = parser.getServers(result.document);
    console.log('Servers:', servers);

    // Get paths and their operations
    const paths = parser.getPaths(result.document);
    console.log('Paths:', paths);

    // Get components (schemas)
    const components = parser.getComponents(result.document);
    console.log('Components:', components);

    // Get all references used in the document
    const references = parser.getReferences(result.document);
    console.log('References:', references);
  } else {
    console.error('Invalid OpenAPI specification:', result.errors);
  }
}

// Run the example
analyzeOpenAPISpec().catch(console.error);
