import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";
import drinks from "../lib/drink-data.json";

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

const getUniqueIngredients = (drinks: any): string[] => {
  const ingredientSet = new Set<string>();

  drinks.forEach((drink: any) => {
    drink.ingredients.forEach((ingredient: any) => {
      ingredientSet.add(ingredient.ingredient);
    });
  });

  // Convert the set back to an array
  return Array.from(ingredientSet);
};

async function seedIngredients() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS ingredients (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  const ingredients = getUniqueIngredients(drinks);

  const insertedIngredient = await Promise.all(
    ingredients.map(
      (ing) => client.sql`
        INSERT INTO ingredients (name)
        VALUES (${ing})
      `,
    ),
  );

  return insertedIngredient;
}

async function seedDrinks() {
  const insertedDrinks = await Promise.all(
    drinks.map(async (drink) => {
      // Insert drink into drinks table
      const { name, method } = drink;
      const { rows: drinkRows } = await client.sql`
          INSERT INTO drinks (name, instructions)
          VALUES (${name}, ${method})
          RETURNING id;
        `;

      const drinkId = drinkRows[0].id;

      // Step 3: Insert ingredients and drink-ingredient relationships
      await Promise.all(
        drink.ingredients.map(async (ingredient) => {
          // Insert ingredient into ingredients table if it doesn't exist
          console.log("BANAN ingre");

          await client.sql`
              INSERT INTO ingredients (name)
              VALUES (${ingredient.ingredient}) ON CONFLICT (name) DO NOTHING;
          `;
          console.log("BANAN", ingredient.ingredient);
          const { rows: ingredientRows } = await client.sql`
              SELECT id FROM ingredients
              WHERE name = '${ingredient.ingredient}' LIMIT 1;
              `;
          console.log("TEST", ingredientRows);
          const ingredientId = ingredientRows[0].id;

          console.log("BANAN");

          // Insert into drink_ingredient table with quantity and unit
          await client.sql`
              INSERT INTO drink_ingredient (drink_id, ingredient_id, amount, unit)
              VALUES (${drinkId}, ${ingredientId}, ${ingredient.quantity}, ${ingredient.unit});
            `;
        }),
      );
    }),
  );

  return insertedDrinks;
}

export async function GET() {
  // return Response.json({
  //  message:
  //    'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    await client.sql`BEGIN`;
    // await seedUsers();
    // await seedCustomers();
    // await seedInvoices();
    // await seedRevenue();
    // await seedIngredients();
    await seedDrinks();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
