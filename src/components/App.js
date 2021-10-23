import React, { useState, useEffect } from "react";

import Question from "./Question";
import Footer from "./Footer";
import Header from "./Header";
import LoadingBar from "react-top-loading-bar";
import { isMobile } from "react-device-detect";
import ReactPixel from "react-facebook-pixel";

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

const advancedMatching = {};
const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};
ReactPixel.init("251506523438577", advancedMatching, options);

Parse.serverURL =
  "https://pg-app-anqa30rgauq0e3zdaich1reeciyju8.scalabl.cloud/1/";

function App() {
  const [leadForm, setLeadForm] = useState(new LeadForm());
  const [appStarted, setAppStarted] = useState(false);
  const [offsetScroll, setOffsetScroll] = useState(100);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(async () => {
    // Met à jor le titre du documnt via l’API du navigateur
    if (appStarted == false) {
      ReactPixel.pageView(); // For tracking page view

      setAppStarted(true);
      await updateLead("created", true);

      if (isMobile == false) {
        setOffsetScroll(0);
      }
      scroll.scrollTo(0, {
        duration: 300,
        delay: 0,
      });
      const progressValue = (0 / (questions.length + 1)) * 100;
      setProgress(progressValue);

      const res = await axios.get("https://geolocation-db.com/json/");

      await updateLead("os", getOS());
      await updateLead("isMobile", isMobile);
      await updateLead("screenHeight", window.innerHeight);

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
    {
      question: (
        <span>
          Quel est votre <strong>type de bien</strong> ?
        </span>
      ),
      subtitle: null,
      answers: ["Maison 🏡", "Appartement"],
      codeAnswers: ["Maison", "Appartement"],
      currentAnswerIndex: 0,
      answerIsValid: false,
      param: "dwellingType",
      type: "choice",
    },
    {
      question: (
        <span>
          Quel est votre <strong>code postal</strong> ?
        </span>
      ),
      subtitle: (
        <span>
          <strong>Code postal complet à 5 chiffres</strong>. Nous vérifions
          également votre éligibilité aux aides régionales.
        </span>
      ),
      answer: "",
      type: "number",
      answerIsValid: false,
      param: "zipCode",
      maxLength: 5,
      minLenght: 5,
    },

    {
      question: (
        <span>
          Quelle est votre <strong>profession</strong> ?
        </span>
      ),
      subtitle: null,
      answers: [
        "Salarié",
        "Profession libérale",
        "Retraité",
        "Sans Emploi",
        "Étudiant",
        "Autre",
      ],
      codeAnswers: [
        "Salarié",
        "Profession libérale",
        "Retraité",
        "Sans Emploi",
        "Étudiant",
        "Autre",
      ],
      currentAnswerIndex: 0,
      answerIsValid: false,
      param: "jobType",

      type: "choice",
    },
    {
      question: (
        <span>
          Quel est votre <strong>E-mail ?</strong>
        </span>
      ),
      subtitle: (
        <span>
          <strong>Félicitations</strong>, nous vous avons trouvé un programme de
          <strong> subventions</strong> ! ✨
        </span>
      ),
      answer: "",
      answerIsValid: false,
      param: "emailAddress",

      type: "email",
    },
    {
      question: <span>Quel est votre prénom ?</span>,
      subtitle: null,
      answer: "",
      answerIsValid: false,
      param: "firstName",

      type: "text",
    },
    {
      question: (
        <span>
          Quel est votre <strong>nom de famille</strong> ?
        </span>
      ),
      subtitle: (
        <span>
          Notre expert vous appellera dans les prochaines{" "}
          <strong>48 heures</strong> afin de vous donner le montant de votre
          subvention.
        </span>
      ),
      answer: "",
      param: "lastName",

      answerIsValid: false,
      type: "text",
    },
    {
      question: (
        <span>
          Quel est le <strong>revenu net mensuel</strong> de votre ménage ?
        </span>
      ),
      subtitle: (
        <span>
          Notre expert vous appellera dans les prochaines{" "}
          <strong>48 heures</strong> afin de vous donner le montant de votre
          subvention.
        </span>
      ),
      answers: [
        "Inférieur à 1200€",
        "Entre 1200€ et 2000€",
        "Entre 2000€ et 2500€",
        "Plus de 2500€",
      ],
      codeAnswers: ["LessThan1200", "1200to2000", "2000to2500", "MoreThan2500"],
      longAnswers: true,
      answerIsValid: false,
      param: "revenueRange",
      currentAnswerIndex: 2,
      type: "choice",
    },
    {
      question: (
        <span>
          Quelle est votre <strong>ville</strong> ?
        </span>
      ),
      subtitle: (
        <span>
          Notre système utilise des images satellites afin d'évaluer le
          <strong> potentiel d'ensoleillement de votre toit</strong>.
        </span>
      ),
      answer: "",
      answerIsValid: false,
      param: "cityName",

      type: "text",
    },
    {
      question: (
        <span>
          Quelle est votre <strong>adresse</strong> ?
        </span>
      ),
      subtitle: (
        <span>
          Notre système utilise des images satellites afin d'évaluer le
          <strong> potentiel d'ensoleillement de votre toit</strong>.
        </span>
      ),
      answer: "",
      answerIsValid: false,
      param: "streetAddress",

      type: "text",
    },
    {
      question: (
        <span>
          Quelle est votre <strong>année de naissance</strong> ?{" "}
        </span>
      ),
      subtitle: null,
      answer: "",
      type: "number",
      answerIsValid: false,
      param: "birthYear",

      maxLength: 4,
      minLenght: 4,
    },
    {
      question: (
        <span>
          ☎️ Quel est votre numéro de <strong>téléphone</strong> ?
        </span>
      ),
      subtitle: (
        <span>
          Nous allons vous joindre dans les prochains jours afin{" "}
          <strong>d'affiner votre dossier</strong>.
        </span>
      ),
      answer: "",
      answerIsValid: false,
      type: "phone",
      param: "phoneNumber",

      maxLength: 10,
      minLenght: 10,
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
    // scroller.scrollTo(String(index), {
    //   duration: 300,
    //   delay: 0,
    //   smooth: false,
    //   offset: offsetScroll,
    // });

    setCurrentStep(index);

    const progressValue = (index / (questions.length + 1)) * 100;

    setProgress(progressValue);
  };

  const startQuestions = async () => {
    // scroller.scrollTo("1", {
    //   duration: 300,
    //   delay: 0,
    //   smooth: false,
    //   offset: offsetScroll,
    // });

    setCurrentStep(1);

    const progressValue = (1 / (questions.length + 1)) * 100;
    setProgress(progressValue);

    ReactPixel.track("TypeformFirstInteraction");

    updateLead("started", true);
  };

  const handleNext = async (index) => {
    var newquestions = [...questions];
    var question = newquestions[index];

    if (question.type === "choice") {
      question.answerIsValid = true;
      setquestions(newquestions);
    }

    if (!question.answerIsValid) {
      return;
    }

    if (question.type == "choice") {
      var answer = question.codeAnswers[question.currentAnswerIndex];
    } else {
      var answer = lowerCaseAllWordsExceptFirstLetters(question.answer);
    }

    updateLead(question.param, answer);

    if (index + 1 == questions.length) {
      console.info("ON A FINI " + index);

      updateLead("done", true);
      ReactPixel.track("TypeformSubmit");
    }

    setCurrentStep(Number(index + 2));
    const progressValue = ((index + 2) / (questions.length + 1)) * 100;
    setProgress(progressValue);
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

      <Element
        className={classNames({
          hidden: currentStep == 0 ? false : true,
        })}
      >
        <Header startQuestions={startQuestions} />
      </Element>

      <div className="innerContainer">
        {questions.map((data, index) => (
          <Element
            className={classNames({
              hidden: currentStep == Number(index + 1) ? false : true,
            })}
          >
            <Question
              questions={questions}
              handleChangeChoice={handleChangeChoice}
              handleChangeAnswer={handleChangeAnswer}
              handleNext={handleNext}
              handleBack={handleBack}
              remaining={questions.length - index}
              index={index}
            />
          </Element>
        ))}
      </div>

      <Element
        className={classNames({
          hidden: currentStep == questions.length + 1 ? false : true,
        })}
      >
        <Footer />
      </Element>
    </div>
  );
}

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseAllWordsExceptFirstLetters(string) {
  return string.replace(/\S*/g, function (word) {
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
} //

function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
}

export default App;
