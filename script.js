let pokemons = [];
let currentIndex = 0;
const cardsPerLoad = 8;
const typeColors = {
  normal: "linear-gradient(to bottom right, #209aca, #7dc0f6)",
  fire: "linear-gradient(to bottom right, orange, #ffc478)",
  water: "linear-gradient(to bottom right, blue, #78c6f6)",
  grass: "linear-gradient(to bottom right, green, #9bdb9e)",
  electric: "linear-gradient(to bottom right, #dcca18, #f5e570)",
  ice: "linear-gradient(to bottom right, lightblue, #9ae3ff)",
  fighting: "linear-gradient(to bottom right, red, #ff7c7c)",
  poison: "linear-gradient(to bottom right, purple, #d994e4)",
  ground: "linear-gradient(to bottom right, brown, #dcbba0)",
  flying: "linear-gradient(to bottom right, skyblue, #a0d5f5)",
  psychic: "linear-gradient(to bottom right, pink, #ffb6c8)",
  bug: "linear-gradient(to bottom right, #25b025, #7ed67e)",
  rock: "linear-gradient(to bottom right, gray, #a0a0a0)",
  ghost: "linear-gradient(to bottom right, violet, #cfa1e9)",
  dark: "linear-gradient(to bottom right, darkgray, #a9a9a9)",
  steel: "linear-gradient(to bottom right, silver, #c9c9c9)",
  dragon: "linear-gradient(to bottom right, indigo, #c59eff)",
  fairy: "linear-gradient(to bottom right, #f295a5, #f7c5d5)",
};


async function loadPokemon() {
  showLoadingAnimation();
  await fetchPokemonData();
  await renderInitialPokemonCards();
  setTimeout(function () {
    hideLoadingAnimation();
  }, 1500);
}


async function fetchPokemonData() {
  for (let index = 1; index <= 40; index++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${index}`;
    let response = await fetch(url);

    if (response.ok) {
      let pokemonData = await response.json();
      pokemons.push(pokemonData);
    }
  }
}


async function renderInitialPokemonCards() {
  for (let index = 1; index <= 8; index++) {
    createPokemonOverviewCard(index);
    renderPokemonInfoOverview(index);
    renderMovesOverview(index);
  }
}


function showLoadingAnimation() {
  const loadingOverlay = document.getElementById("loading-overlay");
  const loadingSpinner = document.getElementById("loading-spinner");
  const loadingText = document.getElementById("loading-text");

  loadingOverlay.style.display = "flex";
  loadingText.innerHTML = "Loading Pokédex...";
}


function hideLoadingAnimation() {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "none";
}


async function loadMorePokemon() {
  const startIndex = currentIndex + 1;
  const endIndex = Math.min(startIndex + cardsPerLoad, 41);
  const renderedCards = await fetchAndRenderPokemon(startIndex, endIndex);

  updateCurrentIndex(endIndex);
  checkAndHideLoadMoreButton(renderedCards);
}


async function fetchAndRenderPokemon(startIndex, endIndex) {
  let renderedCards = 0;

  for (let index = startIndex; index < endIndex; index++) {
    await fetchAndRenderSinglePokemon(index, startIndex);
    renderedCards++;
  }

  return renderedCards;
}


async function fetchAndRenderSinglePokemon(index, startIndex) {
  let url = `https://pokeapi.co/api/v2/pokemon/${index + 1}`;
  let response = await fetch(url);

  if (response.ok) {
    let pokemonData = await response.json();
    pokemons[index] = pokemonData;

    createPokemonOverviewCard(index + (startIndex === 1 ? 8 : 8));

    if (index >= startIndex) {
      await renderPokemonInfoOverview(index + (startIndex === 1 ? 8 : 8));
      await renderMovesOverview(index + 1);
    }
  }
}


function updateCurrentIndex(endIndex) {
  currentIndex = endIndex - 1;
}


function checkAndHideLoadMoreButton(renderedCards) {
  if (renderedCards + currentIndex >= 40) {
    document.getElementById("load-more-button").style.display = "none";
  }
}


async function renderMovesOverview(index) {
  const movesSection = document.getElementById(`pokemon-moves-${index}`);
  const currentPokemon = pokemons[index - 1];

  if (movesSection) {
    const moveDataArray = await fetchMoveDataArray(currentPokemon.moves);
    const movesHtml = generateMovesHtml(moveDataArray);

    renderMovesSection(movesSection, movesHtml);
  }
}


async function fetchMoveDataArray(moves) {
  const moveDataArray = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const moveUrl = move.move.url;

    try {
      const response = await fetch(moveUrl);

      if (response.ok) {
        const moveData = await response.json();
        moveDataArray.push(moveData);
      }
    } catch (error) {
      console.error(`Error fetching move data for URL: ${moveUrl}`, error);
    }
  }

  return moveDataArray;
}


function generateMovesHtml(moveDataArray) {
  let movesHtml = "";

  for (let i = 0; i < moveDataArray.length; i++) {
    const moveData = moveDataArray[i];
    movesHtml += `<p><b>${moveData.name}</b></p>`;
  }

  return movesHtml;
}


function showPokedex(index) {
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = "";

  const currentPokemon = pokemons[index - 1];
  const backgroundColor = getTypeColor(currentPokemon.types[0].type.name);
  const pokedexHTML = createPokedexHTML(index, currentPokemon, backgroundColor);

  overlay.innerHTML = pokedexHTML;

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
  document.getElementById("content").innerHTML +=
  createPokemonOverviewCardTemplate(index);
  setCardBackgroundColor(index);
}


function renderPokemonInfoOverview(index) {
  renderNameAndTypesOverview(index);
  renderImageOverview(index);
}


function renderName(index) {
  const overviewName = document.getElementById(`overview-name-${index}`);
  const currentPokemon = pokemons[index - 1];
  const pokemonName = currentPokemon.name;
  const capitalizedPokemonName =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  overviewName.innerHTML = capitalizedPokemonName;
}


function renderTypes(index) {
  const overviewTypes = document.getElementById(`overview-types-${index}`);
  const currentPokemon = pokemons[index - 1];

  overviewTypes.innerHTML = renderTypesHTML(currentPokemon.types, index);
}


function setBackgroundColor(index) {
  const currentPokemon = pokemons[index - 1];
  const backgroundColor = getTypeColor(currentPokemon.types[0].type.name);
  const overviewCard = document.getElementById(`overview-card-${index}`);

  overviewCard.style.backgroundColor = backgroundColor;
}


function renderNameAndTypesOverview(index) {
  renderName(index);
  renderTypes(index);
  setBackgroundColor(index);
}


function renderImageOverview(index) {
  const overviewImage = document.getElementById(`overview-image-${index}`);
  const currentPokemon = pokemons[index - 1];

  overviewImage.src = currentPokemon.sprites.other["official-artwork"]["front_default"];
}


function underlineClickedHeader(headerId) {
  const allHeaders = document.querySelectorAll("h2");
  const clickedHeader = document.getElementById(headerId);

  for (let i = 0; i < allHeaders.length; i++) {
    allHeaders[i].classList.remove("h2-decoration");
  }

  clickedHeader.classList.add("h2-decoration");
}


function toggleSection(sectionId, index, headerId) {
  const section = document.getElementById(sectionId);
  const allSections = document.querySelectorAll( ".about-section, .base-stats-section, .pokemon-moves");

  for (let i = 0; i < allSections.length; i++) {
      const s = allSections[i];
      s.classList.remove("active");
      s.classList.add("d-none");
  }

  section.classList.remove("d-none");
  section.classList.add("active");

  underlineClickedHeader(headerId);
}


function showAboutSection(index) {
  toggleSection(`about-section-${index}`, index, `about-${index}`);
}


function showBaseStatsSection(index) {
  toggleSection(`base-stats-section-${index}`, index, `base-stats-${index}`);
}


function showMovesSection(index) {
  toggleSection(`pokemon-moves-${index}`, index, `moves-${index}`);
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
    const type = currentPokemon.types[0].type.name;
    const backgroundColor = getTypeColor(type);

    overviewCard.style.background = backgroundColor;
  }
}