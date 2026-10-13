
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Paper
} from '@mui/material';

function App() {
  const [cantidad, setCantidad] = useState('');
  const [tasa, setTasa] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error al consultar la API');
        }
        return respuesta.json();
      })
      .then((datos) => {
        if (
          datos.result !== 'success' ||
          typeof datos.rates?.HNL !== 'number'
        ) {
          throw new Error('Tasa no disponible');
        }

        setTasa(datos.rates.HNL);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, []);

  const total =
    cantidad !== '' && tasa !== null
      ? Number(cantidad) * tasa
      : 0;

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: 1
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Conversor de dólares a lempiras
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Ingresa la cantidad en dólares para convertirla a lempiras.
        </Typography>

        {cargando && <p>Cargando...</p>}

        {error && (
          <p>Error al obtener la tasa de cambio. Recarga la página.</p>
        )}

        {!cargando && !error && tasa !== null && (
          <>
            <Typography sx={{ mb: 2 }}>
              Tasa actual: 1 USD = {tasa.toFixed(2)} HNL
            </Typography>

            <TextField
              label="Cantidad en dólares"
              type="number"
              fullWidth
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              slotProps={{
                htmlInput: { min: 0, step: 'any' }
              }}
            />

            <Typography sx={{ mt: 2 }}>
              Total en lempiras: L {total.toFixed(2)}
            </Typography>
          </>
        )}

        <Typography sx={{ mt: 3 }}>
          <a
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noreferrer"
          >
            Rates By Exchange Rate API
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default App;
