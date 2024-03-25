
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const pokeName = document.getElementById('pokemon-name');
const pokeId = document.getElementById('pokemon-id');
const pokeWeight= document.getElementById('weight');
const pokeHeight = document.getElementById('height');
const pokeTypes = document.getElementById('types');
const pokeHp = document.getElementById('hp');
const pokeAttack = document.getElementById('attack');
const pokeDefense = document.getElementById('defense');
const specialAttack = document.getElementById('special-attack');
const specialDefense = document.getElementById('special-defense');
const pokeSpeed = document.getElementById('speed');

const spriteContainer = document.getElementById('sprite-container');
let valueFromUser;
let pokemonSearch;

const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        if (res.status === 404) {
            alert('Pokémon not found');
            return;
        }
        const data = await res.json();
        
        fetchStats(data);

    }catch(err){
        alert('Pokémon not found.');

    }

};

const fetchStats = (data) => {


     if (!data || !data.id || !data.name) {
        alert("Pokémon not found");
        return;
    }
   
    const selectedPokemon = {
        name: data.name,
        id: data.id,
        weight: data.weight,
        height: data.height,
        types: data.types.map(t => t.type.name.toUpperCase()).join(', '),
        stats: {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialAttack: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat
        },
        sprite: data.sprites.front_default
    };

    pokeTypes.innerHTML = '';
    spriteContainer.innerHTML = '';
    const spriteImg = document.createElement('img');
    spriteImg.id = 'sprite';
    spriteImg.src = selectedPokemon.sprite;
    spriteImg.alt = `${selectedPokemon.name} default sprite`;
    spriteContainer.appendChild(spriteImg);
    pokeName.innerText = selectedPokemon.name ? selectedPokemon.name : alert("Pokémon not found");
    pokeId.innerText = `#${selectedPokemon.id}`;
    pokeWeight.innerText = `Weight:${selectedPokemon.weight}`;
    pokeHeight.innerText = `Height:${selectedPokemon.height}`;
    data.types.forEach(typeInfo => {
        const typeElement = document.createElement('span'); 
        typeElement.textContent = typeInfo.type.name.toUpperCase(); 
        pokeTypes.appendChild(typeElement);
    });
    pokeHp.innerText = `${selectedPokemon.stats.hp}`;
    pokeAttack.innerText = `${selectedPokemon.stats.attack}`;
    pokeDefense.innerText = `${selectedPokemon.stats.defense}`;
    specialAttack.innerText = `${selectedPokemon.stats.specialAttack}`;
    specialDefense.innerText = `${selectedPokemon.stats.specialDefense}`;
    pokeSpeed.innerText = `${selectedPokemon.stats.speed}`;
};




searchBtn.addEventListener('click', (event) => {
    event.preventDefault()
    console.log('Input:', searchInput.value)
    let valueFromUser = searchInput.value.trim().toLowerCase();;
    const pokemonSearch = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${valueFromUser}`


    console.log( valueFromUser, pokemonSearch)

    fetchData(pokemonSearch);

})

