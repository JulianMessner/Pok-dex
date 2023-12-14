let currentPokemon;

async function loadPokemon() {
    for (let index = 1; index <= 30; index++) {
      let url = `https://pokeapi.co/api/v2/pokemon/${index}`;
      let response = await fetch(url);
      
      if (response.ok) {
        currentPokemon = await response.json();
        // Create the HTML elements for the overview card
        createPokemonOverviewCard(index);
        createOverlay(index);
        // After the data is loaded, call the rendering functions
        await renderPokemonInfo(index);
        await renderPokemonInfoOverview(index);
      } else {
        console.error(`Failed to fetch data for URL: ${url}, status: ${response.status}`);
      }
    }
  }
  
  

function createPokemonOverviewCard(index) {
  document.body.innerHTML += `
        <div id="overview-card-${index}" class="overview-card grow" onclick="showPokedex(${index})">
            <div class="pokemon-info-overview">
                <div class="overview-left">
                    <div id="overview-name-${index}"></div>
                    <div class="overview-types" id="overview-types-${index}"></div>
                </div>
            </div>
            <div class="pokemon-image-overview">
                <img class="overview-image" id="overview-image-${index}" src="" alt="Pokemon Image">
            </div>
        </div>
    `;
}

function createOverlay(index) {
  document.body.innerHTML += `
  <div class="overlay" id="overlay-${index}">
              <div class="pokedex" id="pokedex-${index}" class="d-none">
                <div class="pokemon-info" id="pokemon-info-${index}">
                    <div class="pokemon-info-left">
                        <h1 id="pokemon-name-${index}">Name</h1>
                        <div class="pokemon-type" id="pokemon-type-${index}"></div>
                    </div>
                    <button class="close-button" id="close-button-${index}" onclick="overlayOff(${index})">X</button>
                </div>
                <div class="image-of-pokemon-div">
                    <img class="pokemon-image" id="pokemon-image-${index}" src="" alt="Pokemon Image">
                </div>
                <div class="pokemon-details" id="pokemon-details-${index}">
                    <div class="headline-description">
                    <h2 onclick="showAboutSection(${index})" id="about-${index}">About</h2>
                    <h2 onclick="showBaseStatsSection(${index})" id="base-stats-${index}">Base Stats</h2>
                    <h2 onclick="showMovesSection(${index})" id="moves-${index}">Moves</h2>                                       
                    </div>
                    <div class="about-section" id="pokemon-basic-info-${index}">
                        <p id="pokemon-species-${index}"></p>
                        <p id="pokemon-height-${index}"></p>
                        <p id="pokemon-weight-${index}"></p>
                        <p id="pokemon-abilities-${index}"></p>
                    </div>
                    <div class="base-stats-section" id="pokemon-base-stats-${index}">
                        <p id="pokemon-hp-${index}"></p>
                        <p id="pokemon-attack-${index}"></p>
                        <p id="pokemon-defense-${index}"></p>
                        <p id="pokemon-sp-atk-${index}"></p>
                        <p id="pokemon-sp-def-${index}"></p>
                        <p id="pokemon-speed-${index}"></p>
                    </div>
                    <div class="moves-section" id="pokemon-moves-${index}">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// JavaScript
// JavaScript
function renderPokemonInfo(index) {
  renderBasicInfo(index);
  renderBaseStats(index);
  renderMoves(index);
}

function renderBasicInfo(index) {
    renderBasicHeader(index);
    renderBasicHeight(index);
    renderBasicWeight(index);
    renderBasicAbilities(index);
  }
  
  function renderBasicHeader(index) {
    const pokemonName = currentPokemon["name"];
    const capitalizedPokemonName =
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    
    // Überprüfen, ob das Element gefunden wurde, bevor auf es zugegriffen wird
    const speciesContainer = document.getElementById(`pokemon-species-${index}`);
    if (speciesContainer) {
      speciesContainer.innerHTML = `<b>${capitalizedPokemonName}</b>`;
    } else {
      console.error(`Element not found for ID ${index}: pokemon-species-${index}`);
    }
  }
  

  
  function renderBasicHeight(index) {
    const heightContainer = document.getElementById(`pokemon-height-${index}`);
    heightContainer.innerHTML = `<b>${currentPokemon["height"] / 10} m</b>`;
  }
  
  function renderBasicWeight(index) {
    const weightContainer = document.getElementById(`pokemon-weight-${index}`);
    weightContainer.innerHTML = `<b>${currentPokemon["weight"] / 10} kg</b>`;
  }
  
  function renderBasicAbilities(index) {
    const abilitiesContainer = document.getElementById(`pokemon-abilities-${index}`);
    let abilitiesHTML = '<div class="info-item"><div class="info-label"><b>Abilities</b></div><div class="info-value"><b>';
  
    for (let i = 0; i < currentPokemon["abilities"].length; i++) {
      abilitiesHTML += currentPokemon["abilities"][i]["ability"]["name"];
      if (i < currentPokemon["abilities"].length - 1) {
        abilitiesHTML += ", ";
      }
    }
  
    abilitiesHTML += "</b></div></div>";
    abilitiesContainer.innerHTML = abilitiesHTML;
  }
  

function renderBaseStats(index) {
  // Display Base Stats directly from API
  let baseStatsHTML = "";
  const statNames = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];

  for (let i = 0; i < currentPokemon["stats"].length; i++) {
    const statValue = currentPokemon["stats"][i]["base_stat"];

    // Fügen Sie das div mit dem Stat-Namen und dem Wert zum HTML-String hinzu
    baseStatsHTML += `
            <div class="stat-container">
                <div class="stat-name"><b>${statNames[i]}</b></div>
                <div class="stat-value"><b>${statValue}</b></div>
            </div>
        `;
  }

  // Fügen Sie den HTML-String zum Container hinzu
  document.getElementById(`pokemon-base-stats-${index}`).innerHTML =
    baseStatsHTML;
}

function renderMoves(index) {
  // Display Moves directly from API using a for loop
  let movesHTML = '<div class="pokemon-moves-container" id="pokemon-moves-container">';
  for (let i = 0; i < currentPokemon["moves"].length; i++) {
    movesHTML +=
      "<p><b>" + currentPokemon["moves"][i]["move"]["name"] + "</b></p>";
  }
  movesHTML += "</div>";
  document.getElementById(`pokemon-moves-${index}`).innerHTML = movesHTML;
}

function setActiveSection(sectionId, headerId, index) {
    const aboutSection = document.getElementById(`pokemon-basic-info-${index}`);
    const statsSection = document.getElementById(`pokemon-base-stats-${index}`);
    const movesSection = document.getElementById(`pokemon-moves-${index}`);

    // Zeige die ausgewählte Sektion
    const selectedSection = document.getElementById(sectionId);

    if (aboutSection) {
        aboutSection.classList.toggle("d-none", sectionId !== `about-section-${index}`);
        aboutSection.classList.toggle("active", sectionId === `about-section-${index}`);
    }

    if (statsSection) {
        statsSection.classList.toggle("d-none", sectionId !== `base-stats-section-${index}`);
        statsSection.classList.toggle("active", sectionId === `base-stats-section-${index}`);
    }

    if (movesSection) {
        movesSection.classList.toggle("d-none", sectionId !== `moves-section-${index}`);
        movesSection.classList.toggle("active", sectionId === `moves-section-${index}`);
    }

    // Unterstreiche das angeklickte h2-Element
    underlineClickedHeader(headerId);
}

function underlineClickedHeader(headerId) {
  // Alle h2-Elemente
  const allHeaders = document.querySelectorAll("h2");
  allHeaders.forEach((header) => {
    header.classList.remove("text-decoration-underline");
  });

  // Das angeklickte h2-Element unterstreichen
  const clickedHeader = document.getElementById(headerId);
  clickedHeader.classList.add("text-decoration-underline");
}

function renderPokemonInfoOverview(index) {
  renderNameAndTypesOverview(index);
  renderImageOverview(index);
}

function showAboutSection(index) {
    setActiveSection(`about-section-${index}`, `about-${index}`, index);
}

function showBaseStatsSection(index) {
    setActiveSection(`base-stats-section-${index}`, `base-stats-${index}`, index);
}

function showMovesSection(index) {
    setActiveSection(`moves-section-${index}`, `moves-${index}`, index);
}


function renderNameAndTypesOverview(index) {
    const overviewName = document.getElementById(`overview-name-${index}`);
    const overviewTypes = document.getElementById(`overview-types-${index}`);
  
    const pokemonName = currentPokemon["name"];
    const capitalizedPokemonName =
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let typesHTML = "";
    for (let i = 0; i < currentPokemon["types"].length; i++) {
      typesHTML += currentPokemon["types"][i]["type"]["name"];
      if (i < currentPokemon["types"].length - 1) {
        typesHTML += ", ";
      }
    }
  
    overviewName.textContent = capitalizedPokemonName;
    overviewTypes.textContent = typesHTML;
  }

function renderImageOverview(index) {
  const overviewImage = document.getElementById(`overview-image-${index}`);
  overviewImage.src = currentPokemon["sprites"]["front_default"];
}

function showPokedex(index) {
    const pokedex = document.getElementById(`pokedex-${index}`);
  
    pokedex.classList.remove("d-none");
    overlayOn();
}

function overlayOn() {
    document.querySelector(".overlay").style.display = "flex";
}

function overlayOff(index) {
    const pokedex = document.getElementById(`pokedex-${index}`);
    pokedex.classList.add("d-none");
    document.querySelector(".overlay").style.display = "none";
}