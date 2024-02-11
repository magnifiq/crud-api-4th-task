/* eslint-disable */

import dotenv from "dotenv";
import { server } from "./server";

dotenv.config();
const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
