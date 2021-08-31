import React from "react";
import ReactDOM from "react-dom";
import "../../styles.css";
import logo from "../logo.png";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "../AlertTemplate";
import Alerts from "../Alerts";
import { Link, Redirect } from "react-router-dom";

// Alert Options
const alertOptions = {
  timeout: 4000,
  position: "top center",
  transition: "scale",
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: [],
    };
  }

  static propTypes = {
    message: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (error !== prevProps.error) {
      if (error.msg.non_field_errors) {
        this.setState({
          errors: [
            ...this.state.errors,
            { name: "username", message: error.msg.non_field_errors },
            { name: "password", message: error.msg.non_field_errors },
          ],
        });
      }
    }
  }

  changeHandler = (event) => {
    event.preventDefault();
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });

    this.handleCorrection(event);
  };

  submitHandler = (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    let newErrors = [];

    if (!username) {
      newErrors = [
        ...newErrors,
        { name: "username", message: "username" + " field can't be empty!" },
      ];
    }
    if (!password) {
      newErrors = [
        ...newErrors,
        { name: "password", message: "password" + " field can't be empty!" },
      ];
    }
    if (newErrors.length) {
      this.setState({ errors: [...this.state.errors, ...newErrors] });
    }
    if (!this.state.errors.length) {
      this.props.login(username, password);
    }
  };

  focusLostHandler = (event) => {
    const nam = event.target.name;
    const val = event.target.value;

    let newErrors = [];

    if (!this.state.errors.some((error) => nam === error) && !val) {
      newErrors = [
        ...newErrors,
        { name: nam, message: nam + " field can't be empty!" },
      ];
    }
    if (newErrors.length) {
      this.setState({ errors: [...this.state.errors, ...newErrors] });
    }
  };

  handleCorrection = (event) => {
    const nam = event.target.name;
    const val = event.target.value;

    if (val) {
      this.setState({
        errors: this.state.errors.filter((error) => error.name !== nam),
      });
    }
  };

  checkError = (name) => {
    return (
      this.state.errors.filter((error) => name === error.name).at(0) ?? false
    );
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <Alerts />
        <div className="h-screen flex place-items-center bg-gradient-to-r from-register-start to-register-end">
          <div className="flex flex-col mx-auto bg-white rounded p-10 shadow max-w-sm">
            <img
              src={logo}
              className="mx-auto mb-6"
              height="1000px"
              width="200px"
            />
            <p className="text-4xl font-bold break-word mb-6 text-center">
              Login
            </p>
            <form className="flex flex-col space-y-8">
              <InputField
                name="username"
                value={this.state.name}
                type="text"
                placeholder="Username"
                error={this.checkError("username")}
                onBlur={(event) => this.focusLostHandler(event)}
                onChange={(event) => this.changeHandler(event)}
              />
              <InputField
                name="password"
                value={this.state.password}
                type="password"
                placeholder="Password"
                error={this.checkError("password")}
                onBlur={(event) => this.focusLostHandler(event)}
                onChange={(event) => this.changeHandler(event)}
              />
              <SubmitButton onClick={(event) => this.submitHandler(event)} />
            </form>
            <p className="text-center mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>{" "}
            </p>
          </div>
        </div>
      </AlertProvider>
    );
  }
}

class InputField extends React.Component {
  render() {
    return (
      <div className="relative">
        <input
          className={
            "relative border z-10 appearance-none bg-transparent block w-full focus:ring-2 ring-opacity-50 focus:shadow-inner focus:outline-none px-1.5 py-1 rounded " +
            (this.props.error
              ? "ring-2 border-red-500 ring-red-500"
              : "border-blue-500 ring-blue-500")
          }
          name={this.props.name}
          value={this.props.value}
          type={this.props.type}
          placeholder=" "
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
        />
        <label
          htmlFor={this.props.name}
          className="absolute text-gray-400 top-1 ml-2 bg-white duration-300 rounded-lg origin-left"
        >
          {this.props.placeholder}
        </label>
        <p className="absolute text-xs mt-px text-red-500 capitalize-first">
          {this.props.error.message}
        </p>
      </div>
    );
  }
}

class SubmitButton extends React.Component {
  render() {
    return (
      <input
        className="text-white px-2 py-3 focus:ring ring-blue-500 ring-opacity-50 rounded cursor-pointer hover:bg-blue-600
                bg-blue-500 focus:bg-blue-700 focus:shadow-inner"
        type="submit"
        value="Submit"
        onClick={this.props.onClick}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
