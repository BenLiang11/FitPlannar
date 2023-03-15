import { Add, Search } from '@mui/icons-material'
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
  Card,
  CardContent,
  Fab,
} from '@mui/material'
import dayjs from 'dayjs'

import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import Grid2 from '@mui/material/Unstable_Grid2'
import BarChart from './bar'
import AuthButton from '../authButton'
import { useEffect, useState } from 'react'

const AppBar = () => {
  const { user, isAuthenticated } = useAuth0()

  return (
    <Grid2 container spacing={2}>
      <Grid2 item xs={4}>
        <Typography variant='h7' component='h1'>
          Welcome, {isAuthenticated ? user.name : 'User'} 👋
        </Typography>

        <Typography variant='subtitle1' component='h1'>
          Here is your fitness history.
        </Typography>
      </Grid2>

      <Grid2
        item
        xs={8}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <AuthButton />
      </Grid2>
    </Grid2>
  )
}

const HomePage = () => {
  const navigate = useNavigate()
  const { user, getAccessTokenSilently, isAuthenticated } =
    useAuth0()

  const [userWorkouts, setUserWorkouts] = useState([])
  const [parsedWorkout, setParsedWorkout] = useState({})

  const fetchWorkouts = async () => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(
      `http://localhost:8000/api/get-workouts?user=${encodeURIComponent(
        user.sub
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const data = await response.json()
    setUserWorkouts(data)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkouts()
    }
  }, [isAuthenticated])

  const parseWorkout = (workouts) => {
    const today = dayjs()

    const labels = new Array(7).fill(0).map((_, i) => {
      return today.subtract(i, 'day').format('ddd')
    })

    const data = labels.map((_, i) => {
      const date = today
        .subtract(i, 'day')
        .format('YYYY-MM-DD')

      const filteredWorkouts = workouts.filter(
        (workout) => {
          return (
            dayjs(workout['start_time'] * 1000).format(
              'YYYY-MM-DD'
            ) === date
          )
        }
      )
      for (let workout of workouts) {
        console.log(workout['start_time'])
      }

      console.log('workouts', workouts)
      console.log('filteredWorkouts', filteredWorkouts)
      return filteredWorkouts.length
    })

    console.log(data)

    setParsedWorkout({
      labels: labels.reverse(),
      data: data.reverse(),
    })
  }

  useEffect(() => {
    if (userWorkouts.length > 0) {
      parseWorkout(userWorkouts)
    }
  }, [userWorkouts])

  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        bgcolor: 'paper.main',
        p: 5,
        ml: 2,
      }}>
      <AppBar />
      <Box sx={{ maxWidth: 600 }}>
        {userWorkouts.length !== 0 && (
          <BarChart input={parsedWorkout} />
        )}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}>
        <Fab
          color='primary'
          onClick={() => navigate('/new-workout')}>
          <Add />
        </Fab>
      </Box>
    </Box>
  )
}

export default HomePage
