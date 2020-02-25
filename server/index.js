const app = require("./app");

//Start the server
const port = process.env.PORT || 8001;
app.listen(port, function() {
  console.log(`Server listening ${port}`);
});
