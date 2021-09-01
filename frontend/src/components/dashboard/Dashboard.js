import React, { Component, Fragment, useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "../../styles.css";
import logo from "../logob.png";

import { getForms, deleteForm } from "../../actions/forms";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import { PlusIcon } from "@heroicons/react/solid";
import { XIcon } from "@heroicons/react/outline";
import { Dialog, Transition, Popover } from "@headlessui/react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteDialog: { isOpen: false, id: null },
      isDeleteConfirmed: false,
    };
  }

  static propTypes = {
    getForms: PropTypes.func.isRequired,
    forms: PropTypes.array.isRequired,
    deleteForm: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getForms();
  }

  onDelete = (id) => {
    this.openDeleteDialog({ isOpen: true, id: id });
  };

  openDeleteDialog = (val) => {
    this.setState({ deleteDialog: val });
  };

  closeDeleteDialog = () => {
    this.setState({ deleteDialog: { isOpen: false, id: null } });
  };

  confirmDelete = (id) => {
    this.props.deleteForm(id);
  };

  render() {
    const forms = this.props.forms.map((form) => (
      <FormTr key={form.id} form={form} onDelete={(id) => this.onDelete(id)} />
    ));
    return (
      <div>
        <Navbar />
        <div className="p-4 sm:px-12 sm:py-4">
          <div className="w-full">
            <div className="w-full sm:inline-block hidden px-2 sm:px-4 border-black">
              <span className="inline-block w-2/5">Name</span>
              <span className="inline-block w-2/5">Closing Date</span>
              <span className="inline-block w-1/5">State</span>
            </div>
            <div className="space-y-4">{forms}</div>
          </div>
          {!forms.length ? (
            <span className="inline-flex w-full mt-1 justify-center text-xl text-gray-600">
              It looks pretty empty here!
            </span>
          ) : (
            ""
          )}
          <div className="text-white rounded mt-2 bg-green-500 hover:bg-green-600 focus:bg-green-700">
            <Link to={"/create"} className="">
              <PlusIcon className="h-10 w-5 mx-auto" />
            </Link>
          </div>
        </div>
        <DeleteDialog
          confirm={(id) => this.confirmDelete(id)}
          deleteDialog={this.state.deleteDialog}
          onClose={() => this.closeDeleteDialog()}
        />
      </div>
    );
  }
}

class FormTr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShareOpen: false,
    };
  }

  closeModal() {
    this.setState({ isShareOpen: false });
  }

  openModal() {
    this.setState({ isShareOpen: true });
  }
  render() {
    return (
      <div className="flex flex-col bg-gray-100 shadow p-2 sm:p-4 rounded">
        <div className="flex flex-row flex-wrap w-full px-2">
          <div className="w-full sm:w-2/5 relative">
            <span className="w-2/5 sm:hidden inline-block">Name:</span>
            <span className="w-3/5 sm:w-full inline-block">
              {this.props.form.name}
            </span>
          </div>
          <div className="w-full sm:w-2/5 relative">
            <span className="w-2/5 sm:hidden inline-block">Close Date:</span>
            <span className="w-3/5 sm:w-full inline-block">
              {this.props.form.close_date ?? "-"}{" "}
            </span>
          </div>
          <div className="w-full sm:w-1/5 relative">
            <span className="w-2/5 sm:hidden inline-block">Status:</span>
            <span className="w-3/5 sm:w-full inline-block">
              {this.props.form.status ? "Active" : "Inactive"}{" "}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 sm:grid-rows-1 w-full mt-4 justify-around gap-y-2">
          <div className="flex justify-center">
            <Link
              to={"/create/" + this.props.form.id}
              className="btn bg-yellow-500 hover:bg-yellow-700 focus:bg-yellow-900"
            >
              Edit
            </Link>
          </div>
          <div className="flex justify-center">
            <Link
              to={"/dashboard/form/" + this.props.form.id}
              className="btn bg-green-500 hover:bg-green-700 focus:bg-green-900 truncate"
            >
              See Submissions
            </Link>
          </div>
          <div className="flex justify-center">
            <button
              className="btn bg-orange-500 hover:bg-orange-700 focus:bg-orange-900"
              onClick={() => this.openModal()}
            >
              Share
            </button>
          </div>
          <div className="flex justify-center">
            <button
              className="btn bg-red-500 hover:bg-red-700 focus:bg-red-900"
              onClick={() => this.props.onDelete(this.props.form.id)}
            >
              Delete
            </button>
          </div>
        </div>
        <ShareDialog
          isOpen={this.state.isShareOpen}
          onClose={() => this.closeModal()}
          shareLink={`https://formtime-app.herokuapp.com/submit/${this.props.form.id}`}
        />
      </div>
    );
  }
}

function ShareDialog(props) {
  let [copied, setCopied] = useState(0);
  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed bg-gray-600 bg-opacity-50 inset-0 z-10 overflow-y-auto"
          onClose={props.onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 pt-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex"
                >
                  <span className="flex-grow pt-3">Share Your Form</span>
                  <XIcon
                    className="h-5 w-5 text-black cursor-pointer"
                    onClick={props.onClose}
                  />
                </Dialog.Title>
                <div className="mt-4 flex flex-row gap-4">
                  <input
                    value={props.shareLink}
                    className={
                      "relative border z-10 appearance-none bg-transparent block w-full focus:ring-2 ring-opacity-50 focus:shadow-inner focus:outline-none px-1.5 py-1 rounded border-blue-500 ring-blue-500"
                    }
                    readOnly
                  />
                  <button
                    className="btn bg-green-500 hover:bg-green-600 focus:bg-green-700"
                    onClick={() => {
                      navigator.clipboard.writeText(props.shareLink);
                      setCopied(true);
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export function DeleteDialog(props) {
  return (
    <Transition appear show={props.deleteDialog.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => props.onClose()}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Confirm Delete
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this form and all submissions
                  related?
                </p>
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  className="justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={() => {
                    props.confirm(props.deleteDialog.id);
                    props.onClose();
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => props.onClose()}
                >
                  No
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

const mapStateToProps = (state) => ({
  forms: state.forms.forms,
});

export default connect(mapStateToProps, { getForms, deleteForm })(Dashboard);
