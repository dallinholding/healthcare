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
        <div>
          <Paper
            style={{ padding: 12, marginTop: 30, width: "110%", maxWidth: 600 }}
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
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Paper
          style={{ padding: 12, marginTop: 30, width: "110%", maxWidth: 500 }}
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
    </div>
  );
}
