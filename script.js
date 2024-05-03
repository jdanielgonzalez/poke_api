document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("in1");
    const searchButton = document.querySelector(".buttonSearch");
    const cardContainer = document.querySelector(".containerInfo");
    const evolutionButton = document.querySelector(".buttonEvolution");
    const containerEvolution = document.querySelector(".containerEvolution");
    const errorMessage = document.querySelector(".containerError");

    let currentPokemonName = ""; 
    let nextEvolutionName = ""; 
    let evolutionChainUrl = "";
    let numberVolution=0;

    searchButton.addEventListener("click", function() {
        const pokemonName = searchInput.value.toLowerCase();
        searchPokemon(pokemonName);
    });

    function searchPokemon(pokemonName) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontró el Pokémon.");
                }
                return response.json();
            })
            .then(data => {
                getPokemonDescription(data.species.url, data);
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    function getPokemonDescription(speciesUrl, pokemonData) {
        let description ="";
        fetch(speciesUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontró la especie del Pokémon.");
                }
                return response.json();
            })
            .then(speciesData => {
                description = speciesData.flavor_text_entries.find(entry => entry.language.name === "es").flavor_text;
                evolutionChainUrl = speciesData.evolution_chain.url;
                displayPokemonInfo(pokemonData,description);
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    function displayPokemonInfo(pokemonData, description) {
        cardContainer.style.display = "block";
        errorMessage.style.display = "none";

        document.querySelector(".pokemonName").textContent = pokemonData.name;
        document.querySelector(".pokemonImg").src = pokemonData.sprites.front_default;
        document.querySelector(".pokemonType").textContent = pokemonData.types.map(type => type.type.name).join(", ");
        document.querySelector(".pokemonDescription").textContent = description;
        document.querySelector(".pokemonAbilities").textContent = pokemonData.abilities.map(ability => ability.ability.name).join(", ");
        
        evolutionButton.style.display = "block";
        containerEvolution.style.display = "block"; 
        cardContainer.style.display = "block"; 
        currentPokemonName = pokemonData.name; 

    }
    
    evolutionButton.addEventListener("click", function() {
        fetch(evolutionChainUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontró la especie del Pokémon.");
                }
                return response.json();
            })
            .then(evolutionChainData => {
                if(evolutionChainData.chain.evolves_to[0].species.name !== currentPokemonName){
                    searchPokemon(evolutionChainData.chain.evolves_to[0].species.name);
                }
                else{
                    searchPokemon(evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name);
                    hideButtonEvolution();
                }
            })
            .catch(error => {
                displayError(error.message);
            });
        }
    );

    function hideButtonEvolution() {
        evolutionButton.style.display = "none";
        containerEvolution.style.display = "none"; 
    }

    function displayError(message) {
        errorMessage.style.display = "block";
        errorMessage.textContent = message;
        cardContainer.style.display = "none";
        evolutionButton.style.display = "none";
    }
});
