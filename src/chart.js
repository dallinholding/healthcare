import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Radio
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { db } from "./firebase";
import chart from "./chart";
import { Line, Pie, Bar } from "react-chartjs-2";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function Chart(props) {
  const [surveys, setSurveys] = useState([]);
  const [labels, setLables] = useState([]);
  const [dataSets, setDataSets] = useState([]);

  useEffect(() => {
    const unsub = db
      .collection("users")
      .doc(props.user.uid)
      .collection("surveys")
      .onSnapshot(snapshot => {
        const surveys = snapshot.docs.map(doc => {
          const survey = {
            //sleep: doc.data().sleep,
            sleep: parseInt(doc.data().sleep),
            happiness: doc.data().happiness,
            day: doc.data().day,
            exercise: doc.data().exercise,
            date: new Date(doc.data().date.seconds * 1000),
            id: doc.id
          };
          return survey;
        });

        const sorted = surveys.sort((a, b) => {
          if (a.date > b.date) {
            return 1;
          } else {
            return -1;
          }
        });

        setSurveys(surveys);
      });
  }, []);

  useEffect(() => {
    const lbls = surveys.map(survey => {
      return moment(survey.date).format("M/D/YY");
    });
    setLables(lbls);
    const sets = [];

    const sleep = {
      label: "Hours of Sleep",
      data: surveys.map(s => s.sleep),
      borderColor: "red",
      borderWidth: 1
    };
    sets.push(sleep);

    const happiness = {
      label: "Happiness",
      data: surveys.map(s => s.happiness),
      borderColor: "blue",
      borderWidth: 1
    };
    sets.push(happiness);

    const day = {
      label: "Scripture Time",
      data: surveys.map(s => s.day),
      borderColor: "green",
      borderWidth: 1
    };
    sets.push(day);

    const exercise = {
      label: "Exercise Time",
      data: surveys.map(s => s.exercise),
      borderColor: "yellow",
      borderWidth: 1
    };
    sets.push(exercise);

    setDataSets(sets);
  }, [surveys]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Paper
          style={{ padding: 12, marginTop: 30, width: "100%", maxWidth: 500 }}
        >
          <Typography variant="h5" style={{ padding: 10 }}>
            Chart
          </Typography>
          <Line
            data={{
              labels: labels,
              datasets: dataSets
            }}
          />
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Paper
          style={{ padding: 12, marginTop: 30, width: "100%", maxWidth: 500 }}
        >
          <Typography variant="h5" style={{ padding: 10 }}>
            Data
          </Typography>
          <Bar
            data={{
              labels: labels,
              datasets: dataSets
            }}
          />
        </Paper>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      ); }
    </div>
  );
}
