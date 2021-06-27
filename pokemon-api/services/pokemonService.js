const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);

db.defaults({ pokemons: [] }).write();

const pokemonCollection = db.get('pokemons');

exports.get = () => {
    const pokemons = pokemonCollection.value();

    return pokemons;
};

exports.getByName = (name) => {
    const pokemon = 
        pokemonCollection
            .filter((_) => _.name.toUpperCase() === name.toUpperCase())
            .value();

    return pokemon;
};

exports.insert = (pokemon) => {
    const { name } = pokemon;

    const isPokemonExist =
        pokemonCollection
            .filter((_) => _.name.toUpperCase() === name.toUpperCase())
            .value()
            .length > 0;

    if (isPokemonExist) {
        return {
            success: false,
            errorMessage: `Pokemon ${name} already exist.`,
        };
    }

    pokemonCollection.push(pokemon).write();

    return {
        success: true
    };
}

exports.delete = (name) => {
    const isPokemonExist =
        pokemonCollection
            .filter((_) => _.name.toUpperCase() === name.toUpperCase())
            .value()
            .length > 0

    if (!isPokemonExist) {
        return {
            success: false,
            errorMessage: `Pokemon ${name} is missing.`,
        };
    }

    pokemonCollection.remove({ name }).write();

    return {
        success: true
    };
};

exports.update = (name, pokemon) => {

    const { type, generation } = pokemon;
    
    if (!type || type.trim().length === 0) {
        return {
            success: false,
            errorMessage: `type property is required`,
        };
    }


    const isPokemonExist =
        pokemonCollection
            .filter((_) => _.name.toUpperCase() === name.toUpperCase())
            .value()
            .length > 0;

    if (!isPokemonExist) {
        return {
            success: false,
            errorMessage: `Pokemon ${name} is missing.`,
        };
    }

    pokemonCollection
        .find((_) => _.name.toUpperCase() === name.toUpperCase())
        .assign(pokemon)
        .write();

    return {
        success: true
    };
};
