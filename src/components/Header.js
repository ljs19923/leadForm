import React from "react";
import "../styles/Question.scss";

import maprimerenov from "../assets/images/maprimerenov.png";

var classNames = require("classnames");

function Header({ startQuestions, remaining }) {
  return (
    <div className="blocQuestion">
      <div className="headerImages">
        <img className="logo" alt="logo" src={maprimerenov} />
      </div>
      <h1>Panneaux Solaire 2021</h1>
      <h3>
        <strong>Vérifier votre éligibilité au programme !</strong>
      </h3>
      <p>
        <br />
        Demande gratuite et sans engagement pour obtenir des aides de l'État.
        <br /> <br className="brHideDesktop" />
        Environ
        <strong> 35 foyers</strong> subventionnés par département par jour.
        <br />
        <br />
        Durée du formulaire : <strong>45sec</strong>.
      </p>
      <div className="cta">
        <a
          className={classNames({
            okBtn: true,
            header: true,
          })}
          onClick={() => startQuestions()}
        >
          C'est parti !
        </a>
      </div>

      {remaining == 1 && (
        <p className="timeInfo">
          ⏰ Encore seulement <strong>{remaining} demande disponible </strong>
          aujourd'hui.{" "}
        </p>
      )}

      {remaining != 1 && (
        <p className="timeInfo">
          ⏰ Encore seulement <strong>{remaining} demandes disponibles </strong>
          aujourd'hui.{" "}
        </p>
      )}
    </div>
  );
}

export default Header;
