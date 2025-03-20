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
          {
            name: "Comforting Mac and Cheese",
            ingredients: "Macaroni, cheese, milk, butter, flour",
            instructions: "1. Cook macaroni\n2. Make cheese sauce\n3. Combine and bake",
            mood: "sad"
          },
          {
            name: "Energizing Smoothie Bowl",
            ingredients: "Banana, berries, yogurt, granola, honey",
            instructions: "1. Blend fruits\n2. Top with granola and honey",
            mood: "happy"
          },
          {
            name: "Spicy Chicken Tacos",
            ingredients: "Chicken, tortillas, spices, lime, salsa",
            instructions: "1. Cook spiced chicken\n2. Warm tortillas\n3. Assemble tacos",
            mood: "excited"
          },
          {
            name: "Calming Chamomile Tea and Honey Toast",
            ingredients: "Bread, honey, butter, chamomile tea bag, hot water",
            instructions: "1. Make chamomile tea\n2. Toast bread\n3. Spread butter and drizzle honey\n4. Enjoy with tea",
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