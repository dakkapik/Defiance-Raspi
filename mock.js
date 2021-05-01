module.exports = function( socket ){

    const dirPath = '../../d/success images/scraps'
    const fs = require("fs");
    let imageNames = [];
    let iteration = 0;
    const STORE = process.env.store

    fs.readdirAsync = function(dirname) {
        return new Promise(function(resolve, reject) {
            fs.readdir(dirname, function(err, filenames){
                if (err) 
                    reject(err); 
                else 
                    resolve(filenames);
            });
        });
    };

    fs.readdirAsync(dirPath).then((filenames) => {
        filenames = filenames.filter(file => isFileType(file, "png"))
        imageNames = filenames
    })
    
    socket.on("connect", () => {

        socket.emit("set-store", process.env.store + "-" + process.env.NODE_ENV)
        
        console.log("CONNECTION: ", socket.connected);
 
    });

    socket.on("disconnect", () => {
        console.log("CONNECTION: ", socket.connected);
    });
    
    socket.on("send-capture", () => {
        const filePath = `${dirPath}/${imageNames[iteration]}`
        if(fs.existsSync(filePath)){
            fs.readFile(filePath, (err, screenshot) => {
                if(err) return socket.emit("error", err)
                socket.emit("capture", {STORE, screenshot})
            })
            iteration ++;
        } else {
            fs.readFile(`${filePath}/${imageNames[0]}`, (err, screenshot) => {
                if(err) return socket.emit("error", err)
                socket.emit("capture", {STORE, screenshot})
            })
            iteration = 0;
        }
    });

    fs.readdirAsync = function(dirname) {
        return new Promise(function(resolve, reject) {
            fs.readdir(dirname, function(err, filenames){
                if (err) 
                    reject(err); 
                else 
                    resolve(filenames);
            });
        });
    };
    
    function isFileType (filename, type) {
        return(filename.split(".")[1] == type)
    }
}
