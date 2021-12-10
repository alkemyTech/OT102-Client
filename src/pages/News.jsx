import React, { useState, useEffect } from 'react';
import {
  Container,
  Text,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { getAllEntries } from '../services/entriesService'
import NewsHomeCard from '../components/news/NewsHomeCard';

const ListNews = () => {
  const [newss, setNews] = useState([])

  useEffect(() => {
    getAllEntries().then((entries) => {
      setNews(entries.data.body)
      // console.log(entries.data.body)
    })
  }, [])

  return (
    <Container maxW="container.lg" mt="5">
      <Text textStyle="title">Novedades</Text>
      <Box p={0}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>

          {
          newss.map((news) =>
            <NewsHomeCard {...news} key={news.id} />).reverse()
          }
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default ListNews;