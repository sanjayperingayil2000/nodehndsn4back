const bodyParser = require("body-parser");
const express = require("express");
const bycrpt = require("bcrypt")
const jwt = require("jsonwebtoken");
const fs=require("fs");

const app=express();
app.use(express.json());

app.post('/register', function(req, res) {
    const userData = req.body;
    fs.writeFileSync('./users.json', JSON.stringify(userData));
    res.send('User data saved successfully');
  });

app.get('/register',function(req,res){
    res.send({userData})
})

app.post('/register1',function(req,res){
  console.log("Regististering the user");
  const userDetails = req.body;
  console.log("Received user details => ",userDetails);
  const password = userDetails.password;
  const roundsOfSalt = 10;
  bycrpt.hash(password,roundsOfSalt,function(err,hashedPassword){
      if(err){
        console.log(err)
      }
      else{
        console.log("Here is a hashed password =>",hashedPassword);
        bycrpt.compare(password, hashedPassword, function(err,result){
          if(err){
              console.log(err)
          }
          console.log("hashed password maches result =>",result)
          res.send({"Hashed Password" : hashedPassword});
        })
      }
    })
})

app.post('/login',function(req,res){
  console.log("User logging in");
  const loginData = req.body;
  console.log("Received login data =>",loginData);
  const SECRET_KEY = "secretKey@123"; //also called as public key
  const jwtToken = jwt.sign(loginData, SECRET_KEY)
  res.send({"token": jwtToken})
})
// app.get('/login1',function(req,res){// for generating
//   const loginData=req.body
//   const SECRET_KEY="secretKey@123"
//   const jwtToken=jwt.sign(loginData,SECRET_KEY) //for genration
//   console.log("this is login page")
//   res.send({"token":jwtToken})

// })

app.get('/login',function(req,res){
console.log("this is user page")
const rawtokenfromgene=req.headers['authorization']
console.log(rawtokenfromgene)
const token=rawtokenfromgene.split(' ')[1]
const SECRET_KEY="secretKey@123"
const decoded=jwt.verify(token,SECRET_KEY)
console.log("this is decoded data=>",decoded)
res.status(200).send(decoded)
})
  
  app.listen(3000, () => console.log('Server started on port 3000'));