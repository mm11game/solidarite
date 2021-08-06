const express = require("express");
const app = express();
const port = 5000;

const usersRoutes = require("./routes/usersRoutes");
const boardsRoutes = require("./routes/boardsRoutes");
const { errorHandler, notFound } = require("./middlewares/errerHandler.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", usersRoutes);
app.use("/api/boards", boardsRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
