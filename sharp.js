const sharp = require("sharp");

sharp("./img2/1.png")
// .normalise()
.gamma(3)
// .modulate({hue: 180})
.modulate({brightness: 1, saturation: 1})
.extractChannel("red", "blue")
// .threshold(0)
.png(1)
.toFile("./img2/2.png",()=>{console.log("done")})