import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alerts extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { alert, message } = this.props;

    if (message !== prevProps.message) {
      if (message.leadAdded) alert.success(message.leadAdded);
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
