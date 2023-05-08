function getSwagger(port: string): any {
  return {
    openapi: "3.0.0",
    info: {
      title: "node-express-typescript-boilerplate API documentation",
      version: "0.0.1",
      description: "This is a node express mongoose boilerplate in typescript",
      license: {
        name: "MIT",
        url: "",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/v1`,
        description: "Development Server",
      },
    ],
  };
}

export default getSwagger;
