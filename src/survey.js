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
import VerySad from "@material-ui/icons/SentimentVeryDissatisfied";
import Sad from "@material-ui/icons/SentimentDissatisfied";
import Happy from "@material-ui/icons/SentimentSatisfied";
import VeryHappy from "@material-ui/icons/SentimentSatisfiedAlt";
import Morning from "@material-ui/icons/Brightness4";
import Day from "@material-ui/icons/Brightness1";
import Night from "@material-ui/icons/Brightness3";
import { Link, Route } from "react-router-dom";
import { db, functions } from "./firebase";

export default function Survey(props) {
  const [sleep, setSleep] = useState("");
  const [happiness, setHappiness] = useState(0);
  const [day, setDay] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [message, setMessage] = useState(0);

  const handleSave = () => {
    db.collection("users")
      .doc(props.user.uid)
      .collection("surveys")
      .add({
        sleep: sleep,
        happiness: happiness,
        day: day,
        date: new Date()
      })
      .then(() => {
        setSleep("");
        setHappiness(0);
        setDay(0);
        setExercise(0);
      });
  };

  const sendMessage = () => {
    const addMessage = functions.httpsCallable("sendTwilio");
    addMessage({ to: phoneNumber, body: message }).then(function(result) {});
    setPhoneNumber("");
    setMessage("");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper
        style={{ padding: 12, marginTop: 30, width: "100%", maxWidth: 400 }}
      >
        <Typography variant="h5" style={{ padding: 10 }}>
          Survey
        </Typography>
        <Typography style={{ padding: 10, fontSize: "small" }}>
          How Many Hours Did You Sleep Last Night?
        </Typography>
        <TextField
          fullWidth
          value={sleep}
          onChange={e => setSleep(e.target.value)}
        />
        <Typography style={{ padding: 10, fontSize: "small", marginTop: 20 }}>
          How Happy Are You?
        </Typography>
        <div style={{ display: "flex" }}>
          <Radio
            checked={happiness === 1}
            checkedIcon={<VerySad />}
            icon={<VerySad />}
            onChange={() => setHappiness(1)}
          />
          <Radio
            checked={happiness === 2}
            checkedIcon={<Sad />}
            icon={<Sad />}
            onChange={() => setHappiness(2)}
          />
          <Radio
            checked={happiness === 3}
            checkedIcon={<Happy />}
            icon={<Happy />}
            onChange={() => setHappiness(3)}
          />
          <Radio
            checked={happiness === 4}
            checkedIcon={<VeryHappy />}
            icon={<VeryHappy />}
            onChange={() => setHappiness(4)}
          />
        </div>
        <div>
          <Typography style={{ padding: 10, fontSize: "small", marginTop: 20 }}>
            When Will You Read Your Scriptures?
          </Typography>
          <div style={{ display: "flex" }}>
            <Radio
              checked={day === 1}
              checkedIcon={<Morning />}
              icon={<Morning />}
              onChange={() => setDay(1)}
            />
            <Radio
              checked={day === 2}
              checkedIcon={<Day />}
              icon={<Day />}
              onChange={() => setDay(2)}
            />
            <Radio
              checked={day === 3}
              checkedIcon={<Night />}
              icon={<Night />}
              onChange={() => setDay(3)}
            />
          </div>
        </div>

        <div>
          <Typography style={{ padding: 10, fontSize: "small", marginTop: 20 }}>
            When Will You Exercise?
          </Typography>
          <div style={{ display: "flex" }}>
            <Radio
              checked={day === 1}
              checkedIcon={<Morning />}
              icon={<Morning />}
              onChange={() => setExercise(1)}
            />
            <Radio
              checked={day === 2}
              checkedIcon={<Day />}
              icon={<Day />}
              onChange={() => setExercise(2)}
            />
            <Radio
              checked={day === 3}
              checkedIcon={<Night />}
              icon={<Night />}
              onChange={() => setExercise(3)}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          variant="outlined"
          color="primary"
          style={{ marginTop: 15 }}
        >
          Save
        </Button>
      </Paper>
    </div>
  );
}
