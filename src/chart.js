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
            day: parseInt(doc.data().day),
            exercise: parseInt(doc.data().exercise),
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
          <TableContainer
            component={Paper}
            style={{ padding: 12, marginTop: 30, width: "100%", maxWidth: 500 }}
          >
            <Table className={labels.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Survey Data</TableCell>
                  <TableCell align="right">Sleep</TableCell>
                  <TableCell align="right">Happiness</TableCell>
                  <TableCell align="right">Scriptures</TableCell>
                  <TableCell align="right">Exercise</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveys.map(d => (
                  <TableRow key={d.id}>
                    <TableCell component="th" scope="row">
                      {moment(d.date).format("M/D/YY")}
                    </TableCell>
                    <TableCell align="right">{d.sleep}</TableCell>
                    <TableCell align="right">{d.happiness}</TableCell>
                    <TableCell align="right">{d.exercise}</TableCell>
                    <TableCell align="right">{d.exercise}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
