function createPokemonOverviewCardTemplate(index) {
  return `
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


function createPokemonInfoSectionTemplate(index, currentPokemon) {
  const capitalizedPokemonName =
    currentPokemon["name"].charAt(0).toUpperCase() +
    currentPokemon["name"].slice(1);
  const typesHTML = generateTypesHTMLTemplate(currentPokemon["types"], index);

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
          <div id="pokedex-number-${index}" class="pokedex-number"><b>#${String(index).padStart(3, "0")}</b></div>
        </div>
      </div>
    `;
}

function generateTypesHTMLTemplate(types, index) {
  let typesHTML = "";

  for (let i = 0; i < types.length; i++) {
    const type = types[i]["type"]["name"];
    const backgroundColor = getTypeColor(type);

    typesHTML += `
        <div id="pokemon-type-${index}-${i}" class="pokemon-type" style="background: ${backgroundColor}">
          ${type}
        </div>`;
  }

  return typesHTML;
}


function createAboutSectionTemplate(index, currentPokemon) {
  return `
      <div class="about-section" id="about-section-${index}">
        <div class="info-container">
          <div class="info-label"><b>Species</b></div>
          <div class="info-value"><b>${capitalizeFirstLetter(currentPokemon["species"]["name"])}</b></div>
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
          <div class="info-value"><b>${generateAbilitiesHTMLTemplate(currentPokemon["abilities"])}</b></div>
        </div>
      </div>
    `;
}


function createBaseStatsSectionTemplate(index, currentPokemon) {
  let statNames = [
    "HP",
    "Attack",
    "Defense",
    "Special Attack",
    "Special Defense",
    "Speed",
  ];

  let baseStatsSectionHTML = `<div class="base-stats-section d-none" id="base-stats-section-${index}">`;

  for (let i = 0; i < statNames.length; i++) {
    const statName = statNames[i];
    const baseStat = currentPokemon["stats"][i]["base_stat"];

    baseStatsSectionHTML += createStatContainerTemplate(statName, baseStat);
  }

  baseStatsSectionHTML += `</div>`;
  return baseStatsSectionHTML;
}


function createStatContainerTemplate(statName, baseStat) {
  return `
      <div class="stat-container">
        <div class="stat-name"><b>${statName}</b></div>
        <div class="stat-value"><b>${baseStat}</b></div>
      </div>`;
}


function createMovesSectionTemplate(index) {
  return `
      <div class="moves-section pokemon-moves d-none" id="pokemon-moves-${index}">
      </div>
    `;
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
          <div id="pokedex-number-${index}" class="pokedex-number"><b>#${String(index).padStart(3, "0")}</b></div>
        </div>
      </div>
    `;
}


function generateTypesHTML(types, index) {
  let typesHTML = "";

  for (let i = 0; i < types.length; i++) {
    const type = types[i]["type"]["name"];
    const backgroundColor = getTypeColor(type);

    typesHTML += `
        <div id="pokemon-type-${index}-${i}" class="pokemon-type" style="background: ${backgroundColor}">
          ${type}
        </div>`;
  }

  return typesHTML;
}


function capitalizeFirstLetter(j) {
  return j.charAt(0).toUpperCase() + j.slice(1);
}


function createAboutSection(index, currentPokemon) {
  const aboutSectionHTML = `
      <div class="about-section" id="about-section-${index}">
        <div class="info-container">
          <div class="info-label"><b>Species</b></div>
          <div class="info-value"><b>${capitalizeFirstLetter(currentPokemon["species"]["name"])}</b></div>
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

  return aboutSectionHTML;
}


function createStatContainer(statName, baseStat) {
  return `
      <div class="stat-container">
        <div class="stat-name"><b>${statName}</b></div>
        <div class="stat-value"><b>${baseStat}</b></div>
      </div>`;
}


function createBaseStatsSection(index, currentPokemon) {
  let statNames = [
    "HP",
    "Attack",
    "Defense",
    "Special Attack",
    "Special Defense",
    "Speed",
  ];
  let baseStatsSectionHTML = `<div class="base-stats-section d-none" id="base-stats-section-${index}">`;

  for (let i = 0; i < statNames.length; i++) {
    const statName = statNames[i];
    const baseStat = currentPokemon["stats"][i]["base_stat"];

    baseStatsSectionHTML += createStatContainer(statName, baseStat);
  }

  baseStatsSectionHTML += `</div>`;
  return baseStatsSectionHTML;
}


function renderMovesSection(movesSection, movesHtml) {
  movesSection.innerHTML = `
      <div class="pokemon-moves-container" id="pokemon-moves-container">
        ${movesHtml}
      </div>
    `;
}


function createPokedexHTML(index, currentPokemon, backgroundColor) {
  const pokedexId = "pokedex-" + index;
  const pokemonInfoSection = createPokemonInfoSection(index, currentPokemon);
  const imageOfPokemonDiv = createImageOfPokemonDiv(index, currentPokemon);
  const headlineDescription = createHeadlineDescription(index);
  const aboutSection = createAboutSection(index, currentPokemon);
  const baseStatsSection = createBaseStatsSection(index, currentPokemon);
  const movesSection = createMovesSection(index);

  return `
      <div id="${pokedexId}" class="pokedex" style="display: block; background: ${backgroundColor};">
        ${pokemonInfoSection}
        ${imageOfPokemonDiv}
        <div class="pokemon-details" id="pokemon-details-${index}">
          ${headlineDescription}
          ${aboutSection}
          ${baseStatsSection}
          ${movesSection}
        </div>
      </div>
      <div class="overlay-arrows">
        <img src="./img/left.png" id="left-arrow-image" class="arrow left-arrow" onclick="showPreviousPokedex()">
        <img src="./img/right.png" id="right-arrow-image" class="arrow right-arrow" onclick="showNextPokedex()">
      </div>
    `;
}


function createImageOfPokemonDiv(index, currentPokemon) {
  return `
      <div class="image-of-pokemon-div">
        <img class="pokemon-image" id="pokemon-image-${index}" src="${currentPokemon[`sprites`][`other`][`official-artwork`][`front_default`]}" alt="Pokemon Image">
      </div>
    `;
}


function createHeadlineDescription(index) {
  return `
      <div class="headline-description">
        <h2 onclick="showAboutSection(${index})" id="about-${index}" class="h2-decoration">About</h2>
        <h2 onclick="showBaseStatsSection(${index})" id="base-stats-${index}">Base Stats</h2>
        <h2 onclick="showMovesSection(${index})" id="moves-${index}">Moves</h2>
      </div>
    `;
}


function createMovesSection(index) {
  return `
      <div class="moves-section pokemon-moves d-none" id="pokemon-moves-${index}">
      </div>
    `;
}


function renderTypesHTML(types, index) {
  let typesHTML = "";

  for (let i = 0; i < types.length; i++) {
    const type = types[i]["type"]["name"];
    const backgroundColor = getTypeColor(type);

    typesHTML += `
        <div id="pokemon-type-${index}-${i}" class="pokemon-type" style="background: ${backgroundColor}">
          ${type}
        </div>`;
  }

  return typesHTML;
}