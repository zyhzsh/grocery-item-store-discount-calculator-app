import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { response } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Make sure AppModule is imported correctly
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Item', () => {
    it('/ (POST) Create Item, then Delete it', () => {
      const newItem = {
        name: 'Amsterdam Potatoes',
        type: 'VEGETABLE',
        brandOriginCountry: 'NL',
        productionDate: '2024-04-28',
        prices: [
          {
            unit: 'KILOGRAM',
            currency: 'EUR',
            value: 2.0,
          },
        ],
      };
      return request(app.getHttpServer())
        .post('/items')
        .send(newItem)
        .then((response) => {
          const { statusCode, body } = response;
          expect(statusCode).toBe(201);
          expect(body.name).toBe(newItem.name);
          expect(body.id).not.toBe(null);
          request(app.getHttpServer()).delete(`/items/${body.id}`).expect(200);
        });
    });
  });

  afterAll(async () => {
    await app.close(); // Ensure to close the app after tests
  });
});
