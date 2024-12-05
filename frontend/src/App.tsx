import { Container } from '@mui/material';

import Home from './containers/Home/Home';
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <SnackbarProvider
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      maxSnack={1}
    >
      <Container sx={{ p: 2 }}>
        <Home />
      </Container>
    </SnackbarProvider>
  );
};

export default App;
