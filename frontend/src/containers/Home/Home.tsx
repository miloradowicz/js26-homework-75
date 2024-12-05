import { ChangeEventHandler, useCallback, useState } from 'react';

import api from '../../api';

import { Stack, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { DecodedMessage, EncodedMessage } from '../../types';
import { useSnackbar } from 'notistack';

interface Data {
  decoded: string;
  encoded: string;
  password: string;
}

const initialData: Data = { decoded: '', encoded: '', password: '' };

const Home = () => {
  const [data, setData] = useState(initialData);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState<'none' | 'encoding' | 'decoding'>(
    'none'
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = useCallback((e) => {
    if (e.target.name === 'password') {
      setPasswordError('');
    }

    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  }, []);

  const encodeMessage = useCallback(
    async (password: string, message: string) => {
      const res = await api.post<EncodedMessage>('encode', {
        password,
        message,
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      return res.data.encoded;
    },
    []
  );

  const decodeMessage = useCallback(
    async (password: string, message: string) => {
      const res = await api.post<DecodedMessage>('decode', {
        password,
        message,
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      return res.data.decoded;
    },
    []
  );

  const handleEncode = async () => {
    try {
      setLoading('encoding');
      setData((data) => ({ ...data, encoded: '' }));

      if (data.password === '') {
        setPasswordError('Password cannot be empty.');
        return;
      }

      const encoded = await encodeMessage(data.password, data.decoded);

      setData((data) => ({ ...data, encoded, decoded: '' }));
    } catch (err) {
      if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } else {
        console.error(err);
      }
    } finally {
      setLoading('none');
    }
  };

  const handleDecode = async () => {
    try {
      setLoading('decoding');
      setData((data) => ({ ...data, decoded: '' }));

      if (data.password === '') {
        setPasswordError('Password cannot be empty.');
        return;
      }

      const decoded = await decodeMessage(data.password, data.encoded);

      setData((data) => ({ ...data, decoded, encoded: '' }));
    } catch (err) {
      if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } else {
        console.error(err);
      }
    } finally {
      setLoading('none');
    }
  };

  return (
    <Stack gap={1}>
      <TextField
        label='Decoded message'
        multiline
        minRows={4}
        maxRows={4}
        name='decoded'
        value={data.decoded}
        onChange={handleChange}
      />
      <Stack direction='row' gap={1} alignItems='start'>
        <TextField
          label='Password'
          name='password'
          sx={{ flex: 'auto' }}
          size='small'
          required
          error={passwordError !== ''}
          helperText={passwordError}
          value={data.password}
          onChange={handleChange}
        />
        <LoadingButton
          loading={loading === 'encoding'}
          disabled={loading === 'decoding'}
          aria-label='Encode'
          onClick={handleEncode}
        >
          <ArrowDownward />
        </LoadingButton>
        <LoadingButton
          loading={loading === 'decoding'}
          disabled={loading === 'encoding'}
          aria-label='Decode'
          onClick={handleDecode}
        >
          <ArrowUpward />
        </LoadingButton>
      </Stack>
      <TextField
        label='Encoded message'
        multiline
        minRows={4}
        maxRows={4}
        name='encoded'
        value={data.encoded}
        onChange={handleChange}
      />
    </Stack>
  );
};

export default Home;
