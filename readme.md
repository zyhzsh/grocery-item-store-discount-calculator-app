# Get start

_Run the App with docker-compose_

```
docker-compose up --build
```

server (NestJs/Typescript)

- Swagger API: [http://localhost:3000/api](http://localhost:3000/api)

- run local development `pnpm run start:dev`

- run unit test

  `pnpm run test:watch`

client(React)

- Demo: [http://localhost:3001/](http://localhost:3001/)

DB (Initialization data sql for PostgreSQL)

**Demo**

![demo](./video/demo.mp4)

### Functional/Nonfunctional requirement

#### Item Details

- **Name**: Each item should have a unique name to help users distinguish between different products without solely relying on the type.
- **Type**: Items can be classified into categories such as beer, vegetable, bread, etc.
- **Production Date**: The date of production is used to attribute a specific date to a product, which helps in calculating the age of items like bread for discount calculations.
- **Brand Origin Country**: The term 'brand origin country' is used instead of 'production country' or 'country' because a product from a particular brand, like the Dutch "Heineken" beer, may be produced in factories located in various countries.
- **Pricing Variability**:
  - As this involves an e-commerce setting, supplying to different countries necessitates distinct pricing strategies. Therefore, the same product will have different prices in various markets and countries.
  - Additionally, to further differentiate products, there might be various packaging options that could affect pricing. For example, beer can be sold in cans or bottles, and vegetables might be priced differently per kilogram or gram.

#### Order Details

- **Currency**: Each order must specify the currency used for transactions.
- **Order Items**: An order should include at least one or multiple order items. Each order item must contain a `priceId`, `itemId`, and `quantity`. The `quantity` can denote either the number of items, such as 5 cans of beer, or the weight, such as 740 grams of vegetables.

While orders typically include a `status` to verify order information and associate it with post-discount calculations, this aspect has been simplified in this scenario. The absence of this detail does not impact the calculation of discounts. Additionally, it is assumed that the order can be distributed to other services; therefore, only key information is included in this app.

### Functional/NonFunctional Requirements

| **Function**                                 | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create Order (Return Calculation Result)** | - Users can add multiple items to an order. <br />- The server will automatically merge duplicate items and sum their quantities. <br />- All order item must have the currency; otherwise, the creation will fail. <br />- The server validates that the item and its prices exist in the database and checks that the unit and quantity are legitimate (e.g., CAN, BOTTLE cannot be 1.5, but currently it's not allowed to give CAN, Bottle for vegetable, but this can easily be modified ).<br />- After creating the order, the server generates a receipt detailing the order ID, currency, discount amount, total price before and after the discount, and detailed order items including item ID, quantity, type, unit, unit price, currency, production date, and brand origin country. <br />- A bread older than 6 days should not be able to add <br />- The discount calculation follows the rules described in the subsequent chapter. |
| **Add Item**                                 | - Users can add a new item.<br />- When adding an item, the user must provide at least one price for the item, specifying the unit, unit price, and currency to complete the creation process.<br />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Remove Item**                              | When an item is removed, all associated item prices should also be deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Add Price for Item**                       | The unit and currency are used to identify the item price. If these properties match an existing item price, the operation should update the existing price with the newly input unit price. Certain units must be in integer values only, such as CAN, BOTTLES, etc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Remove Price for Item**                    | Each item must retain at least one price; thus, deleting the last item's price is not allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **List Discount Rules**                      | Returns the discount rules available to the user.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **List Items**                               | Returns a listing of all items available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

#### Variable Range (E-commerce Grocery Store)

- The production date should not be in the future.

**Variable Range for Pricing and Quantities:**

- 0.01 <= unit price (item price value) <= 50000 (Temporarily exclude small currencies, this should be the normal range for grocery)
- 0.01 (or 1 when unit requires integer) <= quantity (order's quantity) <= 20000

#### Discount Rules/Calculation Specifications

_Calculation results will be rounded to two decimal places automatically._

_Currently, it's not allowed to give CAN or bottles for vegetables, but this can easily be modified_

**Vegetable Discounts:**

- Discounts are percentage-based depending on the weight.
- Applied to all vegetable items in the same order.
- This rule only applies to items measured in grams or kilograms (e.g., canned corn and other similar products are not included in these rules).
  - 0g~100g: 5% discount
  - 100g~500g: 7% discount
  - More than 500g: 10% discount

**Bread Discounts:**

- Bread older than 6 days cannot be added to an order.

- Discounts Based on Bread Age：**1 day old or newer**: No discount applies.
- Discounts Based on Bread Age：**3 days old**: Eligible for a "buy 1 take 2 free" discount. (meaning, pay 1 take 2 in total )
- Discounts Based on Bread Age：**6 days old**: Eligible for a "buy 1 take 3 free" discount. (meaning, pay 1 take 3 in total )

**Beer Discounts:**

- Discounts are only applicable in EUR.
- Discounts apply only when beer is bought in packs of 6.
  - €3.00 for each Belgium beer pack.
  - €2.00 for each Dutch beer pack.
  - €4.00 for each German beer pack.

Some of the notes:

https://app.eraser.io/workspace/8aogJMu6qb0y71d4DRBJ?origin=share
