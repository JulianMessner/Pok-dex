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
    document.getElementById('pokemon-name').innerHTML = currentPokemon['name'];
    document.getElementById('pokemon-image').src = currentPokemon['sprites']['front_default'];

    // Display About-section directly from API
    document.getElementById('pokemon-species').innerHTML = 'Species: ' + currentPokemon['species']['name'];
    document.getElementById('pokemon-height').innerHTML = 'Height: ' + currentPokemon['height'] / 10 + ' m';
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

    // Display Base Stats directly from API
    document.getElementById('pokemon-hp').innerHTML = 'HP: ' + currentPokemon['stats'][0]['base_stat'];
    document.getElementById('pokemon-attack').innerHTML = 'Attack: ' + currentPokemon['stats'][1]['base_stat'];
    document.getElementById('pokemon-defense').innerHTML = 'Defense: ' + currentPokemon['stats'][2]['base_stat'];
    document.getElementById('pokemon-sp-atk').innerHTML = 'Sp. Atk: ' + currentPokemon['stats'][3]['base_stat'];
    document.getElementById('pokemon-sp-def').innerHTML = 'Sp. Def: ' + currentPokemon['stats'][4]['base_stat'];
    document.getElementById('pokemon-speed').innerHTML = 'Speed: ' + currentPokemon['stats'][5]['base_stat'];

    // Display Moves directly from API using a for loop
    let movesHTML = 'Moves: <ul>';
    for (let i = 0; i < currentPokemon['moves'].length; i++) {
        movesHTML += '<li>' + currentPokemon['moves'][i]['move']['name'] + '</li>';
    }
    movesHTML += '</ul>';
    document.getElementById('pokemon-moves').innerHTML = movesHTML;
}



