import React, { useState } from "react";
import "../styles/Question.scss";
import backArrow from "../assets/images/topArrow.svg";

var classNames = require("classnames");

function Question({
  index,
  questions,
  handleChangeChoice,
  handleNext,
  handleBack,
  handleChangeAnswer,
  remaining,
}) {
  var question = questions[index];
  var answers = question.answers;
  const [shake, setShake] = useState(false);

  const [infoHidden, setInfoHidden] = useState(true);

  const onKeyDown = (event, index) => {
    if (event.key === "Enter") {
      if (question.answerIsValid) {
        event.target.blur();

        setTimeout(function () {
          touchNext(index);
        }, 10);
      } else {
        touchNext(index);
      }
    }
  };
  const touchNext = (index) => {
    // Button begins to shake

    if (!question.answerIsValid && question.type != "choice") {
      setShake(true);
      // Buttons stops to shake after 2 seconds
      setTimeout(() => setShake(false), 400);
    }

    handleNext(index);
  };

  const setFocus = () => {
    this.refs.inputQuestion.focus();
  };

  return (
    <div className="blocQuestion">
      <a className="backBtn" onClick={() => handleBack(index)}>
        <img height="100px" src={backArrow} alt="" />
      </a>

      <h2>
        <span>
          <span className="prefixe">{index + 1}</span>{" "}
          <svg height="10" width="11">
            <path d="M7.586 5L4.293 1.707 5.707.293 10.414 5 5.707 9.707 4.293 8.293z"></path>
            <path d="M8 4v2H0V4z"></path>
          </svg>
        </span>{" "}
        {question.question}
      </h2>
      <p>{question.subtitle}</p>
      <div className="checkList">
        {question.type === "choice" && (
          <ul>
            {answers.map((choice, indexAnswer) => (
              <li
                key={choice}
                className={
                  question.currentAnswerIndex === indexAnswer ? "active" : ""
                }
              >
                <a
                  className={question.longAnswers ? "longAnswer" : ""}
                  onClick={() => handleChangeChoice(index, indexAnswer)}
                >
                  <span>
                    {String.fromCharCode(97 + indexAnswer).toUpperCase()}
                  </span>{" "}
                  {choice}{" "}
                  <svg height="13" width="16">
                    <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z"></path>
                  </svg>{" "}
                </a>
              </li>
            ))}
          </ul>
        )}

        {question.type !== "choice" && (
          <div>
            {question.type === "email" && (
              <input
                key={index}
                placeholder="Répondez ici..."
                type="email"
                required
                value={question.answer}
                onChange={(e) => handleChangeAnswer(e.target.value, index)}
                onKeyDown={(e) => onKeyDown(e, index)}
                onBlur={() => setInfoHidden(true)}
                onFocus={() => setInfoHidden(false)}
              />
            )}

            {question.type === "text" && (
              <input
                key={index}
                placeholder="Répondez ici..."
                type="text"
                required
                value={question.answer}
                onChange={(e) => handleChangeAnswer(e.target.value, index)}
                onKeyDown={(e) => onKeyDown(e, index)}
                onBlur={() => setInfoHidden(true)}
                onFocus={() => setInfoHidden(false)}
              />
            )}

            {question.type === "number" && (
              <input
                key={index}
                placeholder="Répondez ici..."
                type="number"
                required
                value={question.answer}
                onChange={(e) => handleChangeAnswer(e.target.value, index)}
                onKeyDown={(e) => onKeyDown(e, index)}
                onBlur={() => setInfoHidden(true)}
                onFocus={() => setInfoHidden(false)}
              />
            )}

            {question.type === "phone" && (
              <input
                key={index}
                placeholder="Répondez ici..."
                type="number"
                required
                value={question.answer}
                onChange={(e) => handleChangeAnswer(e.target.value, index)}
                onKeyDown={(e) => onKeyDown(e, index)}
                onBlur={() => setInfoHidden(true)}
                onFocus={() => setInfoHidden(false)}
              />
            )}

            <div className="invalid-feedback" hidden>
              <svg height="24" viewBox="0 0 24 24" width="24">
                <path
                  clipRule="evenodd"
                  d="M16.3361 17.9998L7.00279 18C5.49294 18 4.52754 16.391 5.23806 15.0588L9.90471 6.30882C10.6576 4.89706 12.6812 4.89706 13.4341 6.30881L18.1008 15.0586C18.8113 16.3908 17.8459 17.9998 16.3361 17.9998ZM11.6694 8.50003C12.2217 8.50003 12.6694 8.94774 12.6694 9.50003V11.5C12.6694 12.0523 12.2217 12.5 11.6694 12.5C11.1171 12.5 10.6694 12.0523 10.6694 11.5V9.50003C10.6694 8.94774 11.1171 8.50003 11.6694 8.50003ZM11.6694 16C12.2217 16 12.6694 15.5523 12.6694 15C12.6694 14.4477 12.2217 14 11.6694 14C11.1171 14 10.6694 14.4477 10.6694 15C10.6694 15.5523 11.1171 16 11.6694 16Z"
                  fillRule="evenodd"
                ></path>
              </svg>{" "}
              Veuillez remplir ce champ
            </div>
          </div>
        )}

        <div className="cta">
          <a
            className={classNames({
              okBtn: true,
              submit: questions.length - 1,
              shake: shake,
            })}
            onClick={() => touchNext(index)}
          >
            {index === questions.length - 1 ? "Envoyer" : "Continuer"}

            <svg height="13" width="16">
              <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z"></path>
            </svg>
          </a>
          <p
            className={classNames({
              info: true,
              infoHidden: infoHidden,
            })}
          >
            appuyez sur <strong>Entrée ↵</strong>
          </p>
        </div>
        {remaining == 1 && (
          <p className="timeInfo">
            ⏰ Encore seulement <strong>{remaining} candidature</strong>{" "}
            disponible.
          </p>
        )}

        {remaining != 1 && (
          <p className="timeInfo">
            ⏰ Encore seulement <strong>{remaining} candidatures</strong>{" "}
            disponibles.
          </p>
        )}
      </div>
    </div>
  );
}

export default Question;
