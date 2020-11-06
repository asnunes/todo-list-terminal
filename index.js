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
  {
    name: "pomodoro",
    method: pomodoro,
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

  if (cmdIndex === -1) process.exit(0);
  commands[cmdIndex] && commands[cmdIndex].method();
}

function add() {
  const todo = readlineSync.question("What do you want to do? ");
  if (todo) todos.push({ todo: todo.trim(), check: false, pomodoros: 0 });
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

function pomodoro() {
  const todoToPomodoroIndex = readlineSync.keyInSelect(
    formatTodos(),
    "What todo do you want to have a pomodoro? "
  );

  if (todoToPomodoroIndex !== -1) {
    const todo = todos[todoToPomodoroIndex];
    setTimeout(() => {
      todo.pomodoros += 1;
      save();
      console.log(`Pomodoro de "${todo.todo}" está completo!`);
      goToHome();
    }, 3000);
    console.log(`Pomodoro de "${todo.todo}" setado!`);
  }
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
  return todos.map(
    (td) =>
      ` ${td.check ? "🟢" : "🔴"} ` + td.todo + ` ${"🍅".repeat(td.pomodoros)} `
  );
}

function showTodos() {
  console.log("=======================");
  console.log(formatTodos().join("\n"));
  console.log("=======================");
}

start();
