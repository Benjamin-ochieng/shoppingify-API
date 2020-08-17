/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const setupReqRes = () => {
  const req = {
    body: {},
  };
  const res = {};
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this;
      }.bind(res)
    ),

    cookie: jest.fn(
      function () {
        return this;
      }.bind(res)
    ),

    json: jest.fn(
      function json() {
        return this;
      }.bind(res)
    ),

    send: jest.fn(
      function send() {
        return this;
      }.bind(res)
    ),

    end: jest.fn(
      function end() {
        return this;
      }.bind(res)
    ),
  });

  return {
    req,
    res,
  };
};

export default setupReqRes;
