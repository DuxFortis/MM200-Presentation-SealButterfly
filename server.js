const express = require('express');
const bodyParser = require('body-parser');
const user = require("./modules/user");
const presentation = require("./modules/presentation");
const getPresData = require("./modules/presentation").getPresData;
const getAllPres = require("./modules/presentation").getAllPres;
const updatePres = require("./modules/presentation").updatePres;
const slides = require("./modules/slides");
const auth = require("./modules/auth");

const createToken = require("./modules/sbToken").create;

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.json());

const maxCharLength = 20;
const maxCharLengthPres = maxCharLength+10;


// create new user
server.post("/user", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.status(403).json("Invalid username or password").end();
  }
  if(username.length > maxCharLength || password.length > maxCharLength){
    res.status(403).json(`Username or password is exceeding ${maxCharLength} characters!`).end();
  }else{
  const newUser = new user(username, password);
  const resp = await newUser.create();

  if(resp === null){
    res.status(401).json("Username is taken!").end();
  }else{
    res.status(200).json("Account created!").end();
  }
  // Hva om databasen feilet?
  // Hva om det var en bruker med samme brukernavn?
  }
});


// login user
server.post("/authenticate", async (req, res) => {

  //console.log(req.headers.authorization); // krypterte strengen brukeren sender inn

  const credentials = req.headers.authorization.split(' ')[1];
  const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":"); // dekrypterer den krypterte strengen

  //console.log(username + ":" + password); // brukernavn, passord i ren tekst
  
  const requestUser = new user(username, password); // Hvem prøver å logge inn?
  const isValid = await requestUser.validate(); // Finnes vedkommende i DB og er det riktig passord?

  //console.log(isValid); // isValid = true/false
  
  if(isValid){
    let sessionToken = createToken(requestUser);
    res.status(200).json({"authToken":sessionToken, "user": requestUser}).end();
  } else {
    res.status(403).json("Username or password is incorrect!").end(); 
  }
  
});

//!!!! WARNING DEMO !!!
server.post("/user/presentation/:id", auth, async function (req, res) {
    const owner = req.body.user;
    const presentationId = req.body.presentationId;
    //name, theme, owner, isPublic, id
    const Pres = new presentation("", "", "", owner, "", presentationId);
    const resp = await Pres.getPresentation();


    if(resp.length === 0){
      res.status(404).json("Presentation not found").end();
    }else{

    // Bruker spør om presentasjon med id.
    // Tilhører den presentasjonen denne brukeren?
    // if(req.user.id = presentasjon.author){}
    // req.user kommer fra auth. 
    
    // Retuner json for presentasjon.

    res.status(200).json(resp).end();
    }

});

server.post("/:user/presentations/:isPublic", auth, async function (req, res) {
  const owner = req.body.user;
  const isPresentationPublic = req.body.isPublic;
  let publicOrNotStatus = "public";
  //name, theme, owner, isPublic, id
  /*const Pres = new presentation("", "", owner, "", presentationId);*/

  const resp = await getPresData(owner, isPresentationPublic);

  if(!isPresentationPublic){
    publicOrNotStatus = "private";
  }

  if(resp.length === 0){
    res.status(404).json(`User does not have any ${publicOrNotStatus} presentations`).end();
  }else{

  // Bruker spør om presentasjon med id.
  // Tilhører den presentasjonen denne brukeren?
  // if(req.user.id = presentasjon.author){}
  // req.user kommer fra auth. 
  
  // Retuner json for presentasjon.

  res.status(200).json(resp).end();
  }

});

server.post("/user/presentation/:id/slide", auth, async function (req, res) {
  const owner = req.body.user;
  const presentationId = req.body.presentationId;
  const template = 1;
  
  //name, theme, owner, isPublic, id
  const newSlide = new slides(presentationId, template, owner);
  const resp = await newSlide.create();

  if(resp === null){
    res.status(404).json("Presentation not found").end();
  }else{
  
  // Retuner json for presentasjon/slide

  res.status(200).json("Created new slide").end();
  }

});

server.post("/presentation", auth, async (req, res) => {

  let presentationName = req.body.presentation.name;
  let isPublic = req.body.presentation.isPublic;
  let presentationTheme = req.body.presentation.theme;
  if(isPublic !== true && isPublic !== false){
    isPublic = false;
  }

  if(presentationName === ""){
    presentationName = "New Presentation";
  }
  if(presentationTheme === ""){
    presentationTheme = "Light";
  }

  if(presentationName.length > maxCharLength){
    res.status(403).json(`Presentation name is exceeding ${maxCharLength} characters!`).end();
  }else{

  let descr = "";
  
  const owner = req.body.user;
  const newPres = new presentation(presentationName, presentationTheme, descr, owner, isPublic);
  const resp = await newPres.create();
 
  res.status(200).json(resp).end();
  }
});

server.post("/presentations/uniPub", auth, async (req, res) => {

  let resp = await getAllPres();

  if(resp.length === 0){
    res.status(403).json("There is no public presentations!").end();
  }
 
  res.status(200).json(resp).end();
  }
);

server.post("/presentations/update/:id", auth, async (req, res) => {
  const presentation = req.body.presentation;
  const owner = req.body.user;

  if(presentation.name.length > maxCharLengthPres){
    res.status(403).json(`Presentation name is exceeding ${maxCharLengthPres} characters!`).end();
    return;
  }else{

  if(presentation.owner === owner){

    let resp = await updatePres(presentation, owner);

    if(resp.length === 0){
      res.status(403).json("No changes have been made!").end();
    }
   
    res.status(200).json(resp).end();
  }else{
    res.status(403).json("You are not the owner of this presentation!").end();
  }}

});

server.post("/presentations/delete/:id", auth, async (req, res) => {
  const presentation = req.body.presentation;
  const owner = req.body.user;

  if(presentation.owner === owner){

    //let resp = await deletePres(presentation, owner);
    let resp = 1;

    if(resp.length === 0){
      res.status(403).json("No changes have been made!").end();
    }
   
    res.status(200).json(resp).end();
  }else{
    res.status(403).json("You are not the owner of this presentation!").end();
  }

});

server.listen(server.get('port'), function () {
  console.log('server running', server.get('port'));
});