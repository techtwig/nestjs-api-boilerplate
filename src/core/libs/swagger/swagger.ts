import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

const swaggerCustomCss = `
.swagger-ui .model-box-control:focus, .swagger-ui .models-control:focus, .swagger-ui .opblock-summary-control:focus {
  outline: none
}
`;

export const swaggerFactory = async (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Nest.js API Boilerplate')
    .setDescription('Nest.js API Boilerplate swagger openapi')
    .setVersion('v1.0.0')
    .addServer('http://localhost:4000')
    .addBearerAuth(undefined, 'Authorization')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}-${methodKey}`.toLowerCase(),
  };

  // await SwaggerModule.loadPluginMetadata(metadata);
  const allDocument = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    customCss: swaggerCustomCss,
    swaggerOptions: {
      persistAuthorization: true,
      validatorUrl: 'https://validator.swagger.io/validator',
    },
  };

  SwaggerModule.setup('openapi', app, allDocument, customOptions);
};
