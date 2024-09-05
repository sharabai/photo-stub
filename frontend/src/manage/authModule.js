const auth = (() => {
  function setToken(newToken) {
    // console.log("Trying to set up token", newToken);
    localStorage.setItem("token", newToken);
  }

  function get() {
    return localStorage.getItem("token");
  }

  return {
    token: {
      get: get,
      valid: () => {
        return fetch(`${import.meta.env.VITE_API_URL}/validate-and-renew`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${get()}`,
          },
        })
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error("Network response was not ok");
            }
          })
          .then((res) => {
            console.log("token.valid res:");
            console.log(res);
            if (res.token) {
              console.log("New token in town");
              console.log("Trying to call setToken");
              setToken(res.token);
            }
            if (res.valid) return true;
            else return false;
          })
          .catch((error) => {
            console.log(error.message);
            console.log("Returns false valid");
            return false;
          });
      },
    },
    login: (user, pass) => {
      fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user, password: pass }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((res) => {
          console.log("Auth module ..");
          console.log(res);
          console.log("Trying to call setToken");
          setToken(res.token);
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  };
})();

export default auth;
