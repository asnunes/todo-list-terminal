const readlineSync = require("readline-sync");
const fs = require("fs");

let todos;
const commands = [
  {
    name: "add",
    method: add,
  },
  {
    name: "list",
    method: list,
  },
  {
    name: "check",
    method: check,
  },
  {
    name: "remove",
    method: remove,
  },
];

function start() {
  loadTodos();
  goToHome();
}

function goToHome() {
  save();

  const cmdIndex = readlineSync.keyInSelect(
    commands.map((c) => c.name),
    "Type your command"
  );
  (commands[cmdIndex] && commands[cmdIndex].method()) || process.exit(0);

  goToHome();
}

function add() {
  const todo = readlineSync.question("What do you want to do? ");
  if (todo) todos.push({ todo: todo.trim(), check: false });
  goToHome();
}

function list() {
  showTodos();
  goToHome();
}

function check() {
  const todoToCheckIndex = readlineSync.keyInSelect(
    formatTodos(),
    "What todo do you want to check/uncheck? "
  );
  if (todoToCheckIndex !== -1)
    todos[todoToCheckIndex].check = !todos[todoToCheckIndex].check;

  goToHome();
}

function remove() {
  const todoToRemoveIndex = readlineSync.keyInSelect(
    formatTodos(),
    "What todo do you want to remove? "
  );
  todos = todos.filter((_td, index) => index !== todoToRemoveIndex);
  goToHome();
}

function save() {
  fs.writeFileSync("todos.json", JSON.stringify(todos));
}

function loadTodos() {
  if (fs.existsSync("todos.json")) {
    const data = fs.readFileSync("todos.json", "utf-8");
    todos = JSON.parse(data);
  } else {
    todos = [];
  }
}

function formatTodos() {
  return todos.map((td) => ` ${td.check ? "🟢" : "🔴"} ` + td.todo);
}

function showTodos() {
  console.log("=======================");
  console.log(formatTodos().join("\n"));
  console.log("=======================");
}

start();
