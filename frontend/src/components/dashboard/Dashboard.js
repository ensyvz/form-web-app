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
        <div className="p-12">
          <table className="table w-full border-collapse">
            <thead className="border-b-4 border-black">
              <tr>
                <th>Name</th>
                <th>Closing Date</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>{forms}</tbody>
          </table>
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
  render() {
    return (
      <tr className="border-2 border-black rounded">
        <td>{this.props.form.name}</td>
        <td>{this.props.form.close_date ?? "-"}</td>
        <td>{this.props.form.status ? "Active" : "Inactive"}</td>
        <td className="flex justify-around">
          <Link
            to={"/create/" + this.props.form.id}
            className="btn bg-yellow-500 hover:bg-yellow-700 focus:bg-yellow-900 mr-2"
          >
            Edit
          </Link>
          <Link
            to={"/dashboard/form/" + this.props.form.id}
            className="btn bg-green-500 hover:bg-green-700 focus:bg-green-900"
          >
            See Submissions
          </Link>
          <CopyPopover value={`localhost:8000/submit/${this.props.form.id}`} />
          <button
            className="btn bg-red-500 hover:bg-red-700 focus:bg-red-900"
            onClick={() => this.props.onDelete(this.props.form.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

function CopyPopover(props) {
  const [copied, setCopied] = useState(0);
  return (
    <div className=" max-w-sm px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={
                "btn bg-orange-500 hover:bg-orange-700 focus:bg-orange-900"
              }
            >
              <span>Solutions</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-64 lg:w-96 max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative flex bg-white p-4 space-x-2">
                    <input
                      value={props.value}
                      className={
                        "relative border z-10 appearance-none bg-transparent block w-full focus:ring-2 ring-opacity-50 focus:shadow-inner focus:outline-none px-1.5 py-1 rounded border-blue-500 ring-blue-500"
                      }
                      readOnly
                    />
                    <button
                      className="btn bg-green-500 hover:bg-green-600 focus:bg-green-700"
                      onClick={() => {
                        navigator.clipboard.writeText(props.value);
                        setCopied(true);
                      }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
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
