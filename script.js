let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/pikachu';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded pokemon', currentPokemon)

    renderPokemonInfo();
}

// JavaScript
function renderPokemonInfo() {
    const pokemonName = currentPokemon['name'];
    const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    document.getElementById('pokemon-name').innerHTML = capitalizedPokemonName;
    document.getElementById('pokemon-image').src = currentPokemon['sprites']['front_default'];

    // Display Types directly from API
    let typesHTML = '';
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        typesHTML += currentPokemon['types'][i]['type']['name'];
        if (i < currentPokemon['types'].length - 1) {
            typesHTML += ', '; // Add a comma if it's not the last type
        }
    }
    document.getElementById('pokemon-type').innerHTML = typesHTML;

    // Display About-section directly from API
    const speciesName = currentPokemon['species']['name'];
    const capitalizedSpeciesName = speciesName.charAt(0).toUpperCase() + speciesName.slice(1);

    document.getElementById('pokemon-species').innerHTML = 'Species: ' + capitalizedSpeciesName;    document.getElementById('pokemon-height').innerHTML = 'Height: ' + currentPokemon['height'] / 10 + ' m';
    document.getElementById('pokemon-weight').innerHTML = 'Weight: ' + currentPokemon['weight'] / 10 + ' kg';

    // Display Abilities directly from API using a for loop
    let abilitiesHTML = 'Abilities: ';
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        abilitiesHTML += currentPokemon['abilities'][i]['ability']['name'];
        if (i < currentPokemon['abilities'].length - 1) {
            abilitiesHTML += ', '; // Add a comma if it's not the last ability
        }
    }
    document.getElementById('pokemon-abilities').innerHTML = abilitiesHTML;

    // Display Base Stats directly from API    // ... (unveränderte Teile)
    
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
        document.getElementById('pokemon-base-stats').innerHTML += baseStatsHTML;

    // Display Moves directly from API using a for loop
    let movesHTML = '<div id="pokemon-moves-container">'; // Änderung: Verwenden Sie ein <div> als Container
    for (let i = 0; i < currentPokemon['moves'].length; i++) {
        movesHTML += '<p>' + currentPokemon['moves'][i]['move']['name'] + '</p>'; // Änderung: Verwenden Sie <p> statt <li>
    }
    movesHTML += '</div>'; // Änderung: Schließen Sie den Container
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

  