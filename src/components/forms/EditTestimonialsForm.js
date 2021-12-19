import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Image,
} from '@chakra-ui/react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  addTestimonial,
  getTestimonialById,
  updateTestimonial,
} from '../../services/testimonialsService'
import { TestimonialSchema } from './ValidationSchemas'
import Alert from '../alert/Alert'
import imgUploadService from '../../services/imgUploadService'

const EditTestimonialForm = () => {
  const { id } = useParams
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState()
  const [data, setData] = useState()
  const [testimonialData, setTestimonialData] = useState({
    textButton: 'Crear',
    inputText: 'Imagen',
    id: null,
    name: '',
    image: null,
    content: '',
  })
  const [alertProps, setAlertprops] = useState({
    show: false,
    title: '',
    message: '',
    icon: '',
    onConfirm: () => {},
  })

  const loadData = async () => {
    if (id) {
      try {
        const loadedData = await getTestimonialById(id)
        setTestimonialData({
          textButton: 'Editar',
          inputText: 'Actualizar imagen',
          id: loadedData.data.body.id,
          name: loadedData.data.body.name,
          image: loadedData.data.body.image,
          content: loadedData.data.body.content,
        })
      } catch (error) {
        const errorAlertProps = {
          show: true,
          title: 'Ooops, algo ha fallado!',
          message: error.message,
          icon: 'error',
          onConfirm: () => {},
        }
        setAlertprops(errorAlertProps)
      }
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [])

  const handlerchange = (event, editor) => {
    const dataEdited = editor.getData()
    setData({ ...testimonialData, content: dataEdited })
  }

  const imageUploadChangeHandler = (e) => {
    const fileData = e.target.files[0]
    setSelectedFile(fileData)
  }

  const uploadImage = async () => {
    const uploadedImage = await imgUploadService(selectedFile)
    return uploadedImage
  }

  const handleUpdateSubmit = async (values) => {
    try {
      const updatedTestimonial = await updateTestimonial(id, {
        name: values.name,
        content: data.content,
        image: selectedFile ? await uploadImage() : testimonialData.image,
      })
      if (updatedTestimonial) {
        const successAlertProps = {
          show: true,
          title: 'Novedad actualizada!',
          message: 'Novedad actualizada exitosamente!',
          icon: 'success',
          onConfirm: () => {},
        }
        setAlertprops(successAlertProps)
        navigate('/')
      }
    } catch (error) {
      const errorAlertProps = {
        show: true,
        title: 'Ooops, algo ha fallado!',
        message: error.message,
        icon: 'error',
        onConfirm: () => {},
      }
      setAlertprops(errorAlertProps)
    }
  }

  const handleAddSubmit = async (values) => {
    try {
      const uploadedImage = await imgUploadService(selectedFile)
      if (uploadedImage) {
        const addedTestimonial = await addTestimonial({
          name: values.name,
          content: data.content,
          image: uploadedImage,
        })
        if (addedTestimonial) {
          const successAlertProps = {
            show: true,
            title: 'Novedad agregada!',
            message: 'Novedad agregada exitosamente!',
            icon: 'success',
            onConfirm: () => {},
          }
          setAlertprops(successAlertProps)
          navigate('/')
        }
      }
    } catch (error) {
      const errorAlertProps = {
        show: true,
        title: 'Ooops, algo ha fallado!',
        message: error.message,
        icon: 'error',
        onConfirm: () => {},
      }
      setAlertprops(errorAlertProps)
    }
  }

  return (
    <>
      <Alert {...alertProps} />
      <Formik
        enableReinitialize
        initialValues={{
          name: testimonialData.name,
          content: testimonialData.content,
        }}
        validationSchema={TestimonialSchema}
        onSubmit={(values) => (id ? handleUpdateSubmit(values) : handleAddSubmit(values))}
      >
        {({
          values, errors, touched, handleChange, handleBlur, handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Flex align="center" justify="center" bg="gray.100">
              <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center">
                  <Heading fontSize="4xl" textAlign="center">
                    Novedad
                  </Heading>
                </Stack>
                <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
                  <Stack spacing={4}>
                    <Box>
                      <FormControl id="name">
                        <FormLabel>Titulo</FormLabel>
                        <Input
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />
                        <small>{errors.name && touched.name && errors.name}</small>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl id="content">
                        <FormLabel>Contenido</FormLabel>
                        <CKEditor
                          name="content"
                          editor={ClassicEditor}
                          data={values.content}
                          onChange={handlerchange}
                        />
                        <small>{errors.content && touched.content && errors.content}</small>
                      </FormControl>
                    </Box>
                    {id && (
                    <Box>
                      <FormLabel>Imagen actual</FormLabel>
                      <Image alt="News Image" objectFit="cover" src={testimonialData.image} />
                    </Box>
                    )}
                    <Box>
                      <FormControl id="image">
                        <FormLabel>{testimonialData.inputText}</FormLabel>
                        <input
                          type="file"
                          name="image"
                          id="image"
                          onChange={imageUploadChangeHandler}
                          onBlur={handleBlur}
                          value={values.image}
                        />
                        <small>{errors.image && touched.image && errors.image}</small>
                      </FormControl>
                    </Box>
                    <Stack spacing={10} pt={2}>
                      <Button
                        type="submit"
                        loadingText="Submitting"
                        size="lg"
                        bg="blue.400"
                        color="white"
                        _hover={{
                          bg: 'blue.500',
                        }}
                      >
                        {testimonialData.textButton}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </>
  )
}
export default EditTestimonialForm
