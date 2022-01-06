import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

import {
  Text,
  Center,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Button
} from '@chakra-ui/react'

import { SunIcon, LockIcon, EmailIcon, MoonIcon, ViewIcon } from '@chakra-ui/icons'

const Signup = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(true)
  
  const formik = useFormik({
    initialValues: {
      username: "bobby",
      password: "bobbybobby",
      passwordConfirmation: "",
      email: "bobby@bobby.bobby",
      age: "2"
    },
    onSubmit: values => {  
      // on va créer notre utilisateur dans le backend    
      const newValues = {
        ...values,
        photo: formik.values.photo.name
      }
      console.log("e", newValues)
      fetch('http://localhost:5000/auth/signup', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newValues)
      })
        .then(response => response.json())
        .then(user => {
          if (user.error) {
            alert(user.error)
          } else {
            // si tout va bien, on récupère les infos de l'utilisateur
            // qu'on vient de créer. On va donc pouvoir utiliser son username
            // et son password pour se connecter
            fetch('http://localhost:5000/auth/login', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                username: user.username,
                password: user.password
              })
            })
              .then(response => response.json())
              .then(data => {
                const formdata = new FormData()
                formdata.append("photo", file, file.name)
            
                fetch(`http://localhost:5000/user/${data.id}/file`, {
                  method: "post",
                  body: formdata
                })
                  .then(response => response.json())
                  .then(data => {
                    console.log(data)
                  })
                navigate('/admin')
              })
          }
        })
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password is too short"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      email: Yup.string()
        .required("Email is required")
        .email("Email invalid"),
      age: Yup.string()
        .required("Age is required")
    })
  })

  const togglePasswordVisible = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleFileChange = (e) => {
    formik.setFieldValue('photo', e.target.files[0])
  }

  console.log(formik.values);
  return (
    <Grid templateColumns='repeat(2, 1fr)' h='100vh'>
      <GridItem>
        <Center h='100%' paddingLeft='50px' paddingRight='50px'>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isInvalid={formik.errors.username}>
              <FormLabel htmlFor='username'>Username</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<SunIcon color='gray.300' />}
                />
                <Input
                  type='text'
                  name='username'
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl mt={5} isInvalid={formik.errors.password}>
              <FormLabel htmlFor='password'>
                Password
                <ViewIcon
                  color='gray.300'
                  onClick={togglePasswordVisible}
                />
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<LockIcon color='gray.300' />}
                />
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl mt={5} isInvalid={formik.errors.passwordConfirmation}>
              <FormLabel htmlFor='passwordConfirmation'>Password confirmation</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<LockIcon color='gray.300' />}
                />
                <Input
                  type='password'
                  name='passwordConfirmation'
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{formik.errors.passwordConfirmation}</FormErrorMessage>
            </FormControl>

            <FormControl mt={5} isInvalid={formik.errors.email}>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<EmailIcon color='gray.300' />}
                />
                <Input
                  type='text'
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl mt={5} isInvalid={formik.errors.age}>
              <FormLabel htmlFor='age'>Age</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<MoonIcon color='gray.300' />}
                />
                <Input
                  type='number'
                  name='age'
                  value={formik.values.age}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{formik.errors.age}</FormErrorMessage>
            </FormControl>

            <FormControl mt={5} >
              <FormLabel htmlFor='photo'>Photo</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<MoonIcon color='gray.300' />}
                />
                <Input
                  type='file'
                  name='photo'
                  // value={formik.values.photo}
                  onChange={handleFileChange}
                />
              </InputGroup>
            </FormControl>

            <Button mt={5} w='100%' type='submit' color='white' bg='salmon'>Button</Button>
          </form>
        </Center>
      </GridItem>
      <GridItem bg="gray.800">
        <Center h='100%'>
          <Text color="white" as="h1" fontWeight={800} fontSize={'54px'}>Signup</Text>
        </Center>
      </GridItem>
    </Grid>
  )
}

export default Signup