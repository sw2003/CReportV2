import express, { Express, Request, Response} from "express"

import app from "./app" 

app.listen(4000, ()=>{
    console.log("App listening on port 4000"); 
})

