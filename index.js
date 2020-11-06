const readlineSync = require("readline-sync");

let todos = [];
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
  showTodos();

  const cmdIndex = readlineSync.keyInSelect(
    commands.map((c) => c.name),
    "Type your command"
  );
  (commands[cmdIndex] && commands[cmdIndex].method()) || process.exit(0);

  start();
}

function add() {
  const todo = readlineSync.question("What do you want to do? ");
  if (todo) todos.push({ todo: todo.trim(), check: false });
  start();
}

function list() {
  showTodos();
  start();
}

function check() {
  const todoToCheckIndex = readlineSync.keyInSelect(
    formatTodos(),
    "What todo do you want to check/uncheck? "
  );
  todos[todoToCheckIndex].check = !todos[todoToCheckIndex].check;
  start();
}

function remove() {
  const todoToRemoveIndex = readlineSync.keyInSelect(
    formatTodos(),
    "What todo do you want to remove? "
  );
  todos = todos.filter((_td, index) => index !== todoToRemoveIndex);
  start();
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
