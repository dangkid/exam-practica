import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      const pokemonData = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return details.data;
        })
      );
      setPokemons(pokemonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.id.toString().includes(searchTerm)
  );

  const selectPokemon = async (pokemonName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      setSelectedPokemon(response.data);
    } catch (error) {
      console.error('Error fetching pokemon details:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 PokéAPI - HLC Examen Final</h1>
        <p>Arquitectura Docker en Capas: ubbase → ubsecurity → ubnginx → ubreact</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre o número..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Cargando Pokémon... 🔄</div>
      ) : (
        <>
          <div className="pokemon-grid">
            {filteredPokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="pokemon-card"
                onClick={() => selectPokemon(pokemon.name)}
              >
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <h3>#{pokemon.id}</h3>
                <h2>{pokemon.name}</h2>
                <div className="pokemon-types">
                  {pokemon.types.map((type) => (
                    <span key={type.type.name} className={`type ${type.type.name}`}>
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedPokemon && (
            <div className="modal" onClick={() => setSelectedPokemon(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={() => setSelectedPokemon(null)}>&times;</span>
                <h2>#{selectedPokemon.id} - {selectedPokemon.name}</h2>
                <img
                  src={selectedPokemon.sprites.other['official-artwork'].front_default}
                  alt={selectedPokemon.name}
                  className="modal-image"
                />
                <div className="stats">
                  <h3>Estadísticas:</h3>
                  {selectedPokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="stat">
                      <span className="stat-name">{stat.stat.name}:</span>
                      <div className="stat-bar">
                        <div
                          className="stat-fill"
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        ></div>
                      </div>
                      <span className="stat-value">{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
                <div className="details">
                  <p><strong>Altura:</strong> {selectedPokemon.height / 10} m</p>
                  <p><strong>Peso:</strong> {selectedPokemon.weight / 10} kg</p>
                  <p><strong>Experiencia Base:</strong> {selectedPokemon.base_experience}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <footer className="App-footer">
        <p>Puerto 3000 (React) → Puerto 80 (Nginx) → Base de datos Puerto 5432 (PostgreSQL)</p>
        <p>SSH disponible en puerto 5724</p>
      </footer>
    </div>
  );
}

export default App;
