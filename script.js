document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("in1");
    const searchButton = document.querySelector(".buttonSearch");
    const cardContainer = document.querySelector(".containerInfo");
    const evolutionButton = document.querySelector(".buttonEvolution");
    const containerEvolution = document.querySelector(".containerEvolution");
    const errorMessage = document.querySelector(".containerError");

    let currentPokemonName = ""; // Almacena el nombre del Pokémon actual
    let nextEvolutionName = ""; // Almacena el nombre de la próxima evolución
    let evolutionChainUrl = "";


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
                evolutionChainUrl =speciesData.evolution_chain.url;
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
               

        if (nextEvolutionName !== `https://pokeapi.co/api/v2/pokemon/${pokemonData.name}/`) {
            evolutionButton.style.display = "block"; // Mostrar el botón de evolución
            containerEvolution.style.display = "block"; // Mostrar el botón de evolución
            cardContainer.style.display = "block"; // Mostrar la información del Pokémon
            currentPokemonName = pokemonData.name; // Almacenar el nombre del Pokémon actual
        } else {
            evolutionButton.style.display = "none"; // Ocultar el botón de evolución si no hay evolución disponible
            cardContainer.style.display = "block"; // Mostrar la información del Pokémon
        }

    }

    function displayError(message) {
        errorMessage.style.display = "block";
        errorMessage.textContent = message;
        cardContainer.style.display = "none";
        evolutionButton.style.display = "none";
    }

    evolutionButton.addEventListener("click", function() {
        const evoluciones =[];
        fetch(evolutionChainUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontró la especie del Pokémon.");
                }
                return response.json();
            })
            .then(evolutionChainData => {
                if(evoluciones[0] !== currentPokemonName){
                    searchPokemon(evolutionChainData.chain.species.name);
                }
                evoluciones.push(evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name)

            })
            .catch(error => {
                displayError(error.message);
            });
        }
    );
});
