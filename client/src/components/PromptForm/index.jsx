/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from '../Header';
import { NavBar } from '../NavBar';

export const PromptForm = ({ showBot }) => {
  const [formValues, setFormValues] = useState({
    botGoal: '',
    telegramApiKey: '',
    whatsappApiKey: '',
    user_content1: '',
    user_content2: '',
    user_content3: '',
    assistant_content1: '',
    assistant_content2: '',
    assistant_content3: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSendButton = async () => {
    try {
      await fetch(`${process.env.REACT_APP_URL_API}/createBot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      });

      toast.success('Your bot has been created!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true
      });
      showBot();
    } catch (e) {
      toast.error('OpenAI no mandó un formato JSON válido', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true
      });
    }
  };

  return (
    <div>
      <NavBar />
      <Header />
      <Box
        id="box"
        sx={{
          width: '100%',
          display: 'flex',
          paddingTop: '5%',
          alignContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
          justifySelf: 'center'
        }}>
        <h1 style={{ maxWidth: '70%', color: 'white' }}>
          Create your own ChatGPT for your business
        </h1>

        <Box
          component="form"
          sx={{
            display: 'flex',
            alignSelf: 'center',
            alignContent: 'center',
            maxWidth: '100%',
            justifyContent: 'center',
            color: 'white',
            '& .MuiTextField-root': { m: 1, width: '70vw', alignSelf: 'center', display: 'flex' }
          }}
          noValidate
          autoComplete="off">
          <div>
            <TextField
              id="outlined-multiline-flexible"
              label="Describe what your AI has to do"
              type="text"
              name="botGoal"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Input your telegram API Key"
              type="text"
              name="telegramApiKey"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Input your Whatsapp API Key"
              type="text"
              name="whatsappApiKey"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Input your Whatsapp ID"
              type="text"
              name="whatsappId"
              onChange={handleChange}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Training user query 1"
              type="text"
              name="user_content1"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Training agent response 1"
              type="text"
              name="assistant_content1"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Training user query 2"
              type="text"
              name="user_content2"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Training agent response 2"
              type="text"
              name="assistant_content2"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Training user query 3"
              type="text"
              name="user_content3"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Training agent response 3"
              type="text"
              name="assistant_content3"
              onChange={handleChange}
              multiline
              maxRows={4}
            />
          </div>
        </Box>

        <Stack spacing={2} direction="row">
          <Button
            id="webcreate"
            variant="contained"
            sx={{ marginTop: '20px' }}
            onClick={() => {
              handleSendButton();
            }}>
            Create
          </Button>
        </Stack>
      </Box>

      <ToastContainer />
    </div>
  );
};
