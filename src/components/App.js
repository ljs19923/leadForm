import React, { useState, useEffect } from "react";

import Question from "./Question";
import Footer from "./Footer";
import Header from "./Header";
import LoadingBar from "react-top-loading-bar";
import { isMobile } from "react-device-detect";

import Parse from "parse/dist/parse.min.js";

import "../styles/App.scss";
import france from "../assets/images/france.png";
import axios from "axios";

var Scroll = require("react-scroll");
const scroll = Scroll.animateScroll;
var scroller = Scroll.scroller;

var Element = Scroll.Element;

const LeadForm = Parse.Object.extend("LeadForm");

var classNames = require("classnames");

Parse.initialize(
  "jFZq055XFUqrtvY8D06lLELQQRqRA7lqMzKOWOBq",
  "WLHNU8nHwg5sqU2ah5S3p3YQaqU4KDCAAlQORRWO"
);

Parse.serverURL =
  "https://pg-app-anqa30rgauq0e3zdaich1reeciyju8.scalabl.cloud/1/";

function App() {
  const [leadForm, setLeadForm] = useState(new LeadForm());
  const [footerIsHidden, setFooterIsHidden] = useState(true);
  const [appStarted, setAppStarted] = useState(false);

  const size = useWindowSize();

  useEffect(async () => {
    // Met à jor le titre du documnt via l’API du navigateur
    if (appStarted == false) {
      setAppStarted(true);
      await updateLead("created", true);

      scroll.scrollTo(0, {
        duration: 0.3,
        delay: 0,
      });
      const progressValue = (0 / (questions.length + 1)) * 100;
      setProgress(progressValue);

      const res = await axios.get("https://geolocation-db.com/json/");

      await updateLead("isMobile", isMobile);
      await updateLead("ip", res.data.IPv4);
    }
  });

  async function updateLead(param, value) {
    var needToUpdateObject = false;
    if (leadForm.get("param") != undefined) {
      if (leadForm.get("param") != value) {
        needToUpdateObject = true;
      }
    } else {
      needToUpdateObject = true;
    }

    if (needToUpdateObject) {
      if (leadForm.get("done") == undefined) {
        leadForm.set(param, value);
        await leadForm.save();
      }
    }

    // console.info("Lead saved " + new Date());
  }

  const myGreen = "#1EA9A4";
  const [questions, setquestions] = useState([
    {
      question: (
        <span>
          Êtes-vous <strong>propriétaire</strong> ou locataire ?
        </span>
      ),
      subtitle: (
        <span>
          Ce programme Solaire 2021 est uniquement réservé aux
          <strong> propriétaires de maison</strong>.
        </span>
      ),
      answers: ["Propriétaire", "Locataire"],
      codeAnswers: ["Propriétaire", "Locataire"],
      currentAnswerIndex: 0,
      answerIsValid: false,
      param: "situationType",
      type: "choice",
    },
  ]);

  const [progress, setProgress] = useState(0);

  const handleChangeChoice = (indexQuestion, indexAnswer) => {
    var newquestions = [...questions];
    newquestions[indexQuestion].currentAnswerIndex = indexAnswer;
    setquestions(newquestions);
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  const handleChangeAnswer = (answer, index) => {
    var newquestions = [...questions];
    var question = newquestions[index];

    if (question.maxLength) {
      question.answer = answer.substring(0, question.maxLength);
    } else {
      question.answer = answer;
    }

    //min length is 2
    if (question.answer.length > 1) {
      question.answerIsValid = true;
    } else {
      question.answerIsValid = false;
    }

    //specific min length
    if (question.minLenght) {
      if (question.answer.length >= question.minLenght) {
        question.answerIsValid = true;
      } else {
        question.answerIsValid = false;
      }
    }

    //Email
    if (question.type == "email") {
      if (validateEmail(question.answer)) {
        question.answerIsValid = true;
      } else {
        question.answerIsValid = false;
      }
    }

    setquestions(newquestions);
  };

  const handleBack = (index) => {
    scroll.scrollTo(index * window.innerHeight, {
      duration: 0.3,
      delay: 0,
    });

    const progressValue = (index / (questions.length + 1)) * 100;

    setProgress(progressValue);
  };

  const startQuestions = async () => {
    console.info("height " + size.height);

    updateLead("heightinit", window.innerHeight);
    updateLead("newheight", size.height);

    // scroll.scrollTo("test1", {
    //   duration: 0.3,
    //   delay: 0,
    // });

    scroller.scrollTo("myScrollToElement", {
      duration: 300,
      delay: 0,
      smooth: false,
      offset: 0, // Scrolls to element + 50 pixels down the page
    });

    const progressValue = (1 / (questions.length + 1)) * 100;
    setProgress(progressValue);

    await updateLead("started", true);
  };

  const handleNext = async (index) => {
    var newquestions = [...questions];
    var question = newquestions[index];

    if (question.type === "choice") {
      question.answerIsValid = true;
      setquestions(newquestions);
    }

    console.info("Indexx " + index);
    if (!question.answerIsValid) {
      return;
    }

    if (question.type == "choice") {
      var answer = question.answers[question.currentAnswerIndex];
    } else {
      var answer = question.answer;
    }

    updateLead(question.param, answer);

    var indexToGo = -1;

    for (var i = questions.length - 1; i >= 0; i--) {
      if (questions[i].answerIsValid == false) {
        indexToGo = i;
      }
    }

    //On a fini
    if (indexToGo == -1) {
      setFooterIsHidden(false);
      scroll.scrollTo((questions.length + 1) * window.innerHeight, {
        duration: 0.3,
        delay: 0,
      });

      const progressValue =
        ((questions.length + 1) / (questions.length + 1)) * 100;
      setProgress(progressValue);

      await updateLead("done", true);
    } else {
      scroll.scrollTo((indexToGo + 1) * window.innerHeight, {
        duration: 0.3,
        delay: 0,
      });

      const progressValue = ((indexToGo + 1) / (questions.length + 1)) * 100;
      setProgress(progressValue);
    }
  };
  return (
    <div className="container">
      <LoadingBar
        color={myGreen}
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(100)}
      />
      <img className="france" alt="france" src={france} />

      <Header startQuestions={startQuestions} />

      <div className="innerContainer">
        {questions.map((data, index) => (
          <Element name="myScrollToElement">
            <Question
              questions={questions}
              handleChangeChoice={handleChangeChoice}
              handleChangeAnswer={handleChangeAnswer}
              handleNext={handleNext}
              handleBack={handleBack}
              index={index}
            />
          </Element>
        ))}
      </div>

      {!footerIsHidden ? <Footer /> : null}
    </div>
  );
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default App;
