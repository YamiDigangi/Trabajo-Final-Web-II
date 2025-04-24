const { response } = require("express");

const apiUrl ="https://restcountries.com/v3.1/all"

async function getPreguntasCapital (){
    try {
         const repuesta = await fetch(apiUrl);
         const capitales = await response.json();

         console.log(capitales);

    } catch (error) {
         console.error(error);
        
    }
}