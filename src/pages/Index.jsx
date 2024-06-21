import React, { useState, useEffect } from 'react';
import { Container, VStack, HStack, Input, Button, Select, Image, Text, Box, Heading } from "@chakra-ui/react";

const TMDB_API_KEY = '82ba43b22d89e96f0cb5239509660905';

const Index = () => {
  let url = '';
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState('movie');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('vidsrc');
  const [selectedResult, setSelectedResult] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  useEffect(() => {
    if (selectedType === 'tv' && selectedTV) {
      fetch(`https://api.themoviedb.org/3/tv/${selectedTV.id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setEpisodes(data.episodes);
        })
        .catch(error => {
          console.error('Error fetching episodes:', error);
        });
    }
  }, [selectedSeason, selectedTV, selectedType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      fetch(`https://api.themoviedb.org/3/search/${selectedType}?api_key=${TMDB_API_KEY}&query=${e.target.value}`)
        .then(response => response.json())
        .then(data => {
          setSearchResults(data.results);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleWatch = () => {
    setPlayerVisible(true);
    if (selectedType === 'movie' && selectedMovie) {
      switch (selectedAPI) {
        case 'vidsrc':
          url = `https://vidsrc.pro/embed/movie/${selectedMovie.id}`;
          break;
        case 'multiembed':
          url = `https://multiembed.mov/?video_id=${selectedMovie.id}&tmdb=1`;
          break;
        case '2embed':
          url = `https://2embed.org/embed/movie/${selectedMovie.id}`;
          break;
        case 'smashystream':
          url = `https://player.smashy.stream/movie/${selectedMovie.id}`;
          break;
        default:
          break;
      }
    } else if (selectedType === 'tv' && selectedTV && selectedSeason && selectedEpisode) {
      switch (selectedAPI) {
        case 'vidsrc':
          url = `https://vidsrc.pro/embed/tv/${selectedTV.id}/${selectedSeason}/${selectedEpisode}`;
          break;
        case 'multiembed':
          url = `https://multiembed.mov/?video_id=${selectedTV.id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`;
          break;
        case '2embed':
          url = `https://2embed.org/embed/tv/${selectedTV.id}/${selectedSeason}/${selectedEpisode}`;
          break;
        case 'smashystream':
          url = `https://player.smashy.stream/tv/${selectedTV.id}?s=${selectedSeason}&e=${selectedEpisode}`;
          break;
        default:
          break;
      }
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
        <HStack spacing={4} width="100%">
          <Button onClick={() => setSelectedAPI('vidsrc')} colorScheme={selectedAPI === 'vidsrc' ? 'blue' : 'gray'}>Vidsrc</Button>
          <Button onClick={() => setSelectedAPI('multiembed')} colorScheme={selectedAPI === 'multiembed' ? 'blue' : 'gray'}>Multiembed</Button>
          <Button onClick={() => setSelectedAPI('2embed')} colorScheme={selectedAPI === '2embed' ? 'blue' : 'gray'}>2embed</Button>
          <Button onClick={() => setSelectedAPI('smashystream')} colorScheme={selectedAPI === 'smashystream' ? 'blue' : 'gray'}>Smashystream</Button>
        </HStack>
        <Input placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        <HStack spacing={4} width="100%" overflowX="auto">
          {searchResults.map(result => (
            <Box
              key={result.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              width="100%"
              onClick={() => {
                selectedType === 'movie' ? setSelectedMovie(result) : setSelectedTV(result);
                setSelectedResult(result.id);
              }}
              _hover={{ bg: 'gray.200', cursor: 'pointer' }}
              bg={selectedResult === result.id ? 'gray.300' : 'white'}
            >
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
        </HStack>
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
        {playerVisible && (
          <Box width="100%" mt={4}>
            <iframe
              src={url}
              width="100%"
              height="500px"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;