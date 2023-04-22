import React, { useState, useEffect } from 'react';
import { NavBar } from '../NavBar';
import { styled } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
export const Mybots = () => {
  const [bots, setBots] = useState([]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }));

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL_API}/getData`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { data } = await response.json();
    setBots(data);
  };

  return (
    <div>
      <NavBar />
      <h2>Mys bots</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">Id</StyledTableCell>
              <StyledTableCell align="center">Prompt&nbsp;</StyledTableCell>
              <StyledTableCell align="center">TelegramApiKey&nbsp;</StyledTableCell>
              <StyledTableCell align="center">Creation Status&nbsp;</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {bots.map((bot) => (
              <StyledTableRow
                key={bot.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <StyledTableCell component="th" scope="row">
                  {bot.id}
                </StyledTableCell>
                <StyledTableCell align="center">{bot.prompt}</StyledTableCell>
                <StyledTableCell align="center">{bot.telegramApiKey}</StyledTableCell>
                <StyledTableCell align="center">{bot.creation_status}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
