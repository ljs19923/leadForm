import React from "react";
import "../styles/Question.scss";

var classNames = require("classnames");

function Footer({}) {
  return (
    <div className="blocQuestion footerIsHidden">
      <h2>
        👏 Votre <strong>demande d'éligibilité aux subventions</strong> de
        l'État pour le programme Solaire 2021 a été{" "}
        <strong> reçue avec succès</strong> !
      </h2>
      <p>
        Vous serez{" "}
        <strong>contacté très prochainement par un conseiller</strong> qui
        réalisera avec vous une <strong>étude solaire</strong> plus précise et
        le calcul de vos économies. 💰
      </p>
    </div>
  );
}

export default Footer;
