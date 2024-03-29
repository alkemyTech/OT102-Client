import React, { useState, useEffect } from 'react'
import { Container, Box, SimpleGrid } from '@chakra-ui/react'
import { getAllEntries } from '../../services/entriesService'
import NewsHomeCard from '../news/NewsHomeCard'
import Spinner from '../Spinner'

const ListNews = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [allNews, setNews] = useState([])

  useEffect(() => {
    setIsLoading(true)
    getAllEntries()
      .then(({ data }) => {
        setNews(data.body)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        // eslint-disable-next-line no-console
        console.log(error)
      })
  }, [])

  return (
    <Container maxW="container.lg" mt="5">
      <Box p={0}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} alignItems="flex-start">
          {isLoading ? (
            <Spinner />
          ) : (
            allNews
              .map((news) => {
                const {
                  id,
                  image,
                  name,
                  content,
                } = news
                return (
                  <NewsHomeCard
                    id={id}
                    image={image}
                    name={name}
                    content={content}
                    key={news.id}
                  />
                )
              })
              .reverse()
              .slice(0, 4)
          )}
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default ListNews
