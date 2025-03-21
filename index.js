const http = require("node:http")
const fs = require("node:fs/promises")

const server = http.createServer((req, res) =>{
    if(req.url == "/register" && req.method == "POST"){
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString()
        })
        req.on("end", async () => {
            try {
                let {name, password} = JSON.parse(body)
                let symbols = ['@', '!', '$', '_', '-']
                let hasSymbol = symbols.some(sym => password.includes(sym))
                let hasUppercase = password.split("").some(char => char >= 'A' && char <= 'Z')
                let hasLowercase = password.split("").some(char => char >= 'a' && char <= 'z')
                let hasNumber = password.split("").some(char => char >= '0' && char <= '9')
                let users = await fs.readFile("./users.json", "utf-8");
                let parsedUsers = JSON.parse(users)
                if(parsedUsers.find((user) => user.name == name)){
                    res.writeHead(403, {"content-type":"text/plain"})
                    return res.end("User with this username already exists. Please choose another username!")
                }if(!hasSymbol){
                    res.writeHead(201, {"content-type":"text/plain"})
                    return res.end("The password should include at least one symbol")
                } if(!hasUppercase){
                    res.writeHead(201, {"content-type":"text/plain"})
                    return res.end("The password should include at least one uppercase letter")
                } if(!hasLowercase){
                    res.writeHead(201, {"content-type":"text/plain"})
                    return res.end("The password should include at least one lowercase letter ")
                } if(!hasNumber){
                    res.writeHead(201, {"content-type":"text/plain"})
                    return res.end("The password should include at least one number")
                } if(password.length < 5 || password.length > 12){
                    res.writeHead(201, {"content-type":"text/plain"})
                    return res.end("The password should include at least 5 and maximum 12 characters!")
                }
                parsedUsers.push({name, password})
                await fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2))
                res.writeHead(201, {"content-type":"text/plain"})
                return res.end("User successfully registered!")
            } catch (error) {
                res.writeHead(201, {"content-type":"text/plain"})
                return res.end("Internal Server Error!") 
            }
        })
    
    }
    if (req.url == "/login" && req.method == "POST"){
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString()
        })
        req.on("end", async () => {
            try {
                let {name, password} = JSON.parse(body)
                let users = await fs.readFile("./users.json", "utf-8");
                let parsedUsers = JSON.parse(users)
                if(!name || !password){
                    res.writeHead(404, {"content-type":"text/plain"})
                    return res.end("Username and password required!")
                }
                if(!parsedUsers.find((user) => user.name == name && user.password == password)){
                    res.writeHead(404, {"content-type":"text/plain"})
                    return res.end("Invalid credentials!")
                }
                else{
                    res.writeHead(200, {"content-type":"text/plain"})
                    return res.end("User successfully logged in!")
                }
            } catch (error) {
                res.writeHead(201, {"content-type":"text/plain"})
                return res.end("Internal Server Error!") 
            }
    })
    }
})
server.listen((2222), ()=>{
    console.log("Server running on port 2222");
})
