const carlo = require("carlo");
const os = require("os");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

async function run() {
  let app;
  try {
    app = await carlo.launch({
      bgcolor: "#ff4545",
      title: "Electrojet App",
      width: 1000,
      height: 500,
      channel: ["canary", "stable"],
      /*
          Chrome currently allows only https servers to load content onto the page
          This argument removes the nasty warning about insecure page
          https://github.com/GoogleChromeLabs/carlo/issues/73
         */
      args: ["--allow-insecure-localhost"],
      localDataDir: path.join(os.homedir(), ".electrojet-app")
    });
  } catch (e) {
    // New window is opened in the running instance.
    console.log("Reusing the running instance");
    return;
  }
  app.on("exit", () => process.exit());

  // New windows are opened when this app is started again from command line.
  app.on("window", window => window.load("index.html"));

  if (isProduction) {
    app.serveFolder(path.join(__dirname, "dist"));
  } else {
    app.serveOrigin("https://localhost:4567");
  }

  await app.load("index.html");
  return app;
}

module.exports = { run };
