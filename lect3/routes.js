const fs=require("fs");

const requestHandler=(req,res)=>{
    const url=req.url;
    const method=req.method;
    console.log(url);
    console.log(method);
    if(url==="/"){
        res.write("<html>");
        res.write("<head><title>Hello node</title></head>");
        res.write("<body><form action='/message' method='POST'><input type='text' name='message'/><button type='submit'>Send</button></form></body>");
        res.write("</html>");
        res.end();
        return;
    }
    if(url==="/message" && method==="POST"){
        //? 'on' allow us to listen to certain events eg: data event
        //? it takes a function that should be executed when the mentioned event occure
        const body=[];
        console.log("I am here");
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk); //changing the data not the value of body ie array
        });
        //? 'end' event listener will be fired when we are done parsing the incoming data
        return req.on("end",()=>{
            //? Buffer is a Node global obj. 
           const parseBody = Buffer.concat(body).toString();
           console.log(parseBody); 
           const message=parseBody.split("=")[1];
           fs.writeFile("message.txt",message,(err)=>{
               res.statusCode=302;
               res.setHeader("Location","/");
               res.end();
               return;
           });
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
}

// module.exports=requestHandler;
exports.handler=requestHandler;
exports.someText="Hello people";