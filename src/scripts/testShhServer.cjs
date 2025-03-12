const { Server } = require("ssh2");
const fs = require("fs");
const { spawn } = require("child_process");

// Load the host key
const hostKey = fs.readFileSync("dummy_host_key.pem");

const server = new Server({ hostKeys: [hostKey] }, (client, info) => {
  console.log(`Client connected: ${info.ip}`);

  client.on("authentication", (ctx) => {
    if (
      ctx.method === "password" &&
      ctx.username === "user" &&
      ctx.password === "password123"
    ) {
      ctx.accept();
    } else {
      ctx.reject();
    }
  });

  client.on("ready", () => {
    console.log("Client authenticated!");

    // Handle PTY (interactive terminal) request
    client.on("session", (accept, reject) => {
      const session = accept();

      session.on("pty", (accept, reject, info) => {
        console.log("PTY requested:", info);
        accept();
      });

      // Handle interactive shell requests
      session.on("shell", (accept, reject) => {
        console.log("Shell requested");
        const stream = accept();

        // Launch a shell (Bash for Linux/macOS, CMD for Windows)
        const shell =
          process.platform === "win32"
            ? spawn("cmd.exe")
            : spawn("bash", ["-i"]);

        // Pipe data between the shell and the SSH client
        shell.stdout.pipe(stream);
        shell.stderr.pipe(stream);
        stream.pipe(shell.stdin);

        // Improve shell interaction by handling resize events
        stream.on("window-change", (width, height) => {
          shell.stdin.write(`\x1b[8;${height};${width}t`);
        });

        stream.on("close", () => shell.kill());
      });

      // Handle command execution
      session.on("exec", (accept, reject, info) => {
        console.log(`Executing command: ${info.command}`);
        const stream = accept();

        const cmd = process.platform === "win32" ? "cmd.exe" : "bash";
        const args =
          process.platform === "win32"
            ? ["/c", info.command]
            : ["-c", info.command];

        const child = spawn(cmd, args);

        child.stdout.pipe(stream);
        child.stderr.pipe(stream);

        child.on("close", (code) => {
          stream.exit(code);
          stream.end();
        });

        stream.on("close", () => child.kill());
      });
    });
  });

  client.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(2222, "0.0.0.0", () => {
  console.log("SSH Server listening on port 2222");
});
