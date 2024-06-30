const wrapPromise = (promise:any) => {
  let status = "pending";
  let result = "";
  let suspender = promise.then(
    (res:any) => {
      status = "success";
      result = res;
    },
    (err:any) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      }
      return result;
    }
  }
}