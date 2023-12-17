let pokemons = []; // Array zur Speicherung der Pokemon-Daten
let currentIndex = 0;
const cardsPerLoad = 8;

const typeColors = {
  normal: 'linear-gradient(to bottom right, #209aca, #7dc0f6)',
  fire: 'linear-gradient(to bottom right, orange, #ffc478)',
  water: 'linear-gradient(to bottom right, blue, #78c6f6)',
  grass: 'linear-gradient(to bottom right, green, #9bdb9e)',
  electric: 'linear-gradient(to bottom right, #dcca18, #f5e570)',
  ice: 'linear-gradient(to bottom right, lightblue, #9ae3ff)',
  fighting: 'linear-gradient(to bottom right, red, #ff7c7c)',
  poison: 'linear-gradient(to bottom right, purple, #d994e4)',
  ground: 'linear-gradient(to bottom right, brown, #dcbba0)',
  flying: 'linear-gradient(to bottom right, skyblue, #a0d5f5)',
  psychic: 'linear-gradient(to bottom right, pink, #ffb6c8)',
  bug: 'linear-gradient(to bottom right, #25b025, #7ed67e)',
  rock: 'linear-gradient(to bottom right, gray, #a0a0a0)',
  ghost: 'linear-gradient(to bottom right, violet, #cfa1e9)',
  dark: 'linear-gradient(to bottom right, darkgray, #a9a9a9)',
  steel: 'linear-gradient(to bottom right, silver, #c9c9c9)',
  dragon: 'linear-gradient(to bottom right, indigo, #c59eff)',
  fairy: 'linear-gradient(to bottom right, #f295a5, #f7c5d5)',
  // Füge weitere Typen nach Bedarf hinzu
};


async function loadPokemon() {
  showLoadingAnimation(); // Zeige die Ladeanimation an

  for (let index = 1; index <= 40; index++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${index}`;
    let response = await fetch(url);

    if (response.ok) {
      let pokemonData = await response.json();
      pokemons.push(pokemonData);

      // Änderung: Nur für die ersten 8 Pokémon wird die Karte erstellt
      if (index <= 8) {
        createPokemonOverviewCard(index);
      }

      await renderPokemonInfoOverview(index);
      await renderMovesOverview(index);
    } else {
      console.error(
        `Failed to fetch data for URL: ${url}, status: ${response.status}`
      );
    }
  }

  // Verzögere das Ausblenden der Ladeanimation um 4 Sekunden
  setTimeout(function () {
    hideLoadingAnimation();
  }, 1500);
}


document.addEventListener("DOMContentLoaded", function () {
  // Zeige die Ladeanimation an
  showLoadingAnimation();
});

function showLoadingAnimation() {
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingSpinner = document.getElementById("loading-spinner");
    const loadingText = document.getElementById("loading-text");

    loadingOverlay.style.display = "flex"; // oder "block", je nachdem, wie Sie es bevorzugen

    // Zeige den Text "Loading Pokédex..."
    loadingText.textContent = "Loading Pokédex...";

    // Starte die Ladeanimation für 3 Sekunden
    setTimeout(function () {
        hideLoadingAnimation();
    }, 1500);
}

function hideLoadingAnimation() {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "none";
}



async function loadMorePokemon() {
  const startIndex = currentIndex + 1;
  const endIndex = Math.min(startIndex + cardsPerLoad, 41); // Maximal 40 Overview-Cards

  let renderedCards = 0; // Zähler für gerenderte Karten

  for (let index = startIndex; index < endIndex; index++) {
    if (index >= pokemons.length) {
      // Wenn alle vorhandenen Pokemon bereits geladen wurden oder das Limit erreicht ist, breche die Schleife ab
      break;
    }

    // Daten für das neue Pokemon laden
    let url = `https://pokeapi.co/api/v2/pokemon/${index + 1}`;
    let response = await fetch(url);

    if (response.ok) {
      let pokemonData = await response.json();
      pokemons[index] = pokemonData;

      // Erstelle die Overview-Card für das neue Pokemon
      createPokemonOverviewCard(index + (startIndex === 1 ? 8 : 8));

      renderedCards++; // Inkrementiere den Zähler

      // Wenn das neue Pokemon noch nicht in der Overview angezeigt wurde, zeige es an
      if (index >= startIndex) {
        await renderPokemonInfoOverview(index + (startIndex === 1 ? 8 : 8));
        await renderMovesOverview(index + 1);
      }
    } else {
      console.error(
        `Failed to fetch data for URL: ${url}, status: ${response.status}`
      );
    }
  }

  // Aktualisiere den aktuellen Index nach dem Laden der neuen Pokemon
  currentIndex = endIndex - 1;

  // Überprüfe, ob das Limit erreicht wurde und blende den Button aus
  if (renderedCards + currentIndex >= 40) {
    document.getElementById('load-more-button').style.display = 'none'; // Verstecke den Button
    console.log("Maximal 40 Overview-Cards wurden bereits gerendert.");
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
  const capitalizedPokemonName =
    currentPokemon["name"].charAt(0).toUpperCase() +
    currentPokemon["name"].slice(1);
  const typesHTML = generateTypesHTML(currentPokemon["types"], index);

  return `
    <div class="pokemon-info" id="pokemon-info-${index}">
      <div class="pokemon-info-left">
        <h1 id="pokemon-name-${index}">${capitalizedPokemonName}</h1>
        <div id="pokemon-type-${index}">
          ${typesHTML}
        </div>
      </div>
      <div class="pokemon-info-right">
        <button class="close-button" onclick="closePokedex(${index})"><img src="./img/close-button.png" id="close-image"></button>
        <div id="pokedex-number-${index}" class="pokedex-number"><b>#${String(index).padStart(3, '0')}</b></div>
      </div>
    </div>
  `;
}


function generateTypesHTML(types, index) {
  let typesHTML = "";

  // Durchlaufe alle Typen im Array
  for (let i = 0; i < types.length; i++) {
    const type = types[i]["type"]["name"];

    // Erstelle ein neues div-Element für jeden Typ
    const typeDiv = document.createElement("div");
    typeDiv.id = `pokemon-type-${index}-${i}`; // Verwende eine ID mit eindeutigem Index
    typeDiv.className = "pokemon-type";
    typeDiv.textContent = type;

    // Setze die Hintergrundfarbe basierend auf dem Type-Wert
    const backgroundColor = getTypeColor(type);
    typeDiv.style.background = backgroundColor;

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

  // Setze die Hintergrundfarben basierend auf den Pokemon-Typen
  const backgroundColor = getTypeColor(currentPokemon.types[0].type.name);
  const overlayCard = document.getElementById(pokedexId);

  if (overlayCard) {
    overlayCard.style.backgroundColor = backgroundColor;
  }
  

  overlay.innerHTML = `
    <div id="${pokedexId}" class="pokedex" style="display: block; background: ${backgroundColor};">
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
      <img src="./img/left.png" id="left-arrow-image" class="arrow left-arrow" onclick="showPreviousPokedex()">
      <img src="./img/right.png" id="right-arrow-image" class="arrow right-arrow" onclick="showNextPokedex()">
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
  document.getElementById('content').innerHTML += `
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

  setCardBackgroundColor(index);
}

function renderPokemonInfoOverview(index) {
  renderNameAndTypesOverview(index);
  renderImageOverview(index);
}

function renderNameAndTypesOverview(index) {
  const overviewName = document.getElementById(`overview-name-${index}`);
  const overviewTypes = document.getElementById(`overview-types-${index}`);

  // Überprüfen, ob die benötigten Elemente vorhanden sind
  if (!overviewName || !overviewTypes) {
    return;
  }

  const currentPokemon = pokemons[index - 1];
  const pokemonName = currentPokemon.name;

  // Überprüfen, ob das Pokemon-Objekt und der Name vorhanden sind
  if (!currentPokemon || !pokemonName) {
    console.error(`Pokemon data or name not found for index ${index}`);
    return;
  }

  const capitalizedPokemonName =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  overviewName.textContent = capitalizedPokemonName;

  overviewTypes.innerHTML = "";

  for (let i = 0; i < currentPokemon.types.length; i++) {
    const type = currentPokemon.types[i].type.name;

    // Erstelle ein neues div-Element für jeden Typ
    const typeDiv = document.createElement("div");
    typeDiv.className = "overview-types";
    typeDiv.textContent = type;

    // Setze die Hintergrundfarbe basierend auf dem Type-Wert
    const backgroundColor = getTypeColor(type);
    typeDiv.style.background = backgroundColor;

    // Füge das div-Element zum overviewTypes hinzu
    overviewTypes.appendChild(typeDiv);
  }

  // Setze die Hintergrundfarbe basierend auf dem ersten Type-Wert
  const backgroundColor = getTypeColor(currentPokemon.types[0].type.name);
  const overviewCard = document.getElementById(`overview-card-${index}`);
  if (overviewCard) {
    overviewCard.style.backgroundColor = backgroundColor;
  }
}




function renderImageOverview(index) {
  const overviewImage = document.getElementById(`overview-image-${index}`);
  const currentPokemon = pokemons[index - 1];

  // Überprüfen, ob das benötigte Element vorhanden ist
  if (!overviewImage) {
    return;
  }

  // Überprüfen, ob das Pokemon-Objekt vorhanden ist und das Bildfeld nicht null ist
  if (!currentPokemon || !currentPokemon.sprites || !currentPokemon.sprites.other || !currentPokemon.sprites.other['official-artwork'] || !currentPokemon.sprites.other['official-artwork']['front_default']) {
    console.error(`Pokemon data or image URL not found for index ${index}`);
    return;
  }

  overviewImage.src = currentPokemon.sprites.other['official-artwork']['front_default'];
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

function getTypeColor(type) {
  return typeColors[type] || typeColors.default;
}

function setCardBackgroundColor(index) {
  const currentPokemon = pokemons[index - 1];
  const overviewCard = document.getElementById(`overview-card-${index}`);

  if (currentPokemon.types.length > 0) {
    const type = currentPokemon.types[0].type.name; // Verwende den ersten Type-Wert

    const backgroundColor = getTypeColor(type);
    overviewCard.style.background = backgroundColor;
  }
}

