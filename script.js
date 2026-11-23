// ---------- 1. State: one array is the source of truth ----------
let pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

// ---------- 2. Grab elements ----------
const addInput = document.getElementById("addInput");
const addBtn = document.getElementById("addBtn");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const typeSelect = document.getElementById("typeSelect");
const sortSelect = document.getElementById("sortSelect");
const cards = document.getElementById("cards");
const counter = document.getElementById("counter");

// ---------- 3. Add: fetch from PokeAPI ----------
async function addPokemon() {
  const query = addInput.value.trim().toLowerCase();
  if (!query) return showMessage("Type a name or ID first.", true);

  addBtn.disabled = true;
  showMessage("Loading…");

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!res.ok) throw new Error("not found");
    const data = await res.json();

    if (pokemons.some(p => p.id === data.id)) {
      return showMessage(`${data.name} is already in your dashboard.`, true);
    }

    // Keep only what we need
    pokemons.push({
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
    });

    save();
    addInput.value = "";
    showMessage(`Added ${data.name}!`);
    render();
  } catch (err) {
    showMessage("Pokémon not found. Check the name or ID.", true);
  } finally {
    addBtn.disabled = false;
  }
}

// ---------- 4. Delete ----------
function deletePokemon(id) {
  pokemons = pokemons.filter(p => p.id !== id);
  save();
  render();
}

// ---------- 5. Render: filter + sort a COPY, then draw ----------
function render() {
  const search = searchInput.value.trim().toLowerCase();
  const type = typeSelect.value;
  const sort = sortSelect.value;

  let list = pokemons.filter(p =>
    p.name.includes(search) && (type === "all" || p.types.includes(type))
  );

  if (sort === "id") list.sort((a, b) => a.id - b.id);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  counter.textContent = `${pokemons.length} Pokémon`;
  updateTypeOptions();

  if (list.length === 0) {
    cards.innerHTML = `<p class="empty">${
      pokemons.length === 0 ? "No Pokémon yet. Add one by name or ID." : "No matches."
    }</p>`;
    return;
  }

  cards.innerHTML = list.map(p => `
    <article class="card">
      <span class="id">#${String(p.id).padStart(3, "0")}</span>
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      ${p.types.map(t => `<span class="badge t-${t}">${t}</span>`).join("")}
      <p class="stats">HP ${p.hp} · ATK ${p.attack} · DEF ${p.defense}</p>
      <button class="btn danger" data-id="${p.id}">Delete</button>
    </article>
  `).join("");
}

// Build the type dropdown from the types you actually have
function updateTypeOptions() {
  const current = typeSelect.value;
  const types = [...new Set(pokemons.flatMap(p => p.types))].sort();
  typeSelect.innerHTML =
    `<option value="all">All types</option>` +
    types.map(t => `<option value="${t}">${t}</option>`).join("");
  typeSelect.value = types.includes(current) ? current : "all";
}

// ---------- 6. Helpers ----------
function save() {
  localStorage.setItem("pokemons", JSON.stringify(pokemons));
}
function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

// ---------- 7. Events ----------
addBtn.addEventListener("click", addPokemon);
addInput.addEventListener("keydown", e => { if (e.key === "Enter") addPokemon(); });
searchInput.addEventListener("input", render);
typeSelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);
// One listener for all Delete buttons (event delegation)
cards.addEventListener("click", e => {
  const btn = e.target.closest("[data-id]");
  if (btn) deletePokemon(Number(btn.dataset.id));
});

render();
