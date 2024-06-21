import React, { useState, useEffect } from 'react';
import { Container, VStack, HStack, Input, Button, Select, Image, Text, Box, Heading } from "@chakra-ui/react";
import axios from 'axios';

const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your TMDB API key

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState('movie');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState('');

  useEffect(() => {
    if (selectedType === 'tv' && selectedTV) {
      axios.get(`https://api.themoviedb.org/3/tv/${selectedTV.id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}`)
        .then(response => {
          setEpisodes(response.data.episodes);
        })
        .catch(error => {
          console.error('Error fetching episodes:', error);
        });
    }
  }, [selectedSeason, selectedTV, selectedType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      axios.get(`https://api.themoviedb.org/3/search/${selectedType}?api_key=${TMDB_API_KEY}&query=${e.target.value}`)
        .then(response => {
          setSearchResults(response.data.results);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleWatch = () => {
    if (selectedType === 'movie' && selectedMovie) {
      window.open(`https://vidsrc.me/embed/${selectedMovie.id}`, '_blank');
    } else if (selectedType === 'tv' && selectedTV && selectedSeason && selectedEpisode) {
      window.open(`https://vidsrc.me/embed/${selectedTV.id}/${selectedSeason}/${selectedEpisode}`, '_blank');
    }
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Movie Streaming Website</Heading>
        <HStack spacing={4} width="100%">
          <Button onClick={() => setSelectedType('movie')} colorScheme={selectedType === 'movie' ? 'blue' : 'gray'}>Movie</Button>
          <Button onClick={() => setSelectedType('tv')} colorScheme={selectedType === 'tv' ? 'blue' : 'gray'}>TV</Button>
        </HStack>
        <Input placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        <VStack spacing={4} width="100%">
          {searchResults.map(result => (
            <Box key={result.id} p={4} borderWidth="1px" borderRadius="lg" width="100%" onClick={() => selectedType === 'movie' ? setSelectedMovie(result) : setSelectedTV(result)}>
              <HStack spacing={4}>
                <Image boxSize="100px" src={`https://image.tmdb.org/t/p/w200${result.poster_path}`} alt={result.title || result.name} />
                <VStack align="start">
                  <Text fontWeight="bold">{result.title || result.name}</Text>
                  <Text>{result.release_date || result.first_air_date}</Text>
                  <Text>{result.overview}</Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
        {selectedType === 'tv' && selectedTV && (
          <VStack spacing={4} width="100%">
            <Select placeholder="Select Season" onChange={(e) => setSelectedSeason(e.target.value)}>
              {selectedTV.seasons.map(season => (
                <option key={season.season_number} value={season.season_number}>{season.name}</option>
              ))}
            </Select>
            {selectedSeason && (
              <Select placeholder="Select Episode" onChange={(e) => setSelectedEpisode(e.target.value)}>
                {episodes.map(episode => (
                  <option key={episode.episode_number} value={episode.episode_number}>{episode.name}</option>
                ))}
              </Select>
            )}
          </VStack>
        )}
        <Button colorScheme="teal" onClick={handleWatch}>Watch</Button>
      </VStack>
    </Container>
  );
};

export default Index;