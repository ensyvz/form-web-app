import React from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getFormForSubmission,
  submitSubmission,
} from "../../actions/submission";

class Form extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    getFormForSubmission: PropTypes.func.isRequired,
    submitSubmission: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
  };

  state = {
    details: [],
    currentCard: [],
    submission: { text_answers: [], number_answers: [] },
    answers: [],
  };

  componentDidMount() {
    this.props.getFormForSubmission(this.props.match.params.id);

    //Set first card
    this.setState({ currentCard: 0 });
  }

  componentDidUpdate() {
    if (
      !this.props.isLoading &&
      this.props.form.questions.length !== this.state.answers.length
    ) {
      this.setState({
        answers: this.props.form.questions.map((q) => ({
          question: q.id,
          answer: "",
        })),
      });
    }
  }

  clickHandler = (event) => {
    if (
      event.target.name === "next" &&
      this.state.currentCard !== this.props.form.questions.length - 1
    ) {
      this.setState({ currentCard: this.state.currentCard + 1 });
    } else if (
      event.target.name === "previous" &&
      this.state.currentCard !== 0
    ) {
      this.setState({ currentCard: this.state.currentCard - 1 });
    }
  };

  changeHandler = (event, questionId) => {
    event.preventDefault();
    let nam = event.target.name;
    let val = event.target.value;
    let answers = [...this.state.answers];

    answers.find((a) => a.question == questionId)[nam] = val;

    this.setState({ answers });
  };

  submitHandler = (event) => {
    event.preventDefault();
    let submission = { form: this.props.match.params.id };
    submission.text_answers = this.state.answers
      .filter(
        (a) =>
          this.props.form.questions.find((q) => q.id == a.question).data_type ==
          "text"
      )
      .map((a) => a);
    submission.number_answers = this.state.answers
      .filter(
        (a) =>
          this.props.form.questions.find((q) => q.id == a.question).data_type ==
          "number"
      )
      .map((a) => a);
    console.log(submission);
    this.props.submitSubmission(submission);
  };

  render() {
    if (this.props.isLoading || !this.state.answers.length) {
      return <h1>Loading</h1>;
    }
    if (!this.props.form.status) {
      return <span className="text-7xl">Form is Closed!</span>;
    }

    const cards =
      this.props.form.questions?.map((question) => (
        <Card
          value={this.state.answers.find(
            (answer) => answer.question === question.id
          )}
          type={question.data_type}
          question={question}
          onChange={(event, question) => this.changeHandler(event, question)}
        />
      )) ?? "";
    return (
      <form className="h-screen flex place-items-center bg-gradient-to-r from-formgr-start to-formgr-end">
        {!this.props.isSubmitted ? (
          <CurrentCard
            onClick={(event) => this.clickHandler(event)}
            isSubmit={
              this.state.currentCard !== this.props.form.questions.length - 1
            }
            onSubmit={(event) => this.submitHandler(event)}
          >
            {cards[this.state.currentCard]}
          </CurrentCard>
        ) : (
          <span className="text-5xl text-white mx-auto bg-green-600 p-8 rounded-lg">
            Form Submitted
          </span>
        )}
      </form>
    );
  }
}

class CurrentCard extends React.Component {
  render() {
    return (
      <div className="flex-1 flex-wrap flex-col mx-auto bg-white shadow-2xl rounded max-w-lg space-y-6 rounded-3xl">
        {this.props.children}
        <div className="divide-x-2 divide-white">
          <button
            name="previous"
            className="w-2/4 bl bg-yellow-400 text-white px-2 py-3 focus:ring ring-yellow-400 ring-opacity-50 rounded-bl-3xl"
            type="button"
            onClick={(event) => this.props.onClick(event)}
          >
            Previous
          </button>
          {this.props.isSubmit ? (
            <button
              name="next"
              className="w-2/4 bg-yellow-400 text-white px-2 py-3 focus:ring ring-yellow-400 ring-opacity-50 rounded-br-3xl"
              type="button"
              onClick={(event) => this.props.onClick(event)}
            >
              Next
            </button>
          ) : (
            <button
              name="submit"
              className="w-2/4 bg-green-400 text-white px-2 py-3 focus:ring ring-green-400 ring-opacity-50 rounded-br-3xl"
              type="button"
              onClick={(event) => this.props.onSubmit(event)}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    );
  }
}

class Card extends React.Component {
  render() {
    return (
      <div className="space-y-6">
        <div className="pt-6 px-8">
          <span className="text-xl font-medium">
            {this.props.question.title}
          </span>
        </div>
        <div className="px-8 flex">
          <input
            name="answer"
            value={this.props.value.answer}
            className="flex-1 border border-yellow-400 focus:ring ring-yellow-400 ring-opacity-50 focus:shadow-inner focus:outline-none px-1.5 py-1 rounded"
            type={this.props.type}
            onChange={(event) =>
              this.props.onChange(event, this.props.question.id)
            }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.submission.form,
  isLoading: state.submission.isLoading,
  isSubmitted: state.submission.isSubmitted,
});

export default connect(mapStateToProps, {
  getFormForSubmission,
  submitSubmission,
})(Form);
