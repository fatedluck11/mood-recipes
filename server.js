const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.json());

// Create SQLite database connection
const db = new sqlite3.Database('recipes.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create recipes table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      mood TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        // Insert sample recipes
        const sampleRecipes = [
          // Happy Mood Recipes
          {
            name: "Energizing Smoothie Bowl",
            ingredients: "Banana, berries, yogurt, granola, honey",
            instructions: "1. Blend fruits\n2. Top with granola and honey",
            mood: "happy"
          },
          {
            name: "Rainbow Fruit Salad",
            ingredients: "Strawberries, oranges, pineapple, kiwi, blueberries, mint leaves",
            instructions: "1. Wash and cut all fruits\n2. Combine in a bowl\n3. Garnish with mint leaves\n4. Chill before serving",
            mood: "happy"
          },
          {
            name: "Chocolate Chip Pancakes",
            ingredients: "Flour, milk, eggs, chocolate chips, butter, maple syrup",
            instructions: "1. Mix pancake batter\n2. Fold in chocolate chips\n3. Cook on griddle\n4. Serve with maple syrup",
            mood: "happy"
          },
          {
            name: "Birthday Cake Cookies",
            ingredients: "Butter, sugar, flour, sprinkles, vanilla extract, white chocolate chips",
            instructions: "1. Cream butter and sugar\n2. Mix in dry ingredients\n3. Fold in sprinkles and chips\n4. Bake until edges are golden\n5. Cool and enjoy the celebration",
            mood: "happy"
          },
          {
            name: "Sunshine Mango Salsa",
            ingredients: "Fresh mangos, red bell pepper, red onion, cilantro, lime juice, jalapeño",
            instructions: "1. Dice mangos and vegetables\n2. Combine all ingredients\n3. Add lime juice and mix\n4. Serve with tortilla chips",
            mood: "happy"
          },
          
          // Sad Mood Recipes
          {
            name: "Comforting Mac and Cheese",
            ingredients: "Macaroni, cheddar cheese, milk, butter, flour, breadcrumbs",
            instructions: "1. Cook macaroni\n2. Make cheese sauce with butter, flour, and milk\n3. Combine pasta and sauce\n4. Top with breadcrumbs and bake",
            mood: "sad"
          },
          {
            name: "Creamy Tomato Soup",
            ingredients: "Tomatoes, cream, butter, onion, garlic, basil, bread for grilled cheese",
            instructions: "1. Sauté onion and garlic\n2. Add tomatoes and simmer\n3. Blend until smooth\n4. Add cream\n5. Serve with grilled cheese",
            mood: "sad"
          },
          {
            name: "Warm Chocolate Pudding",
            ingredients: "Milk, chocolate, sugar, cornstarch, vanilla extract, whipped cream",
            instructions: "1. Heat milk with sugar\n2. Add chocolate and cornstarch\n3. Cook until thickened\n4. Add vanilla\n5. Serve warm with whipped cream",
            mood: "sad"
          },
          {
            name: "Grandma's Chicken Noodle Soup",
            ingredients: "Chicken, carrots, celery, onion, egg noodles, chicken broth, fresh herbs",
            instructions: "1. Cook chicken in broth\n2. Add vegetables and simmer\n3. Cook noodles in soup\n4. Season with herbs\n5. Serve hot with crusty bread",
            mood: "sad"
          },
          {
            name: "Chocolate Chip Cookie Dough Bites",
            ingredients: "Flour (heat-treated), butter, brown sugar, chocolate chips, vanilla, milk",
            instructions: "1. Heat treat flour\n2. Mix butter and sugar\n3. Add remaining ingredients\n4. Form into bite-sized balls\n5. Chill and enjoy",
            mood: "sad"
          },

          // Excited Mood Recipes
          {
            name: "Spicy Chicken Tacos",
            ingredients: "Chicken, tortillas, spices, lime, salsa, avocado, cilantro",
            instructions: "1. Season and cook chicken\n2. Warm tortillas\n3. Prepare toppings\n4. Assemble tacos with all ingredients",
            mood: "excited"
          },
          {
            name: "Colorful Sushi Rolls",
            ingredients: "Sushi rice, nori, cucumber, carrot, avocado, tuna, soy sauce",
            instructions: "1. Cook sushi rice\n2. Prepare vegetables\n3. Roll sushi with fillings\n4. Cut into pieces\n5. Serve with soy sauce",
            mood: "excited"
          },
          {
            name: "Pizza From Scratch",
            ingredients: "Pizza dough, tomato sauce, mozzarella, pepperoni, basil, olive oil",
            instructions: "1. Roll out dough\n2. Spread sauce\n3. Add toppings\n4. Bake until crispy\n5. Finish with fresh basil",
            mood: "excited"
          },
          {
            name: "Rainbow Sushi Burrito",
            ingredients: "Sushi rice, nori, salmon, tuna, avocado, mango, cucumber, spicy mayo",
            instructions: "1. Lay out nori sheet\n2. Spread rice\n3. Layer colorful ingredients\n4. Roll into burrito shape\n5. Slice and serve with spicy mayo",
            mood: "excited"
          },
          {
            name: "Loaded Nachos Supreme",
            ingredients: "Tortilla chips, ground beef, cheese, beans, jalapeños, guacamole, sour cream, tomatoes",
            instructions: "1. Season and cook beef\n2. Layer chips and toppings\n3. Melt cheese\n4. Add cold toppings\n5. Serve immediately while hot",
            mood: "excited"
          },

          // Stressed Mood Recipes
          {
            name: "Calming Chamomile Tea and Honey Toast",
            ingredients: "Bread, honey, butter, chamomile tea bag, hot water",
            instructions: "1. Make chamomile tea\n2. Toast bread\n3. Spread butter and drizzle honey\n4. Enjoy with tea",
            mood: "stressed"
          },
          {
            name: "Lavender Shortbread Cookies",
            ingredients: "Butter, sugar, flour, dried lavender, vanilla extract",
            instructions: "1. Cream butter and sugar\n2. Add flour and lavender\n3. Shape into cookies\n4. Bake until golden\n5. Let cool before enjoying",
            mood: "stressed"
          },
          {
            name: "Green Tea Smoothie",
            ingredients: "Matcha powder, banana, spinach, almond milk, honey, chia seeds",
            instructions: "1. Blend all ingredients until smooth\n2. Add ice if desired\n3. Top with chia seeds\n4. Sip slowly and relax",
            mood: "stressed"
          },
          {
            name: "Calming Golden Milk",
            ingredients: "Milk (dairy or plant-based), turmeric, cinnamon, ginger, honey, black pepper",
            instructions: "1. Warm milk in a pan\n2. Add spices and whisk\n3. Simmer gently for 5 minutes\n4. Strain into a mug\n5. Add honey to taste",
            mood: "stressed"
          },
          {
            name: "Dark Chocolate Covered Strawberries",
            ingredients: "Fresh strawberries, dark chocolate, coconut oil, sea salt",
            instructions: "1. Wash and dry strawberries\n2. Melt chocolate with coconut oil\n3. Dip strawberries\n4. Sprinkle with sea salt\n5. Let set and enjoy mindfully",
            mood: "stressed"
          }
        ];

        // Check if recipes exist
        db.get("SELECT COUNT(*) as count FROM recipes", (err, row) => {
          if (err) {
            console.error('Error checking recipes:', err);
          } else if (row.count === 0) {
            // Insert sample recipes
            const stmt = db.prepare("INSERT INTO recipes (name, ingredients, instructions, mood) VALUES (?, ?, ?, ?)");
            sampleRecipes.forEach(recipe => {
              stmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood);
            });
            stmt.finalize();
            console.log('Sample recipes inserted');
          }
        });
      }
    });
  }
});

// Get random recipe by mood
app.get('/api/recipe/:mood', (req, res) => {
  const mood = req.params.mood;
  db.get(
    "SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1",
    [mood],
    (err, recipe) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!recipe) {
        res.status(404).json({ error: `No recipe found for mood: ${mood}` });
        return;
      }
      res.json(recipe);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 