import { useDispatch, useSelector } from 'react-redux'
import { selectUserData, setUserData } from '../app/slices/auth'
import { userLogin, registerUser } from '../services/authService'

export default function useUser() {
  const userData = useSelector(selectUserData)
  const jwt = window.localStorage.getItem('x-access-token')
  const dispatch = useDispatch()

  const newUser = (user) =>
    registerUser(user).then(({ data }) => {
      const { body } = data
      dispatch(setUserData(body.user))
      window.localStorage.setItem('x-access-token', body.token)
    })

  const loginUser = (user) =>
    userLogin(user).then(({ data }) => {
      const { body } = data
      dispatch(setUserData(body.user))
      window.localStorage.setItem('x-access-token', body.token)
    })

  return {
    loginUser,
    newUser,
    isLogged: Boolean(jwt),
    userData,
  }
}
