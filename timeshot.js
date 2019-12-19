/*
  Copyright (C) 2019 Gabriel Rodrigues

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
  */

const fs = require("fs");
const { execSync } = require("child_process");
const FILE = "timeshot.json";

/*
 * JSON Schema
 * {
 *   current: string[],
 *   logs: [
 *     {
 *       time: "now"
 *       removed: string[]
 *       added: string[]
 *     }
 *   ]
 * }
 *
 * */

const listFiles = () => execSync("find .").toString().split("\n");

const getDiff = (oldl, newl) => {
  const added = [];
  const removed = [...oldl];

  for (let i of newl) {
    if (!oldl.includes(i)) {
      added.push(i);
    } else {
      removed.splice(removed.indexOf(i), 1);
    }
  }

  return { added, removed };
};

main();

function main() {
  // Referência aos arquivos atuais (antes da nova documentação).
  const currLog = fs.existsSync(FILE)
    ? JSON.parse(fs.readFileSync(FILE))
    : { current: "", logs: [] };

  // Objeto com a lista de todos os arquivos atuais;
  const newLog = { ...currLog };
  newLog.current = listFiles();

  // Retorna um objeto com a informação de arquivos removidos e adicionados.
  const diff = getDiff(currLog.current, newLog.current);

  // Documenta a alteração
  newLog.logs.push({ time: Date(), ...diff });

  // Escreve a alteração, substituindo o currLog.
  fs.writeFileSync(FILE, JSON.stringify(newLog, null, 4));
}
