import { useAuth0 } from '@auth0/auth0-react'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Typography } from '@mui/material'

import AuthButton from './authButton'

const AppBar = ({ message }) => {
  const { user, isAuthenticated } = useAuth0()

  return (
    <Grid2 container spacing={2}>
      <Grid2 item xs={4}>
        <Typography variant='h7' component='h1'>
          Welcome, {isAuthenticated ? user.name : 'User'} 👋
        </Typography>

        <Typography variant='subtitle1' component='h1'>
          {message}
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

export default AppBar
