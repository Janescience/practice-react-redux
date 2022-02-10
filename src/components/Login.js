import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

import { login , register } from "../actions/auth";

const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
            This field is required!
        </div>
      );
    }
};

const Login = (props) => {
    const form = useRef();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();
  
    const onChangeUsername = (e) => {
      const username = e.target.value;
      setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();
    
        setLoading(true);
    
        form.current.validateAll();
    
        dispatch(login(username, password))
        .then(() => {
            props.history.push("/transactions");
        }).catch(() => {
          setLoading(false);
        });
    };

    if (isLoggedIn) {
      return <Navigate to="/transactions" />;
    }

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <Form onSubmit={handleLogin} ref={form}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Input
                        type="text"
                        className="form-control"
                        name="username"
                        value={username}
                        onChange={onChangeUsername}
                        validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Input
                        type="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary btn-block" disabled={loading}>
                        {loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Login</span>
                        </button>
                    </div>

                    {message && (
                        <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
};

const Register = (props) => {
    const form = useRef();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeName = (e) => {
        const name = e.target.value;
        setName(name);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleRegister = (e) => {
        e.preventDefault();
    
        setSuccessful(false);
    
        form.current.validateAll();
    
        dispatch(register(username, name, password)).then(
        (response) => {
            setSuccessful(true);
        }).catch(() => {
            setSuccessful(false);
        });
    };

    return (
        <div className="col-md-12">
          <div className="card card-container">
            <Form onSubmit={handleRegister} ref={form}>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={username}
                      onChange={onChangeUsername}
                      validations={[required]}
                    />
                  </div>
    
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={onChangeName}
                      validations={[required]}
                    />
                  </div>
    
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                      validations={[required]}
                    />
                  </div>
    
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">Sign Up</button>
                  </div>
                </div>
              )}
    
              {message && (
                <div className="form-group">
                  <div
                    className={ successful ? "alert alert-success" : "alert alert-danger" }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      );
    
};

const SingUpAdnSignIn = () => {
  return (
    <div>
      <Register/>
      <Login/>
    </div>
  )
}

export default SingUpAdnSignIn ;