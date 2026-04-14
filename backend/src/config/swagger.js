const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Secure RBAC Task Manager API",
      version: "1.0.0",
      description: "API documentation for authentication and task management."
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        UserAuthInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Alex Doe" },
            email: { type: "string", example: "alex@example.com" },
            password: { type: "string", example: "secret123" }
          }
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "alex@example.com" },
            password: { type: "string", example: "secret123" }
          }
        },
        TaskInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Finish report" },
            description: { type: "string", example: "Complete by Monday" },
            completed: { type: "boolean", example: false }
          }
        },
        Task: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" },
            createdBy: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Invalid email format" }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJSDoc(options);
