-- Ensure the UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum type definitions
CREATE TYPE item_type_enum AS ENUM ('BREAD', 'VEGETABLE', 'BEER');
CREATE TYPE item_brandorigincountry_enum AS ENUM ('NL', 'BE', 'DE');
CREATE TYPE item_price_currency_enum AS ENUM ('EUR', 'USD', 'CNY');
CREATE TYPE item_price_unit_enum AS ENUM ('GRAM', 'KILOGRAM', 'PIECE', 'LOAF', 'BOTTLE', 'CAN', 'PACK');
CREATE TYPE order_currency_enum AS ENUM ('EUR', 'USD', 'CNY');

-- Table definitions
CREATE TABLE item (
    id                   UUID DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423"
            PRIMARY KEY,
    name                 VARCHAR NOT NULL,
    type                 item_type_enum NOT NULL,
    "productionDate"     TIMESTAMP NOT NULL,
    "brandOriginCountry" item_brandorigincountry_enum NOT NULL
);

CREATE TABLE item_price (
    id       UUID DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT "PK_bf831a4a3a9eca20d4ef2322d7d"
            PRIMARY KEY,
    currency item_price_currency_enum NOT NULL,
    unit     item_price_unit_enum NOT NULL,
    value    NUMERIC NOT NULL,
    "itemId" UUID
        CONSTRAINT "FK_f8046453707754686bb1775ef71"
            REFERENCES item
            ON DELETE CASCADE
);

CREATE TABLE "order" (
    id       UUID DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT "PK_1031171c13130102495201e3e20"
            PRIMARY KEY,
    currency order_currency_enum NOT NULL
);

CREATE TABLE order_item (
    id        UUID DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90"
            PRIMARY KEY,
    "itemId"  UUID NOT NULL,
    "priceId" UUID NOT NULL,
    quantity  NUMERIC NOT NULL,
    "orderId" UUID
        CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"
            REFERENCES "order"
);

-- Insert initial data into the item table with dynamic production dates
INSERT INTO item (name, type, "productionDate", "brandOriginCountry")
VALUES
('White Bread', 'BREAD', CURRENT_DATE, 'NL'),
('Whole Wheat Bread', 'BREAD', CURRENT_DATE - INTERVAL '3 days', 'NL'),
('Rye Bread', 'BREAD', CURRENT_DATE - INTERVAL '1 day', 'NL'),
('Sourdough Bread', 'BREAD', CURRENT_DATE, 'NL'),
('Baguette', 'BREAD', CURRENT_DATE - INTERVAL '6 days', 'NL'),
('Lager Beer', 'BEER', CURRENT_DATE, 'NL'),
('Stout Beer', 'BEER', CURRENT_DATE, 'BE'),
('Ale Beer', 'BEER', CURRENT_DATE, 'DE'),
('Carrot', 'VEGETABLE', CURRENT_DATE, 'BE'),
('Tomato', 'VEGETABLE', CURRENT_DATE, 'BE'),
('Lettuce', 'VEGETABLE', CURRENT_DATE, 'BE');

-- Insert initial prices for each item with dynamic reference to the items by name and type
INSERT INTO item_price (currency, unit, value, "itemId")
SELECT 'EUR'::item_price_currency_enum, 'PIECE'::item_price_unit_enum, 1.50, id FROM item WHERE name = 'White Bread'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'PIECE'::item_price_unit_enum, 1.75, id FROM item WHERE name = 'Whole Wheat Bread'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'PIECE'::item_price_unit_enum, 2.00, id FROM item WHERE name = 'Rye Bread'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'CAN'::item_price_unit_enum, 1.20, id FROM item WHERE name = 'Lager Beer'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'CAN'::item_price_unit_enum, 1.50, id FROM item WHERE name = 'Stout Beer'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'CAN'::item_price_unit_enum, 1.75, id FROM item WHERE name = 'Ale Beer'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'GRAM'::item_price_unit_enum, 0.50, id FROM item WHERE name = 'Carrot'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'GRAM'::item_price_unit_enum, 0.75, id FROM item WHERE name = 'Tomato'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'GRAM'::item_price_unit_enum, 1.00, id FROM item WHERE name = 'Lettuce'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'PIECE'::item_price_unit_enum, 2.50, id FROM item WHERE name = 'Sourdough Bread'
UNION ALL
SELECT 'EUR'::item_price_currency_enum, 'PIECE'::item_price_unit_enum, 2.25, id FROM item WHERE name = 'Baguette';
