let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/pikachu';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded pokemon', currentPokemon)

    renderPokemonInfo();
}

// JavaScript
// JavaScript
function renderPokemonInfo() {
    renderBasicInfo();
    renderBaseStats();
    renderMoves();
}

function renderBasicInfo() {
    const pokemonName = currentPokemon['name'];
    const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let typesHTML = '';
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        typesHTML += currentPokemon['types'][i]['type']['name'];
        if (i < currentPokemon['types'].length - 1) {
            typesHTML += ', '; // Add a comma if it's not the last type
        }
    }
    document.getElementById('pokemon-type').innerHTML = typesHTML;
    document.getElementById('pokemon-name').innerHTML = capitalizedPokemonName;
    document.getElementById('pokemon-image').src = currentPokemon['sprites']['front_default'];

    // Display Basic Info directly from API
    const basicInfoContainer = document.getElementById('pokemon-basic-info');

    // Erstelle den HTML-String für die Art, Höhe und Gewicht
    let basicInfoHTML = `
        <div class="info-item">
            <div class="info-label">Species</div>
            <div class="info-value">${capitalizedPokemonName}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Height</div>
            <div class="info-value">${currentPokemon['height'] / 10} m</div>
        </div>
        <div class="info-item">
            <div class="info-label">Weight</div>
            <div class="info-value">${currentPokemon['weight'] / 10} kg</div>
        </div>
    `;

    // Füge Abilities hinzu
    basicInfoHTML += '<div class="info-item"><div class="info-label">Abilities</div><div class="info-value">';

    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        basicInfoHTML += currentPokemon['abilities'][i]['ability']['name'];
        if (i < currentPokemon['abilities'].length - 1) {
            basicInfoHTML += ', ';
        }
    }

    basicInfoHTML += '</div></div>';

    // Setze den HTML-String als inneres HTML des Containers
    basicInfoContainer.innerHTML = basicInfoHTML;
}

function renderBaseStats() {
    // Display Base Stats directly from API
    let baseStatsHTML = '';
    const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        const statValue = currentPokemon['stats'][i]['base_stat'];

        // Fügen Sie das div mit dem Stat-Namen und dem Wert zum HTML-String hinzu
        baseStatsHTML += `
            <div class="stat-container">
                <div class="stat-name">${statNames[i]}</div>
                <div class="stat-value">${statValue}</div>
            </div>
        `;
    }

    // Fügen Sie den HTML-String zum Container hinzu
    document.getElementById('pokemon-base-stats').innerHTML = baseStatsHTML;
}

function renderMoves() {
    // Display Moves directly from API using a for loop
    let movesHTML = '<div id="pokemon-moves-container">';
    for (let i = 0; i < currentPokemon['moves'].length; i++) {
        movesHTML += '<p>' + currentPokemon['moves'][i]['move']['name'] + '</p>';
    }
    movesHTML += '</div>';
    document.getElementById('pokemon-moves').innerHTML = movesHTML;
}


function setActiveSection(sectionId, headerId) {
    // Alle Abschnitte verbergen
    const allSections = document.querySelectorAll('.about-section, .base-stats-section, .moves-section');
    allSections.forEach(section => {
        section.classList.add('d-none');
        section.classList.remove('active');
    });

    // Den gewünschten Abschnitt anzeigen
    const selectedSection = document.querySelector(`.${sectionId}`);
    selectedSection.classList.remove('d-none');
    selectedSection.classList.add('active');

    // Unterstreiche das angeklickte h2-Element
    underlineClickedHeader(headerId);
}


function underlineClickedHeader(headerId) {
    // Alle h2-Elemente
    const allHeaders = document.querySelectorAll('h2');
    allHeaders.forEach(header => {
        header.classList.remove('text-decoration-underline');
    });

    // Das angeklickte h2-Element unterstreichen
    const clickedHeader = document.getElementById(headerId);
    clickedHeader.classList.add('text-decoration-underline');
}

  