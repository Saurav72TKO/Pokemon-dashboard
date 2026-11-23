# ⚡ Pokemon Dashboard

Search any Pokemon, save your favourites, delete them anytime.

## ✨ Features
- 🔍 Search Pokemon by name or ID
- 👁️ See image, type, HP, ATK, DEF
- 💾 Save Pokemon to your collection
- 🗑️ Delete Pokemon
- 💻 Auto-saved in Local Storage - stays after refresh

## 🛠️ Tech Used
- HTML, CSS, JavaScript
- PokeAPI - https://pokeapi.co/api/v2/pokemon
- Local Storage

## 🚀 How To Use
1. Open `index.html`
2. Search `pikachu`
3. Click **Save**
4. Click **Delete** to remove

## 💾 Local Storage
Saved Pokemon are stored as:
```js
localStorage.setItem("myPokemons", JSON.stringify(savedPokemons))
