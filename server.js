const express = require('express');
const bodyParser = require('body-parser');
const user = require("./modules/user");
const presentation = require("./modules/presentation");
const auth = require("./modules/auth");

const createToken = require("./modules/sbToken").create;

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.json());

const maxCharLength = 20;


// create new user
server.post("/user", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.status(403).json("invalid username or password").end();
  }
  if(username.length > maxCharLength || password.length > maxCharLength){
    res.status(403).json(`Username or password is exceeding ${maxCharLength} characters!`).end();
  }else{
  const newUser = new user(username, password);
  const resp = await newUser.create();

  if(resp === null){
    res.status(401).json("username is taken!").end();
  }else{
    res.status(200).json(newUser).end();
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
    //let sessionToken = 1234; //bare for nå siden vi ikke har laget ferdig token modulen
    res.status(200).json({"authToken":sessionToken, "user": requestUser}).end();
  } else {
    res.status(403).json("unauthorized").end(); 
  }
  
});

//!!!! WARNING DEMO !!!
server.get("/user/presentation/:id", auth, function (req, res) {

    // Bruker spør om presentasjon med id.
    // Tilhører den presentasjonen denne brukeren?
    // if(req.user.id = presentasjon.author){}
    // req.user kommer fra auth. 
    
    // Retuner json for presentasjon. 

});

server.post("/presentation", auth, async (req, res) => {

  let presentationName = req.body.presentation.name;
  if(presentationName === ""){
    presentationName = "New Presentation";
  }
  if(presentationName.length > maxCharLength){
    res.status(403).json(`Presentation name is exceeding ${maxCharLength} characters!`).end();
  }else{
  const presentationTheme = req.body.presentation.theme;
  const owner = req.body.user;
  const isPublic = req.body.presentation.isPublic;

  const newPres = new presentation(presentationName, presentationTheme, owner, isPublic);
  await newPres.create();
 
  res.status(200).json(newPres).end();
  }
});

server.post("/presentation/*")


/*server.get("/secure/*", async function (req, res) {

    let isValid = false;

    if(isValid === true){
        res.redirect("/secure/userIndex.html");
    }else{
        res.redirect("/");
    }

    

})*/

server.listen(server.get('port'), function () {
  console.log('server running', server.get('port'));
});
