/* eslint-disable */

import Methods from "../methods/Methods";

const routers = {
  "api/users": {
    get: (req, res) => Methods.get(req, res),
    post: (req, res) => Methods.post(req, res),
    put: (req, res) => Methods.put(req, res),
    delete: (req, res) => Methods.delete(req, res),
  },
  notExist: (req, res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Doesn't exist" }));
  },
};
export default routers;
