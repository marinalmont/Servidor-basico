const http = require('http');
const fs = require('fs');

const fetchPokemonData = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./pokedex.json', 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

const handleRequest = async (req, res) => {
    const pokemonData = await fetchPokemonData();
    let pathName = decodeURI(req.url);
    pathName = pathName.substring(1);
    console.log('Identificador de Pokémon:', pathName);

    let pokemon;

    if (!isNaN(pathName)) {
        pokemon = pokemonData.find(p => p.id.toString() === pathName);
    } 
    else {
        pokemon = pokemonData.find(p => 
            Object.values(p.name).some(n => n.toLowerCase() === pathName.toLowerCase())
        );
    }

    if (pokemon) {
        const response = {
            'Tipo': pokemon.type,
            'HP': pokemon.base.HP,
            'Ataque': pokemon.base.Attack,
            'Defensa': pokemon.base.Defense,
            'Ataque Especial': pokemon.base['Sp. Attack'],
            'Defensa Especial': pokemon.base['Sp. Defense'],
            'Velocidad': pokemon.base.Speed
        };
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(JSON.stringify(response, null, 7));
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('El Pokémon no está registrado en la Pokédex.');
    }
};

const server = http.createServer(handleRequest);

server.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});


