const { copy, rmdirSync, readdirSync, unlink } = require("fs-extra");
const { promisify } = require("util");
const child_process = require("child_process");
const copyfiles = require("copyfiles");

const build = "./build";
const common = `${build}/common`;
const functions = `${build}/functions`;
const interfaces = `${build}/interfaces`;

const exec = promisify(child_process.exec);
const cp = promisify(copyfiles);

(async function () {
  try {
    await exec("npm run compile");

    readdirSync(functions).forEach(async (func) => {
      try {
        const funcPath = `${functions}/${func}`;
        const handler = `${funcPath}/functions/handler`;
        const funcp = `${funcPath}/*.{js,map}`;

        await cp(["./package*.json", "./buildspec.yml", funcPath]);
        await cp([funcp, handler], { up: 3 });
        await copy(common, `${funcPath}/common`);

        readdirSync(funcPath).forEach(async (f) =>
          f.endsWith(".js") || f.endsWith(".map")
            ? await unlink(`${funcPath}/${f}`)
            : null
        );
      } catch (error) {
        throw error;
      }
    });

    // rmdirSync(common, { recursive: true })
    // rmdirSync(interfaces, { recursive: true })

    await exec("sam build");
  } catch (error) {
    console.error(error);
  }
})();

// rmSync(build, { recursive: true, force: true })
rmdirSync(build, { recursive: true });
