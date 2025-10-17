import express from 'express';
import axios from 'axios';
import germanPokemonNames from '../../data/pkmn_german.json';

const router = express.Router();

const validateId = (id: string): boolean => {
  const idNumber = parseInt(id);
  return !isNaN(idNumber) && idNumber > 0;
};

const validateName = (name: string): boolean => {
  return typeof name === 'string' && name.length > 0;
};

const getNumberFromName = (name: string) => {
  const pokemon = germanPokemonNames.find(
    (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
  );

  console.log(`Searching for Pokémon: ${name}`);
  return pokemon ? pokemon.number : null;
};

type NamesData = {
  language: {
    name: string;
  };
  name: string;
};

router.get('/', async (req, res) => {
  console.log('Received request for translation');
  const { id, name, lang } = req.query;
  let pokemonId: number | null = parseInt(id as string);

  if (!lang) {
    return res.status(400).json({ error: 'Missing parameters or "lang"' });
  }

  if (typeof lang !== 'string' || lang.length !== 2) {
    return res.status(400).json({ error: 'Invalid language code' });
  }

  if (lang === 'en') {
    // Translate from German to English
    if (!name) {
      return res.status(400).json({ error: 'Missing "name" parameter' });
    }

    if (!validateName(name.toString())) {
      return res.status(400).json({ error: 'Invalid Pokémon name' });
    }

    pokemonId = getNumberFromName(name.toString());

    console.log(`Fetching data for Pokémon: ${pokemonId}`);

    if (!pokemonId) {
      return res.status(400).json({ error: 'Pokémon (de) not found' });
    }
  } else if (lang === 'de' && !pokemonId && name) {
    // Translate from English to German using name
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${name.toString()}`
      );
      pokemonId = response.data.pokedex_numbers[0].entry_number;
    } catch (error) {
      return res.status(400).json({ error: 'Pokémon not found' });
    }
  }

  if (pokemonId === null || !validateId(pokemonId.toString())) {
    return res.status(400).json({ error: 'Invalid Pokémon ID' });
  }

  try {
    console.log(`Fetching data for Pokémon ID: ${pokemonId}`);
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId.toString()}`
    );

    const imageResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId.toString()}/`
    );

    const names = response.data.names;
    const translation = names.find((n: NamesData) => n.language.name === lang);

    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    return res.json({
      translated: translation.name,
      image: imageResponse.data.sprites.front_default,
    });
  } catch (error) {
    return res.status(404).json({ error: 'Pokémon not found' });
  }
});

export default router;
