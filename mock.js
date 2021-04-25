module.exports = function( socket ){
    let screenshot = null

    const select = 1 

    const mockSelector = [
        "not_on_unassigned.png",
        "difficulty_1.png",
        "difficulty_2.png",
        "difficulty_3.png"
    ]

    socket.on("connect", () => {
        console.log("CONNECTION: ", socket.connected);
        
        screenshot = require("fs").readFileSync(`./mock-images/${mockSelector[select]}`)
    });

    socket.on("disconnect", () => {
        console.log("CONNECTION: ", socket.connected);
    });
    
    socket.on("send-capture", () => {
        if(screenshot){
            socket.emit("capture", {STORE: process.env.store, screenshot})
        };
    });
}