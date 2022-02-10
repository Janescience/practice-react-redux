import http from "../commons/http-common";


const register = (username, name, password) => {
    return http.post("auth/signup", {
      username,
      name,
      password,
    });
};

const login = (username, password) => {
    return http.post("auth/signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
  
        return response.data;
      });
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    register,
    login,
    logout,
};