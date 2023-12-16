let pokemons = []; // Array zur Speicherung der Pokemon-Daten
let currentIndex = 0;

async function loadPokemon() {
  for (let index = 1; index <= 40; index++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${index}`;
    let response = await fetch(url);

    if (response.ok) {
      let pokemonData = await response.json();
      pokemons.push(pokemonData); // Speichern Sie jedes Pokemon im Array
      createPokemonOverviewCard(index);
      await renderPokemonInfoOverview(index);
      await renderMovesOverview(index); // Neu hinzugefügte Zeile
    } else {
      console.error(
        `Failed to fetch data for URL: ${url}, status: ${response.status}`
      );
    }
  }


}

async function renderMovesOverview(index) {
  const movesSection = document.getElementById(`pokemon-moves-${index}`);
  const currentPokemon = pokemons[index - 1];

  // Überprüfe, ob das Element vorhanden ist
  if (movesSection) {
    // Erstelle das Container-Div
    const movesContainer = document.createElement("div");
    movesContainer.className = "pokemon-moves-container";
    movesContainer.id = "pokemon-moves-container";

    // Durchlaufe alle Moves des aktuellen Pokémons
    for (let i = 0; i < currentPokemon.moves.length; i++) {
      const move = currentPokemon.moves[i];
      const moveUrl = move.move.url;

      try {
        const response = await fetch(moveUrl);

        if (response.ok) {
          const moveData = await response.json();

          // Baue den HTML-String für jeden Move
          const moveHtml = `<p><b>${moveData.name}</b></p>`;

          // Füge den HTML-String zum Container-Div hinzu
          movesContainer.innerHTML += moveHtml;
        } else {
          console.error(`Failed to fetch move data for URL: ${moveUrl}`);
        }
      } catch (error) {
        console.error(`Error fetching move data for URL: ${moveUrl}`, error);
      }
    }

    // Setze den HTML-Inhalt des Container-Divs in movesSection
    movesSection.innerHTML = movesContainer.outerHTML;
  }
}



function createPokemonInfoSection(index, currentPokemon) {
  const capitalizedPokemonName = currentPokemon["name"].charAt(0).toUpperCase() + currentPokemon["name"].slice(1);
  const typesHTML = generateTypesHTML(currentPokemon["types"]);
  
  return `
    <div class="pokemon-info" id="pokemon-info-${index}">
      <div class="pokemon-info-left">
        <h1 id="pokemon-name-${index}">${capitalizedPokemonName}</h1>
        <div id="pokemon-type-${index}">${typesHTML}</div>
      </div>
      <button class="close-button" onclick="closePokedex(${index})">X</button>
    </div>
  `;
}

function generateTypesHTML(types) {
  let typesHTML = "";

  // Durchlaufe alle Typen im Array
  for (let i = 0; i < types.length; i++) {
    const type = types[i]["type"]["name"];

    // Erstelle ein neues div-Element für jeden Typ
    const typeDiv = document.createElement("div");
    typeDiv.className = "pokemon-type";
    typeDiv.textContent = type;

    // Füge das div-Element dem typesHTML-String hinzu
    typesHTML += typeDiv.outerHTML;
  }

  return typesHTML;
}


function createAboutSection(index, currentPokemon) {
  return `
    <div class="about-section" id="about-section-${index}">
      <div class="info-container">
        <div class="info-label"><b>Species</b></div>
        <div class="info-value"><b>${currentPokemon["species"]["name"].charAt(0).toUpperCase() + currentPokemon["species"]["name"].slice(1)}</b></div>
        </div>
      <div class="info-container">
        <div class="info-label"><b>Height</b></div>
        <div class="info-value"><b>${currentPokemon["height"]}</b></div>
      </div>
      <div class="info-container">
        <div class="info-label"><b>Weight</b></div>
        <div class="info-value"><b>${currentPokemon["weight"]}</b></div>
      </div>
      <div class="info-container">
        <div class="info-label"><b>Abilities</b></div>
        <div class="info-value"><b>${generateAbilitiesHTML(currentPokemon["abilities"])}</b></div>
      </div>
    </div>
  `;
}



function createBaseStatsSection(index, currentPokemon) {
  return `
    <div class="base-stats-section d-none" id="base-stats-section-${index}">
      <div class="stat-container">
        <div class="stat-name"><b>HP</b></div>
        <div class="stat-value"><b>${currentPokemon["stats"][0]["base_stat"]}</b></div>
      </div>
      <div class="stat-container">
        <div class="stat-name"><b>Attack</b></div>
        <div class="stat-value"><b>${currentPokemon["stats"][1]["base_stat"]}</b></div>
      </div>
      <div class="stat-container">
        <div class="stat-name"><b>Defense</b></div>
        <div class="stat-value"><b>${currentPokemon["stats"][2]["base_stat"]}</b></div>
      </div>
      <div class="stat-container">
        <div class="stat-name"><b>Special Attack</b></div>
        <div class="stat-value"><b>${currentPokemon["stats"][3]["base_stat"]}</b></div>
      </div>
      <div class="stat-container">
        <div class="stat-name"><b>Special Defense</b></div>
        <div class="stat-value"><b>${currentPokemon["stats"][4]["base_stat"]}</b></div>
      </div>
      <div class="stat-container">
        <div class="stat-name"><b>Speed</b></div>
        <div class="stat-value"><b>${currentPokemon["stats"][5]["base_stat"]}</b></div>
      </div>
    </div>
  `;
}




function showPokedex(index) {
    const overlayId = "overlay";
    const pokedexId = "pokedex-" + index;
  
    const overlay = document.getElementById(overlayId);
    overlay.innerHTML = ""; // Clear previous content

  const currentPokemon = pokemons[index - 1];

  const pokemonInfoSection = createPokemonInfoSection(index, currentPokemon);
  const aboutSection = createAboutSection(index, currentPokemon);
  const baseStatsSection = createBaseStatsSection(index, currentPokemon);

  overlay.innerHTML = `
    <div id="${pokedexId}" class="pokedex" style="display: block;">
      ${pokemonInfoSection}
      <div class="image-of-pokemon-div">
        <img class="pokemon-image" id="pokemon-image-${index}" src="${currentPokemon[`sprites`][`other`][`official-artwork`][`front_default`]}" alt="Pokemon Image">
      </div>
      <div class="pokemon-details" id="pokemon-details-${index}">
        <div class="headline-description">
          <h2 onclick="showAboutSection(${index})" id="about-${index}" class="h2-decoration">About</h2>
          <h2 onclick="showBaseStatsSection(${index})" id="base-stats-${index}">Base Stats</h2>
          <h2 onclick="showMovesSection(${index})" id="moves-${index}">Moves</h2>
        </div>
        ${aboutSection}
        ${baseStatsSection}
        <div class="moves-section pokemon-moves d-none" id="pokemon-moves-${index}">
        </div>
      </div>
    </div>
    <div class="overlay-arrows">
    <button class="arrow left-arrow" onclick="showPreviousPokedex()"><</button>
    <button class="arrow right-arrow" onclick="showNextPokedex()">></button>
</div>

  `;

  currentIndex = index - 1;

  overlay.style.display = "block";
  renderMovesOverview(index);
}


function generateAbilitiesHTML(abilities) {
  let abilitiesHTML = "";

  for (let i = 0; i < abilities.length; i++) {
    const ability = abilities[i]["ability"]["name"];
    abilitiesHTML += ability;

    if (i < abilities.length - 1) {
      abilitiesHTML += ", ";
    }
  }

  return abilitiesHTML;
}

function closePokedex(index) {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("pokedex-" + index).style.display = "none";
}

function createPokemonOverviewCard(index) {
  document.body.innerHTML += `
      <div id="overview-card-${index}" class="overview-card grow" onclick="showPokedex(${index})">
          <div class="pokemon-info-overview">
              <div class="overview-left">
                  <div class="overview-name" id="overview-name-${index}"></div>
                  <div class="overview-type-div" id="overview-types-${index}"></div>
              </div>
          </div>
          <div class="pokemon-image-overview">
              <img class="overview-image" id="overview-image-${index}" src="" alt="Pokemon Image">
          </div>
      </div>
  `;
}

function renderPokemonInfoOverview(index) {
  renderNameAndTypesOverview(index);
  renderImageOverview(index);
}

function renderNameAndTypesOverview(index) {
  const overviewName = document.getElementById(`overview-name-${index}`);
  const overviewTypes = document.getElementById(`overview-types-${index}`);

  const currentPokemon = pokemons[index - 1]; // Direkter Zugriff auf die Pokemon-Daten
  const pokemonName = currentPokemon["name"];
  const capitalizedPokemonName =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  overviewName.textContent = capitalizedPokemonName;

  // Lösche vorherige Inhalte im overviewTypes-Element
  overviewTypes.innerHTML = "";

  // Durchlaufe alle Typen des aktuellen Pokémons
  for (let i = 0; i < currentPokemon["types"].length; i++) {
    const type = currentPokemon["types"][i]["type"]["name"];

    // Erstelle ein neues div-Element für jeden Typ
    const typeDiv = document.createElement("div");
    typeDiv.className = "overview-types";
    typeDiv.textContent = type;

    // Füge das div-Element dem overviewTypes-Element hinzu
    overviewTypes.appendChild(typeDiv);
  }
}



function renderImageOverview(index) {
  const overviewImage = document.getElementById(`overview-image-${index}`);
  const currentPokemon = pokemons[index - 1]; // Direkter Zugriff auf die Pokemon-Daten
  overviewImage.src = currentPokemon[`sprites`][`other`][`official-artwork`][`front_default`];
}


function underlineClickedHeader(headerId) {
  // Alle h2-Elemente
  const allHeaders = document.querySelectorAll("h2");
  allHeaders.forEach((header) => {
    header.classList.remove("h2-decoration");
  });

  // Das angeklickte h2-Element unterstreichen
  const clickedHeader = document.getElementById(headerId);
  clickedHeader.classList.add("h2-decoration");
}

function showAboutSection(index) {
  const aboutSection = document.getElementById(`about-section-${index}`);
  const baseStatsSection = document.getElementById(`base-stats-section-${index}`);
  const movesSection = document.getElementById(`pokemon-moves-${index}`);

  // Klassen hinzufügen/entfernen
  aboutSection.classList.remove("d-none");
  aboutSection.classList.add("active");
  baseStatsSection.classList.add("d-none");
  baseStatsSection.classList.remove("active");
  movesSection.classList.add("d-none");
  movesSection.classList.remove("active");

  // Header unterstreichen
  underlineClickedHeader(`about-${index}`);
}

function showBaseStatsSection(index) {
  const aboutSection = document.getElementById(`about-section-${index}`);
  const baseStatsSection = document.getElementById(`base-stats-section-${index}`);
  const movesSection = document.getElementById(`pokemon-moves-${index}`);

  // Klassen hinzufügen/entfernen
  aboutSection.classList.add("d-none");
  aboutSection.classList.remove("active");
  baseStatsSection.classList.remove("d-none");
  baseStatsSection.classList.add("active");
  movesSection.classList.add("d-none");
  movesSection.classList.remove("active");

  // Header unterstreichen
  underlineClickedHeader(`base-stats-${index}`);
}

function showMovesSection(index) {
  const aboutSection = document.getElementById(`about-section-${index}`);
  const baseStatsSection = document.getElementById(`base-stats-section-${index}`);
  const movesSection = document.getElementById(`pokemon-moves-${index}`);

  // Klassen hinzufügen/entfernen
  aboutSection.classList.add("d-none");
  aboutSection.classList.remove("active");
  baseStatsSection.classList.add("d-none");
  baseStatsSection.classList.remove("active");
  movesSection.classList.remove("d-none");
  movesSection.classList.add("active");

  // Header unterstreichen
  underlineClickedHeader(`moves-${index}`);
}

function showPreviousPokedex() {
  currentIndex = (currentIndex - 1 + pokemons.length) % pokemons.length;
  showPokedex(currentIndex + 1);
}

function showNextPokedex() {
  currentIndex = (currentIndex + 1) % pokemons.length;
  showPokedex(currentIndex + 1);
}
