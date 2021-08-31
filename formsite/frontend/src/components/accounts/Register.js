import React from "react";
import "../../styles.css";
import logo from "../logo.png";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";

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

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordAgain: "",
      errors: [],
    };
  }

  static propTypes = {
    register: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { message, error } = this.props;

    let newErrors = [];

    if (prevProps.message !== message && message.registerSuccess) {
      this.setState({
        username: "",
        email: "",
        password: "",
        passwordAgain: "",
      });
    } else if (error !== prevProps.error) {
      if (error.msg.email) {
        newErrors = [...newErrors, { name: "email", message: error.msg.email }];
      }
      if (error.msg.username) {
        newErrors = [
          ...newErrors,
          { name: "username", message: error.msg.username },
        ];
      }
      this.setState({
        errors: [...this.state.errors, ...newErrors],
      });
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
    const { username, email, password, passwordAgain } = this.state;

    let newErrors = [];

    if (!username) {
      newErrors = [
        ...newErrors,
        { name: "username", message: "username" + " field can't be empty!" },
      ];
    }
    if (!email) {
      newErrors = [
        ...newErrors,
        { name: "email", message: "email" + " field can't be empty!" },
      ];
    }
    if (!password) {
      newErrors = [
        ...newErrors,
        { name: "password", message: "password" + " field can't be empty!" },
      ];
    }
    if (!passwordAgain) {
      newErrors = [
        ...newErrors,
        {
          name: "passwordAgain",
          message: "password Again" + " field can't be empty!",
        },
      ];
    } else if (password !== passwordAgain) {
      newErrors = [
        ...newErrors,
        { name: "passwordAgain", message: "Passwords doesn't match!" },
      ];
    }
    if (newErrors.length) {
      this.setState({ errors: [...this.state.errors, ...newErrors] });
    }
    if (!this.state.errors.length) {
      this.props.register(username, password, email);
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
    } else if (
      nam === "email" &&
      (val.indexOf("@") >= val.lastIndexOf(".") ||
        val.lastIndexOf(".") === val.length - 1)
    ) {
      newErrors = [
        ...newErrors,
        { name: nam, message: "Please enter a valid email" },
      ];
    }
    if (newErrors.length) {
      this.setState({ errors: [...this.state.errors, ...newErrors] });
    }
  };

  handleCorrection = (event) => {
    const nam = event.target.name;
    const val = event.target.value;

    if (nam === "email" && val.indexOf("@") < val.lastIndexOf(".")) {
      this.setState({
        errors: this.state.errors.filter((error) => error.name !== nam),
      });
    } else if (val) {
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
            <p className="text-2xl font-bold break-word mb-6 text-center">
              Join us to make your life easier with high quality forms
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
                name="email"
                value={this.state.email}
                type="email"
                placeholder="Email"
                error={this.checkError("email")}
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
              <InputField
                name="passwordAgain"
                value={this.state.message}
                type="password"
                placeholder="Password Again"
                error={this.checkError("passwordAgain")}
                onBlur={(event) => this.focusLostHandler(event)}
                onChange={(event) => this.changeHandler(event)}
              />
              <SubmitButton onClick={(event) => this.submitHandler(event)} />
            </form>
            <p className="text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
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

export default connect(mapStateToProps, { register })(Signup);
