import { readFile } from "fs/promises";
import FtpSrv from "ftp-srv";

const FTP_PORT = 2121;
const FTP_URL = `ftp://0.0.0.0:${FTP_PORT}`;

const config = JSON.parse(
  await readFile(new URL("./config.json", import.meta.url)),
);

const ftpServer = new FtpSrv({
  url: FTP_URL,
  anonymous: false,
  pasv_url: "0.0.0.0",
  pasv_range: "60000-60100",
});

ftpServer.on("login", ({ username, password }, resolve, reject) => {
  const user = config.find(
    (u) => u.user === username && u.password === password,
  );

  if (user) {
    resolve({ root: user.path });
  } else {
    reject(new Error("Access denied!"));
  }
});

ftpServer.listen().then(() => {
  console.log(`✅ Serves is running: ${FTP_URL}`);
});
