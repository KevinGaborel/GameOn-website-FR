function editNav() {
  const headerElt = document.getElementById("myTopnav");
  const iconElt = headerElt.querySelector('.icon');
  if (headerElt.className === "topnav") {
    headerElt.className += " responsive";
    iconElt.style.color = 'white';
  } else {
    headerElt.className = "topnav";
    iconElt.style.color = '#f00';
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBodyElt = modalbg.querySelector(".modal-body");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeModalElt = document.querySelector(".close");
const formElt = document.querySelector('form');

// variable qui va déterminée le nombre de caractères requis
const minimumCaractere = 2;

// le style de la bordure si false
const borderFalseStyle = "red solid 2px";
// le style de la bordure si true
const borderTrueStyle = "none";

// les différents messages d'erreurs
const strWarningName = `Doit contenir 2 caractères minimum`;
const strWarningMail = "L'adresse électronique est invalide.";
const strWarningNbTournament = "Une valeur numérique entière et positif doit-être saisie"
const strWarningBirthdate = "Votre date de naissance est invalide";
const strWarningWishTournament = "Veuillez choisir un tournoi";
const strWarningConditions = "Vous devez accepter les conditions d'utilisation";

// objet qui permet de savoir si le formulaire est correctement rempli
let formValidator = {
  firstName: false,
  name: false,
  mail: false,
  bithDate: false,
  NumberTournament: false,
  wishTournament: false,
  conditions: true
};

// fonction pour clean le formulaire
function cleanForm(){
  formElt.reset();
};

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// close modal event
closeModalElt.addEventListener('click', closeModal);

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// close modal form
function closeModal() {
  modalbg.style.display = "none";


  const successContainerElt = document.getElementById('successContainer');
  // si on veut fermer la modal après s'être inscrit
  if (successContainerElt){
    modalBodyElt.removeChild(successContainerElt);
    cleanForm();
  }
}



// fonction qui se charge d'afficher ou non un message d'erreur
function textWarning(obj){
/* obj est un objet contenant warning qui est un booléen
parent qui est le noeud parent
child est l'élément qui a été créer (c'est le message d'erreur) et qui va être rattaché au parent
text est simplement une string qui va être le message de l'erreur */

  // si obj.warning, c'est qu'il y a une erreur, donc on applique un style
  if (obj.warning) {
    const warningTextColor = "red";
    const fontSizeWarning = "12px";
  
    obj.child.style.color = warningTextColor;
    obj.child.style.fontSize = fontSizeWarning;
    obj.child.textContent = obj.text;

    obj.parent.appendChild(obj.child);

  } else{
    /* pour le else j'ai dans l'objet obj, une autre valeur en plus de warning et parent
    id, qui correspond a l'id de la span du message d'erreur */

    // ici je cible le span avec le message d'erreur, ne renverra le noeud que s'il existe
    const spanWarningElt = document.getElementById(obj.id);
    
    // si le warning existe, le supprime
      if (spanWarningElt) {
        obj.parent.removeChild(spanWarningElt);
      }
  }

}

// fonction qui ajoute une bordure
function borderWarning(warning, input){
  // si erreur l'input prend le style de bordure définie dans la variable "borderFalseStyle"
  if (warning){
    input.style.border = borderFalseStyle;
  } else{
    input.style.border = borderTrueStyle;
  }
}

// fonction qui retourne un noeud span, a besoin d'un id
function createSpan(id){
  const spanWarningElt = document.createElement("span");
  spanWarningElt.id = id;
  return spanWarningElt;
}

// pour chaque élément du tableau, on lui applique un écouteur d'événement de tyle input, à chaque modification d'une valeur de l'input
formData.forEach((form, index) => form.addEventListener("input", () => {
  // on cible l'input de la partie du formulaire
  const inputElt = form.querySelector("input");

  // tableau qui va me servir pour crée des id pour le message d'erreur, l'index est dans le même ordre que celui des inputs
  const inputName = ['firstName', 'name', 'mail', 'bithDate', 'NumberTournament', 'wishTournament', 'conditions', 'wishNotified']
  const idWarning = `${inputName[index]}Warning`;

  // firstName === 0, name === 1, donc si c'est un des deux input
  if (index === 0 || index === 1){
    // regex qui ne prend pas en compte le vide
    const nonWhiteSpace = /\S+/;
    // méthode qui va couper la chaîne de caractère à chaque espace
    const tabInputValue = inputElt.value.split(' ');

    // méthode pour filter chaque elt du tableau qui match uniquement si l'elt n'est pas un espace
    const tabInputValueWihoutSpace =  tabInputValue.filter(value => nonWhiteSpace.exec(value));

    // méthode qui lie tout les elts du tableau pour en faire une string
    const strWihoutSpace = tabInputValueWihoutSpace.join('');
  
    // firstName et name doivent avoir une longueur minimal de 2 caractères
    if (strWihoutSpace.length < 2){

      // si la longueur minimal n'est pas respecté

      // si l'elt warning existe, on à pas besoin d'en recréer un
      if(document.getElementById(idWarning)){
        return;
      }

      const spanWarningElt = createSpan(idWarning);

      // on utilise les deux fonctions crée précédemment
      borderWarning(true, inputElt);
      textWarning({warning: true, parent: form, child: spanWarningElt, text: strWarningName});

      // on indique que cet input n'est pas correctement rempli
      formValidator[inputName[index]] = false;

    } else{
      borderWarning(false, inputElt);
      textWarning({warning: false, parent: form, id: idWarning});

      // on indique que cet input est correctement rempli
      formValidator[inputName[index]] = true;
    }
  }

  // si c'est l'index 2 alors c'est l'input de l'email
  else if (index === 2){
    // regex qui permet de filter les mauvaise adresse
    const email = /^[a-z0-9][a-z._\-0-9]+@[a-z]+\.[a-z]{2,}$/;

    // si la valeur de l'input passe la regex, donc est true
    if (email.exec(inputElt.value)){
      borderWarning(false, inputElt);
      textWarning({warning: false, parent: form, id: idWarning});

      // on indique que cet input est correctement rempli
      formValidator[inputName[index]] = true;
    } 
    else{

      // si l'elt warning existe, on à pas besoin d'en recréer un
      if(document.getElementById(idWarning)){
        return;
      }

      borderWarning(true, inputElt);
      const spanWarningElt = createSpan(idWarning);
      textWarning({warning: true, parent: form, child: spanWarningElt, text: strWarningMail});

      // on indique que cet input n'est pas correctement rempli
      formValidator[inputName[index]] = false;
    }
  }

  // si c'est l'index 3 alors c'est l'input de date de naissance
  else if (index === 3){
    //on récupère la valeur entrée
    const birthDate = Date.parse(inputElt.value);
    // la date actuelle
    const actualDate = Date.now();

    // si vous êtes née avant la date actuel alors c'est bon
    if (birthDate < actualDate){
      borderWarning(false, inputElt);
      textWarning({warning: false, parent: form, id: idWarning});

      // on indique que cet input est correctement rempli
      formValidator[inputName[index]] = true;
    } 

    else{

      // si l'elt warning existe, on à pas besoin d'en recréer un
      if(document.getElementById(idWarning)){
        return;
      }

      borderWarning(true, inputElt);
      const spanWarningElt = createSpan(idWarning);
      textWarning({warning: true, parent: form, child: spanWarningElt, text: strWarningBirthdate});

      // on indique que cet input n'est pas correctement rempli
      formValidator[inputName[index]] = false;
    }
  }

  // si c'est l'index 4 alors c'est l'input du nb de tournois
  else if (index === 4){
    // le nombre doit être un entier positif
    const nbTournament = /^[0-9]{1,}$/;

    // si il passe la regex
    if (nbTournament.exec(inputElt.value)){
      borderWarning(false, inputElt);
      textWarning({warning: false, parent: form, id: idWarning});

      // on indique que cet input est correctement rempli
      formValidator[inputName[index]] = true;
    } 
    else{

      // si l'elt warning existe, on à pas besoin d'en recréer un
      if(document.getElementById(idWarning)){
        return;
      }

      borderWarning(true, inputElt);
      const spanWarningElt = createSpan(idWarning);
      textWarning({warning: true, parent: form, child: spanWarningElt, text: strWarningNbTournament});

      // on indique que cet input n'est pas correctement rempli
      formValidator[inputName[index]] = false;
    }
  }

  // si c'est l'index 5 alors c'est l'input des tournois de l'année
  else if (index === 5){
      formValidator[inputName[index]] = true;
     
      if (document.getElementById(idWarning)){
        borderWarning(false, inputElt);
        textWarning({warning: false, parent: form, id: idWarning});
      } 
    } 

  // si c'est l'index 6 alors c'est l'input des conditions d'utilisation
  else if (index === 6){
    // le formValidator va prendre la valeur true ou false en fonction de si il est coché ou non 
    formValidator[inputName[index]] = inputElt.checked;

    if (document.getElementById(idWarning)){
      borderWarning(false, inputElt);
      textWarning({warning: false, parent: form, id: idWarning});
    } 
  }
  
}));

// fonction qui va vérifier via l'objet formValidator si le formulaire peut être envoyer
function validate(event){
  // on annule le comportement par défaut
  event.preventDefault();
  // va permettre de savoir si il y a une erreur ou non
  let resultForm = true;

  for (input in formValidator){
    //on passe chaque élément de l'objet, si un est false, alors resultForm devient false, le formulaire ne
    // sera pas envoyer

    // si la valeur est false
    if (!formValidator[input]){
      const idWarning = `${input}Warning`;
      const spanWarningElt = createSpan(idWarning);
      const inputName = ['firstName', 'name', 'mail', 'bithDate', 'NumberTournament', 'wishTournament', 'conditions', 'wishNotified']
      
      // on récupère l'index de l'input dans le tableau inputName, en fonction du nom de l'input
      const indexInput = inputName.indexOf(input);

      // on garde dans le tableau formData, la partie contenant l'input que l'on veut, en indiquant son index
      const formElt = formData[indexInput];

      // on cherche le premier elt input de la partie du formulaire gardé
      const inputElt = formElt.querySelector('input');

      // variable qui va contenir le message d'erreur en fonction de l'index de l'input
      let stringWarning;
     
      if (indexInput < 2){
        stringWarning = strWarningName;
      } else if (indexInput === 2){
        stringWarning = strWarningMail;
      } else if (indexInput === 3){
        stringWarning = strWarningBirthdate;
      } else if (indexInput === 4){
        stringWarning = strWarningNbTournament;
      } else if (indexInput === 5){
        stringWarning = strWarningWishTournament;
      } else if (indexInput === 6){
        stringWarning = strWarningConditions;
      }

      // si l'elt warning n'existe pas, on a besoin d'en créer un
      if(!document.getElementById(idWarning)){
        borderWarning(true, inputElt);
        textWarning({warning: true, parent: formElt, child: spanWarningElt, text: stringWarning});
      } 
   
      //on indique que le formulaire ne peut pas être envoyer
      resultForm = false;

    }
  }

  // si le formulaire peut être envoyer
  if (resultForm){
    // on crée le message de succès, une div avec un contenu
    const successContainerElt = document.createElement('div');
    successContainerElt.id = 'successContainer';

    const btnCloseElt = document.createElement('button');
    btnCloseElt.textContent = 'Fermer';
    btnCloseElt.className = "btn-signup modal-btn";

    successContainerElt.textContent = "Merci pour votre inscription";
    // puis on le stylise
    successContainerElt.style.backgroundColor = "#232323";
    successContainerElt.style.width = "100%";
    successContainerElt.style.height = "calc(100% - 47px)";
    successContainerElt.style.position = "absolute";
    successContainerElt.style.top = '47px';
    successContainerElt.style.left = "0px";
    successContainerElt.style.display = "flex";
    successContainerElt.style.flexDirection = 'column';
    successContainerElt.style.justifyContent = "center";
    successContainerElt.style.alignItems = "center";
   
    // ensuite on l'inclut dans le noeud de successContainerElt
    successContainerElt.appendChild(btnCloseElt);

    // ensuite on l'inclut dans le DOM, dans l'elt parent modalBodyElt
    modalBodyElt.appendChild(successContainerElt);

    btnCloseElt.addEventListener('click', closeModal);
  }
}