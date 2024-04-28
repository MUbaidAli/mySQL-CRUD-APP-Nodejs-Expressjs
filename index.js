const express = require("express");
const app = express();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");
const port = 8484;

var methodOverride = require("method-override");
const { connect } = require("http2");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "facebook",
  password: "umarubaidhina",
});

function randomfaker() {
  return {
    Id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

const arr = [];

function generateDATA(num) {
  for (let i = 0; i < num; i++) {
    const arr2 = [
      randomfaker().Id,
      randomfaker().username,
      randomfaker().email,
      randomfaker().password,
    ];
    arr.push(arr2);
  }
}

// generateDATA(50);
// console.log(arr);

// try {
//   connection.query("INSERT INTO users VALUES ?", [arr], (err, result) => {
//     if (err) throw err;

//     console.log(result);
//   });
// } catch (error) {
//   console.log(error);
// }

function randomfaker() {
  return {
    Id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  try {
    connection.query(`DELETE FROM users WHERE id ='${id}'`, (err, result) => {
      if (err) throw err;

      console.log(result);
      res.redirect("/users");
    });
  } catch (error) {
    console.log(error);
    res.send("something wrong");
  }
});
app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/users/new", (req, res) => {
  const { username, password, email } = req.body;

  const user = [crypto.randomUUID(), username, email, password];
  console.log(user);
  try {
    connection.query(
      "INSERT INTO users VALUES (?,?,?,?)",
      user,
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.redirect("/users");
      }
    );
  } catch (error) {
    console.log(error);
    res.send("something wrong");
  }
});

app.patch("/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { username: newUsername, password: formPass } = req.body;
    // console.log(username);

    connection.query(
      `SELECT * FROM users WHERE id = '${id}'`,
      (err, result) => {
        if (err) throw err;
        let user = result[0];

        if (user.password == formPass) {
          // update query
          connection.query(
            `UPDATE users SET username = '${newUsername}' WHERE id = '${id}'`,
            (err, result) => {
              if (err) throw err;

              console.log(result);
              res.redirect("/users");
            }
          );
        } else {
          res.send("password incorrect");
        }

        console.log(result);
      }
    );

    // res.send("patch works");
  } catch (error) {
    console.log(error);
    res.send("something wrong");
  }
});

app.get("/users/:id/edit", (req, res) => {
  const { id } = req.params;

  try {
    connection.query(`SELECT * FROM users WHERE id ='${id}'`, (err, result) => {
      if (err) throw err;
      const data = result[0];

      console.log(result);
      res.render("edit.ejs", { data });
    });
  } catch (error) {
    console.log(error);
    res.send("something is wrong");
  }

  //   res.render("edit.ejs");
});

app.get("/users", (req, res) => {
  try {
    connection.query("SELECT * from users", (err, result) => {
      if (err) throw err;
      //   console.log(result);
      res.render("users.ejs", { result });
    });
  } catch (error) {
    console.log(err);
    res.send("something went wrong");
  }
});

app.get("/", (req, res) => {
  try {
    connection.query("SELECT COUNT(id) from users", (err, result) => {
      if (err) throw err;
      //   console.log(result[0]["COUNT(id)"]);
      res.render("home.ejs", { count: result[0]["COUNT(id)"] });
    });
  } catch (error) {
    console.log(err);
    res.send("something went wrong");
  }
  //   console.log(randomfaker());
  //   res.send("test");
});

app.listen(port, () => {
  console.log("app running on port 8484");
});
