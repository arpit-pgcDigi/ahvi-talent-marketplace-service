import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Talent Platform API')
    .setDescription(
      `## Enterprise Talent Marketplace\n\n` +
      `This API powers a B2B talent marketplace connecting hiring companies with vetted engineers.\n\n` +
      `### Authentication\n` +
      `All protected endpoints require a Bearer JWT token.\n` +
      `1. Register or login via \`/auth\` endpoints\n` +
      `2. Copy the \`access_token\` from the response\n` +
      `3. Click **Authorize** and paste the token (without the word "Bearer")\n\n` +
      `### Portals\n` +
      `- \`TALENT_PORTAL\` — for engineers building their profile\n` +
      `- \`HIRING_PORTAL\` — for companies browsing and hiring talent\n` +
      `- \`ADMIN_PORTAL\` — for platform operators\n\n` +
      `### Error Format\n` +
      `All errors follow this structure:\n` +
      `\`\`\`json\n{ "statusCode": 400, "message": "...", "timestamp": "..." }\n\`\`\``
    )
    .setVersion('1.0.0')
    .setContact('AHIVI Platform Team', 'https://ahivi.com', 'api@ahivi.com')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Paste your JWT token here (without the "Bearer" prefix)',
        in: 'header',
      },
      'JWT',
    )
    .addTag('Auth', 'User registration, login and token management')
    .addTag('Talent', 'Talent profile creation, updates and retrieval')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Talent Platform API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      docExpansion: 'list',
      tagsSorter: 'alpha',
    },
  });
}