//jshint esversion:8

const express=require('express');
const app = express();
const https= require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');
mailchimp.setConfig({
    apiKey:'4491af5c1fea9f0bbc95f7cd347a7b16-us8',
    server:'us8'
});

//for parsing url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(express.static("public"));

//adding audience
app.post('/',function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;
    const suscribedUser=
    {
        firstName:firstName,
        lastName:lastName,
        email:email
    };
    //unique id
    const listID='f6512a577f';
    async function run(){
       const response=await mailchimp.lists.addListMember(listID,{
        email_address:suscribedUser.email,
        status:'suscribed',
        merge_fields:{
            FNAME:suscribedUser.firstName,
            LNAME:suscribedUser.lastName
        }
       });
       res.sendFile(__dirname+'/success.html');
    }
    run().catch(() => res.sendFile(__dirname+'/failure.html'));
    console.log(`successfully submitted. Response: ${response}`);
});

app.listen(3000,function(req,res) {
    console.log('Listening on port 3000');
});
app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html');
});