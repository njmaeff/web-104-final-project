import "https://unpkg.com/react@17/umd/react.production.min.js";
import "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js";
import "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore-compat.js";
import DatePicker from "/js/date-picker.js";
import * as popper from "/js/react-popper.js";
import * as formik from "/js/formik.js";

const React = window.React;
const {
  useEffect,
  useState,
  useRef,
  createElement,
  forwardRef,
  useContext,
  useCallback,
  useLayoutEffect,
  useReducer,
  useMemo,
  useDebugValue,
  useImperativeHandle,
  lazy,
  Component,
  createContext,
  Children,
} = React;

const ReactDOM = window.ReactDOM;
const {
  render,
  createPortal,
  findDOMNode,
  version,
  flushSync,
  hydrate,
  unmountComponentAtNode,
} = ReactDOM;

var firebase = window.firebase;

const connectAuth = ({
  apiKey = "AIzaSyC90XiTl038eyaRwSOmTlM5746yJv39tDQ",
  projectId = "web-104-final-project",
  authDomain = "web-104-final-project.firebaseapp.com",
  emulatorHost = "",
} = {}) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey,
      authDomain,
      projectId,
    });
  }

  const auth = firebase.auth();
  if (!!emulatorHost) {
    auth.useEmulator(`http://${emulatorHost}`);
  }
  return auth;
};

const connectFirestore = ({
  apiKey = "AIzaSyC90XiTl038eyaRwSOmTlM5746yJv39tDQ",
  projectId = "web-104-final-project",
  authDomain = "web-104-final-project.firebaseapp.com",
  emulatorHost = "",
} = {}) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey,
      authDomain,
      projectId,
    });
  }

  const firestore = firebase.firestore();
  if (!!emulatorHost) {
    const url = new URL(`http://${emulatorHost}`);
    firestore.useEmulator(url.hostname, parseInt(url.port));
  }
  return firestore;
};

const auth = connectAuth();
const db = connectFirestore();

const RouterContext = /*#__PURE__*/ React.createContext({});

const RouterProvider = ({ children, routes }) => {
  const routeMap = new Map(routes);
  const DefaultComponent = routeMap.get("/");
  const [{ Component }, updateComponent] = useState({
    Component: DefaultComponent,
  });

  const navigate = (opts) => {
    // use last component if the url doesn't match
    let nextComponent = Component;
    for (const [key, value] of routeMap.entries()) {
      if (key === opts.to || (key instanceof RegExp && key.test(opts.to))) {
        nextComponent = value;
        break;
      }
    }

    updateComponent({
      Component: nextComponent,
    });
  };

  return /*#__PURE__*/ React.createElement(
    RouterContext.Provider,
    { value: { navigate, Component } },
    children
  );
};

function useRouter() {
  return useContext(RouterContext);
}

const Loader = () =>
  /*#__PURE__*/
  React.createElement(
    "div",
    { className: "loader-container" } /*#__PURE__*/,
    React.createElement("div", { className: "loader" })
  );

class FirestoreProvider {
  async write(document) {
    const docRef = this.collection.doc(this.id?.() ?? document.id);
    await docRef.set(document, { merge: true });
    return docRef;
  }

  async read(id = this.id?.()) {
    const ref = await this.collection.doc(id).get();
    return this.process(ref);
  }

  deleteDoc(id = this.id?.()) {
    return this.collection.doc(id).delete();
  }

  async readFromCollection() {
    const result = await this.collection.get();
    return result.docs.map((doc) => this.process(doc));
  }

  async query(...queries) {
    const result = queries.reduce((acc, query) => {
      return acc.where(...query);
    }, this.collection);
    const snapShot = await result.get();
    return snapShot.docs.map((doc) => this.process(doc));
  }

  queryType(type, ...queries) {
    return this.query(["type", "==", type], ...queries);
  }

  /**
   * Helper to turn firestore timestamps into date objects and merge the id
   * with the document
   * @param doc
   * @private
   */
  process(doc) {
    return { ...doc.data(), id: doc.id };
  }

  constructor(db, paths, id) {
    this.db = db;
    this.paths = paths;
    this.id = id;
  }

  get collection() {
    return this.db.collection(this.paths().join("/"));
  }
}

const useAsync = (fn, { init = null, deps = undefined } = {}) => {
  const [data, update] = useState(init);
  const [loaded, load] = useState(false);

  useEffect(() => {
    load(false);
    Promise.resolve(fn(data)).then((result) => {
      if (result) {
        update(result);
      }
      load(true);
    });
  }, deps);

  return [data, { loaded }];
};

const Timestamp = firebase.firestore.Timestamp;

/**
 * Helper function to compose paths to documents stored in collections.
 * @param paths
 */
const makeUserPath = (...paths) => ["users", ...paths];

const makeAsyncCallbackHook = (fn) => {
  const [state, update] = useState();

  const hook = (...args) =>
    fn(...args).then((result) => {
      update(result);
      return result;
    });

  return [state, hook];
};

/**
 * Base class for building react hooks using firebase and wrapping the firebase
 * api for upgrading the sdk in the future
 */
class Firestore extends FirestoreProvider {
  useWrite = () =>
    makeAsyncCallbackHook(async (document) => this.write(document));

  useRead = (id = this.id?.()) =>
    useAsync(() => this.read(id), {
      deps: [],
    });

  useDeleteDoc = () =>
    makeAsyncCallbackHook((id = this.id?.()) => this.deleteDoc(id));

  useReadFromCollection = (init = []) =>
    useAsync(() => this.readFromCollection(), { init, deps: [] });

  fromSubCollection(name, id = this.id?.()) {
    return new Firestore(this.db, () => [...this.paths(), id, name]);
  }

  withID(id) {
    return new Firestore(
      this.db,
      () => this.paths(),
      () => id
    );
  }
}

class UserProvider extends Firestore {
  constructor() {
    super(
      db,
      () => makeUserPath(),
      () => auth.currentUser.uid
    );
  }
}

const user = new UserProvider();
const useEmployer = () => user.fromSubCollection("employers");

class EmployerCollection {
  static fromID(id) {
    return new EmployerCollection(id);
  }

  constructor(id) {
    this.id = id;
  }

  get roles() {
    return this.employer.withID(this.id).fromSubCollection("roles");
  }

  get review() {
    return this.employer.withID(this.id).fromSubCollection("review");
  }

  get rate() {
    return this.employer.withID(this.id).fromSubCollection("rate");
  }

  employer = useEmployer();
}

const ensureDate = (date) => {
  if (date instanceof Timestamp) {
    return date.toDate();
  } else {
    return date;
  }
};

const isDateLike = (date) => {
  return date instanceof Timestamp || date instanceof Date;
};

const PageCtx = /*#__PURE__*/ React.createContext({});

const useMetaApi = () => {
  const [data, updateData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // initialize context data. Get the current employer id and role id
    const action = async () => {
      const metaData = await user.read();
      if (metaData.currentEmployerID) {
        await updateEmployer(metaData.currentEmployerID);
      } else {
        newEmployer();
      }
    };
    action().catch((e) => console.error(e));
  }, []);

  const updateEmployer = async (id) => {
    setLoading(true);
    const employerDoc = await useEmployer().read(id);
    const allRolesForCurrentEmployer = await EmployerCollection.fromID(
      id
    ).roles.readFromCollection();
    const currentRoleID = allRolesForCurrentEmployer[0]?.id ?? "";

    await user.write({
      currentEmployerID: employerDoc.id,
      currentRoleID: currentRoleID,
    });

    const allEmployers = await useEmployer().readFromCollection();

    updateData({
      currentEmployerID: id,
      allEmployers,
      currentEmployer: employerDoc,
      currentRoleID,
    });

    setLoading(false);
  };

  const newEmployer = () => {
    setLoading(true);
    updateData({
      currentEmployerID: "",
      currentRoleID: "",
      allEmployers: [],
      currentEmployer: {
        name: "",
        location: "",
      },
    });

    setLoading(false);
  };

  const updateRole = (id) => {
    updateData((prev) => ({
      ...prev,
      currentRoleID: id,
    }));
  };

  const newRole = () => {
    updateData((prev) => ({
      ...prev,
      currentRoleID: "",
    }));
  };

  return [
    data,
    {
      updateEmployer,
      updateRole,
      newEmployer,
      newRole,
    },

    loading,
  ];
};
const PageCtxProvider = ({ children }) => {
  const [meta, api, loading] = useMetaApi();

  return !loading /*#__PURE__*/
    ? React.createElement(
        PageCtx.Provider,
        { value: { ...meta, api, user: auth.currentUser } },
        children
      ) /*#__PURE__*/
    : React.createElement(Loader, null);
};
const usePageCtx = () => {
  return useContext(PageCtx);
};

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

const Link = ({
  children,
  onClick,
  params,
  disabled,
  className = "",
  ...props
}) => {
  const { navigate } = useRouter();

  return /*#__PURE__*/ React.createElement(
    "a",
    _extends({}, props, {
      className: `${className} ${disabled ? "link-disabled" : ""}`,
      onClick: (e) => {
        e.preventDefault();
        if (!disabled) {
          navigate({ to: props.href, params: params });
          onClick?.(e);
        }
      },
    }),

    children
  );
};

const DropDownWindow = ({
  referenceElement,
  referenceContainer,
  setReferenceContainer,
  close,
  children,
}) => {
  const { styles, attributes } = popper.usePopper(
    referenceElement,
    referenceContainer,
    {
      placement: "bottom",
      modifiers: [
        {
          name: "hide",
        },
      ],
    }
  );

  return /*#__PURE__*/ React.createElement(
    "div",
    _extends(
      {
        className: "control-dropdown-container",
        ref: setReferenceContainer,
        style: styles.popper,
      },
      attributes.popper
    ),

    children
  );
};

const DropDown = ({ current, children, headingType = "p" }) => {
  const [isToggled, toggle] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperContainer, setPopperContainer] = useState(null);

  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "control-dropdown",
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          toggle(false);
        }
      },
    } /*#__PURE__*/,

    React.createElement(
      "button",
      {
        className: "control-dropdown__toggle",
        ref: setReferenceElement,
        onClick: () => {
          toggle(!isToggled);
        },
      },

      headingType === "h3"
        ? /*#__PURE__*/ React.createElement("h3", null, current)
        : /*#__PURE__*/ React.createElement("p", null, current) /*#__PURE__*/,
      React.createElement("span", { className: "icon-angle-down" }),
      isToggled /*#__PURE__*/
        ? React.createElement(
            DropDownWindow,
            {
              referenceElement: referenceElement,
              referenceContainer: popperContainer,
              setReferenceContainer: setPopperContainer,
              close: () => toggle(false),
            },

            children
          )
        : null
    )
  );
};
const DropDownElement = (props) => {
  return /*#__PURE__*/ React.createElement(
    "div",
    null /*#__PURE__*/,
    React.createElement(
      Link,
      {
        href: props.href,
        onClick: props.onClick,
        params: props.params,
      },

      props.children
    )
  );
};

const TextInput = ({
  width,
  height,
  heading,
  value,
  readonly,
  onChange,
  name,
  error,
}) => {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: `input-text ${!readonly ? "input-text__write-mode" : ""}`,
      style: { width, height },
    } /*#__PURE__*/,

    React.createElement("h2", null, heading),
    readonly /*#__PURE__*/
      ? React.createElement("p", null, value) /*#__PURE__*/
      : React.createElement("textarea", {
          className: error ? "border-highlight__primary" : "",
          name: name,
          onChange: onChange,
          value: value,
        })
  );
};

const FieldInputRowWrapper = ({ heading, children }) => {
  return /*#__PURE__*/ React.createElement(
    "div",
    { className: "text-paragraph field-input-row" } /*#__PURE__*/,
    React.createElement("h4", null, heading),
    children
  );
};

const FieldInputRow = ({ heading, readonly, onChange, value, name, error }) => {
  return /*#__PURE__*/ React.createElement(
    FieldInputRowWrapper,
    { heading: heading },
    readonly /*#__PURE__*/
      ? React.createElement("p", null, value) /*#__PURE__*/
      : React.createElement("input", {
          className: error ? "border-highlight__primary" : "",
          type: "text",
          name: name,
          onChange: onChange,
          value: value,
        })
  );
};

const FieldDatePickerRow = ({
  value,
  onChange,
  readonly,
  name,
  heading,
  error,
}) => {
  const date = ensureDate(value);
  return /*#__PURE__*/ React.createElement(
    FieldInputRowWrapper,
    { heading: heading },
    readonly /*#__PURE__*/
      ? React.createElement(
          "p",
          null,
          date.toLocaleString("en", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        ) /*#__PURE__*/
      : React.createElement(DatePicker, {
          className: error ? "border-highlight__primary" : "",
          name: name,
          readOnly: readonly,
          selected: date,
          onChange: onChange,
        })
  );
};

const FieldDateTimePickerRow = ({
  value,
  onChange,
  readonly,
  name,
  heading,
  error,
}) => {
  const date = ensureDate(value);
  return /*#__PURE__*/ React.createElement(
    FieldInputRowWrapper,
    { heading: heading },
    readonly /*#__PURE__*/
      ? React.createElement("p", null, date.toLocaleString()) /*#__PURE__*/
      : React.createElement(DatePicker, {
          className: error ? "border-highlight__primary" : "",
          name: name,
          readOnly: readonly,
          selected: date,
          onChange: onChange,
          showTimeSelect: true,
          dateFormat: "MMMM d, yyyy h:mm aa",
        })
  );
};

const FieldDropDownInput = ({
  value,
  onChange,
  readonly,
  name,
  heading,
  error,
  children,
}) => {
  return /*#__PURE__*/ React.createElement(
    FieldInputRowWrapper,
    { heading: heading },
    readonly /*#__PURE__*/
      ? React.createElement(
          DropDown,
          { current: value },
          children
        ) /*#__PURE__*/
      : React.createElement("input", {
          className: error ? "border-highlight__primary" : "",
          type: "text",
          name: name,
          onChange: onChange,
          value: value,
        })
  );
};

const FieldTable = ({ heading, children }) => {
  return /*#__PURE__*/ React.createElement(
    "div",
    { className: "field-input" },
    heading &&
      /*#__PURE__*/ React.createElement(
        "h3",
        { className: "text-section" },
        heading
      ),
    children
  );
};

const MenuTemplate = ({
  children,
  currentEmployer,
  heading,
  allEmployers,
  isValid,
  isEdit,
  onClickEdit,
  onClickSave,
  disableNavigation,
  editAllParams = {},
  isLoading,
}) => {
  const [isSaving, setSaveState] = useState(false);
  const { api } = usePageCtx();

  return /*#__PURE__*/ React.createElement(
    "div",
    { className: `page` } /*#__PURE__*/,
    React.createElement(
      "header",
      null /*#__PURE__*/,
      React.createElement(
        "nav",
        null /*#__PURE__*/,
        React.createElement(
          "div",
          { className: "header-control" } /*#__PURE__*/,
          React.createElement("h2", null, heading) /*#__PURE__*/,
          React.createElement(
            DropDown,
            {
              current: currentEmployer?.name,
              headingType: "h3",
            } /*#__PURE__*/,

            React.createElement(
              DropDownElement,
              {
                href: `/`,
                onClick: () => {
                  api.newEmployer();
                },
              },
              "Create New"
            ),

            allEmployers
              .filter((employer) => employer.id !== currentEmployer.id)
              .map((employer /*#__PURE__*/) =>
                React.createElement(
                  DropDownElement,
                  {
                    key: employer.id,
                    href: `/api?employer=${employer.id}`,
                    onClick: () => api.updateEmployer(employer.id),
                  },

                  employer.name
                )
              )
          )
        ) /*#__PURE__*/,

        React.createElement(Link, {
          href: "/profile",
          className: "icon-settings",
        })
      )
    ),

    isSaving || isLoading /*#__PURE__*/
      ? React.createElement(
          "main",
          null /*#__PURE__*/,
          React.createElement(Loader, null)
        ) /*#__PURE__*/
      : React.createElement("main", null, children) /*#__PURE__*/,

    React.createElement(
      "footer",
      null /*#__PURE__*/,
      React.createElement(
        "nav",
        null /*#__PURE__*/,
        React.createElement(
          "div",
          { className: `footer-control-feature` } /*#__PURE__*/,
          React.createElement("button", {
            className: `icon-logo   ${
              isEdit && isValid
                ? "border-highlight__success"
                : isEdit && !isValid
                ? "border-highlight__primary"
                : ""
            }`,
            type: "button",
            onClick: () => {
              if (isEdit && isValid) {
                setSaveState(true);
                Promise.resolve(onClickSave?.())
                  .then(() => {
                    setSaveState(false);
                  })
                  .catch((e) => {
                    setSaveState(false);
                    throw e;
                  });
              } else if (!isEdit) {
                onClickEdit?.();
              }
            },
          })
        ) /*#__PURE__*/,

        React.createElement(
          "div",
          { className: "footer-control" } /*#__PURE__*/,
          React.createElement(Link, {
            href: "/",
            className: "icon-home",
            disabled: disableNavigation,
          }) /*#__PURE__*/,

          React.createElement(Link, {
            href: "/edit",
            params: editAllParams,
            className: "icon-edit",
            disabled: disableNavigation,
          })
        ) /*#__PURE__*/,

        React.createElement(
          "div",
          { className: "footer-control" } /*#__PURE__*/,
          React.createElement(Link, {
            href: "/review",
            className: "icon-review",
            disabled: disableNavigation,
          }) /*#__PURE__*/,

          React.createElement(Link, {
            href: "/rate/success",
            className: "icon-rate",
            disabled: disableNavigation,
          })
        )
      )
    )
  );
};

let PageStatus;
(function (PageStatus) {
  PageStatus[(PageStatus["EDIT"] = 0)] = "EDIT";
  PageStatus[(PageStatus["VIEW"] = 1)] = "VIEW";
  PageStatus[(PageStatus["NEW"] = 2)] = "NEW";
})(PageStatus || (PageStatus = {}));

const validate = (values) => {
  // default check for empty values
  let errors = {};
  for (const [key, value] of Object.entries(values)) {
    if (!value) {
      errors[key] = true;
    }
  }

  return errors;
};

const useFormWithStatus = ({ onSubmit, ...config }) => {
  const form = formik.useFormik({
    initialStatus: PageStatus.VIEW,
    initialErrors: validate(config.initialValues),
    validate,
    onSubmit: async (values, helpers) => {
      if (form.dirty) {
        await onSubmit(values, helpers);
      } else {
        setView();
      }
    },
    ...config,
  });

  const isReadonly = form.status === PageStatus.VIEW;
  const isNew = form.status === PageStatus.NEW;
  const isEdit = form.status === PageStatus.EDIT || isNew;

  const setEdit = () => form.setStatus(PageStatus.EDIT);
  const setView = () => form.setStatus(PageStatus.VIEW);
  const setNew = () => form.setStatus(PageStatus.NEW);

  const fieldProps = {};

  for (const [key, value] of Object.entries(config.initialValues)) {
    const props = form.getFieldProps(key);
    if (isDateLike(value)) {
      props.onChange = (date) => {
        form.setFieldValue(key, date);
      };
    }

    fieldProps[key] = {
      ...props,
      error: form.errors[key],
      touched: form.touched[key],
      readonly: isReadonly,
    };
  }

  return [
    form,
    {
      isReadonly,
      isEdit,
      isNew,
      setEdit,
      setView,
      setNew,
      fieldProps,
      mainProps: {
        isEdit,
        isNew,
        isReadonly,
        onClickEdit: setEdit,
        onClickSave: form.handleSubmit,
        isValid: form.isValid,
      },
    },
  ];
};

const mergeForms = (...forms) => {
  const mainForms = forms.map(([_, form]) => form.mainProps);
  const mainProps = {
    isEdit: mainForms.some((form) => form.isEdit || form.isNew),
    isValid: mainForms.every((form) => (form.isEdit ? form.isValid : true)),
    onClickEdit: () => mainForms.map((form) => form.onClickEdit()),
    onClickSave: (e) => {
      const run = async () => {
        const result = [];
        for (const form of mainForms) {
          result.push(await form.onClickSave(e));
        }

        return result;
      };
      return run();
    },
  };

  return [mainProps, ...forms];
};

const RateSuccessPage = () => {
  const { currentEmployerID, currentEmployer, allEmployers } = usePageCtx();
  const [formik, { fieldProps, mainProps }] = useFormWithStatus({
    initialValues: {
      date: new Date(),
      value: "",
      situation: "",
      result: "",
    },

    initialStatus: PageStatus.EDIT,
    onSubmit: async (values) => {
      await EmployerCollection.fromID(currentEmployerID)
        .roles.withID(currentEmployerID)
        .fromSubCollection("rate")
        .write({
          ...values,
          type: "success",
        });

      formik.resetForm({
        values: formik.initialValues,
      });
    },
  });

  return /*#__PURE__*/ React.createElement(
    RateYourselfTemplate,
    {
      success: true,
      currentEmployer: currentEmployer,
      allEmployers: allEmployers,
      menuProps: mainProps,
      heading: "Rate - Success",
    } /*#__PURE__*/,

    React.createElement(
      FieldTable,
      null /*#__PURE__*/,
      React.createElement(
        FieldDateTimePickerRow,
        _extends({ heading: "Date" }, fieldProps.date)
      ) /*#__PURE__*/,
      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Estimated Value",
          },
          fieldProps.value
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      TextInput,
      _extends({ heading: "Situation" }, fieldProps.situation)
    ) /*#__PURE__*/,
    React.createElement(
      TextInput,
      _extends({ heading: "Result" }, fieldProps.result)
    )
  );
};
const RateIssuePage = () => {
  const { currentEmployerID, currentEmployer, allEmployers } = usePageCtx();

  const [formik, { fieldProps, mainProps }] = useFormWithStatus({
    initialValues: {
      date: new Date(),
      value: "",
      situation: "",
      result: "",
      correction: "",
    },

    initialStatus: PageStatus.EDIT,
    onSubmit: async (values) => {
      await EmployerCollection.fromID(currentEmployerID)
        .roles.withID(currentEmployerID)
        .fromSubCollection("rate")
        .write({
          ...values,
          type: "issue",
        });

      formik.resetForm({
        values: formik.initialValues,
      });
    },
  });

  return /*#__PURE__*/ React.createElement(
    RateYourselfTemplate,
    {
      currentEmployer: currentEmployer,
      allEmployers: allEmployers,
      issue: true,
      menuProps: mainProps,
      heading: "Rate - Issue",
    } /*#__PURE__*/,

    React.createElement(
      FieldTable,
      null /*#__PURE__*/,
      React.createElement(
        FieldDateTimePickerRow,
        _extends({ heading: "Date" }, fieldProps.date)
      ) /*#__PURE__*/,
      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Estimated Value",
          },
          fieldProps.value
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      TextInput,
      _extends({ heading: "Situation" }, fieldProps.situation)
    ) /*#__PURE__*/,
    React.createElement(
      TextInput,
      _extends({ heading: "Result" }, fieldProps.result)
    ) /*#__PURE__*/,
    React.createElement(
      TextInput,
      _extends({ heading: "Correction" }, fieldProps.correction)
    )
  );
};
const RateYourselfTemplate = ({
  currentEmployer,
  allEmployers,
  children,
  issue,
  success,
  menuProps,
  heading,
}) => {
  return /*#__PURE__*/ React.createElement(
    MenuTemplate,
    _extends(
      {
        currentEmployer: currentEmployer,
        heading: heading,
        allEmployers: allEmployers,
      },
      menuProps
    ) /*#__PURE__*/,

    React.createElement(
      "div",
      { className: "page-rate-control" },
      children /*#__PURE__*/,
      React.createElement(
        "nav",
        null /*#__PURE__*/,
        React.createElement(Link, {
          href: "/rate/success",
          className: `icon-award ${success ? "icon-highlight__primary" : ""}`,
        }) /*#__PURE__*/,

        React.createElement(Link, {
          href: "/rate/issue",
          className: `icon-issue ${issue ? "icon-highlight__primary" : ""}`,
        })
      )
    )
  );
};

const ReviewPage = () => {
  const { currentEmployer, allEmployers, currentRoleID, currentEmployerID } =
    usePageCtx();
  const [formik, { mainProps, fieldProps }] = useFormWithStatus({
    initialValues: {
      date: new Date(),
      adjustedSalary: "",
      manager: "",
      outcome: "",
    },

    initialStatus: PageStatus.EDIT,
    onSubmit: async (values) => {
      await EmployerCollection.fromID(currentEmployerID)
        .roles.withID(currentRoleID)
        .fromSubCollection("review")
        .write(values);
      formik.resetForm({
        values: formik.initialValues,
      });
    },
  });

  return /*#__PURE__*/ React.createElement(
    MenuTemplate,
    _extends(
      {
        currentEmployer: currentEmployer,
        allEmployers: allEmployers,
        heading: "Review",
      },
      mainProps
    ) /*#__PURE__*/,

    React.createElement(
      FieldTable,
      null /*#__PURE__*/,
      React.createElement(
        FieldDateTimePickerRow,
        _extends({ heading: "Date" }, fieldProps.date)
      ) /*#__PURE__*/,
      React.createElement(
        FieldInputRow,
        _extends({ heading: "Manager" }, fieldProps.manager)
      ) /*#__PURE__*/,
      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Adjusted Salary",
          },
          fieldProps.adjustedSalary
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      TextInput,
      _extends({ heading: "Outcome" }, fieldProps.outcome)
    )
  );
};

const MainPage = () => {
  const {
    currentEmployerID,
    currentRoleID,
    allEmployers,
    currentEmployer,
    api,
  } = usePageCtx();

  const emptyRole = {
    allRolesForEmployer: [],
    currentRole: {
      name: "",
      startDate: new Date(),
      salary: "",
      skillTarget: "",
      salaryTarget: "",
      responsibilities: "",
    },
  };

  const isNewEmployer = !currentEmployerID;
  const isNewRole = !currentRoleID || isNewEmployer;

  const employer = useEmployer();
  const [mainProps, [employerFormik, employerForm], [roleFormik, roleForm]] =
    mergeForms(
      useFormWithStatus({
        initialValues: currentEmployer,
        initialStatus: isNewEmployer ? PageStatus.EDIT : PageStatus.VIEW,
        onSubmit: async (values) => {
          employerForm.setView();

          const ref = await employer.write(values);
          await api.updateEmployer(ref.id);
        },
      }),

      useFormWithStatus({
        initialValues: emptyRole.currentRole,
        initialStatus: isNewEmployer
          ? PageStatus.VIEW
          : isNewRole
          ? PageStatus.EDIT
          : PageStatus.VIEW,
        onSubmit: async (values) => {
          roleForm.setView();
          const ref = await EmployerCollection.fromID(
            currentEmployerID
          ).roles.write(values);
          await api.updateRole(ref.id);
        },
      })
    );

  useEffect(() => {
    if (isNewEmployer) {
      employerFormik.setValues(currentEmployer);
      employerForm.setEdit();
      roleForm.setView();
    } else {
      employerForm.setView();
    }
  }, [currentEmployerID]);

  const [{ allRolesForEmployer }, { loaded }] = useAsync(
    async () => {
      if (!currentRoleID) {
        roleFormik.resetForm({ values: { ...emptyRole.currentRole } });
        if (!isNewEmployer) {
          roleForm.setEdit();
        }
        return { ...emptyRole };
      } else {
        const role = EmployerCollection.fromID(currentEmployerID).roles;
        const allRolesForEmployer = await role.readFromCollection();
        const currentRole = await role.read(currentRoleID);
        await roleFormik.setValues(currentRole);

        return {
          currentRole,
          allRolesForEmployer,
        };
      }
    },
    {
      deps: [currentRoleID],
      init: emptyRole,
    }
  );

  return /*#__PURE__*/ React.createElement(
    MenuTemplate,
    _extends(
      {
        currentEmployer: isNewEmployer
          ? { name: "New Employer" }
          : currentEmployer,

        heading: "Above and Beyond",
        allEmployers: allEmployers,
        disableNavigation: isNewRole,
        isLoading: !loaded,
      },
      mainProps
    ) /*#__PURE__*/,

    React.createElement(
      FieldTable,
      null /*#__PURE__*/,
      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Organization Name",
          },
          employerForm.fieldProps.name
        )
      ) /*#__PURE__*/,

      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Location",
          },
          employerForm.fieldProps.location
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      FieldTable,
      null /*#__PURE__*/,
      React.createElement(
        FieldDropDownInput,
        _extends(
          {
            heading: "Role",
          },
          roleForm.fieldProps.name
        ),

        !isNewEmployer /*#__PURE__*/ &&
          React.createElement(
            DropDownElement,
            {
              href: `/api?role=`,
              onClick: () => {
                api.newRole();
              },
            },
            "Create New"
          ),

        allRolesForEmployer
          .filter((role) => role.id !== currentRoleID)
          .map((role /*#__PURE__*/) =>
            React.createElement(
              DropDownElement,
              {
                key: role.id,
                href: `/api?role=${role.id}`,
                onClick: () => api.updateRole(role.id),
              },

              role.name
            )
          )
      ) /*#__PURE__*/,

      React.createElement(
        FieldDatePickerRow,
        _extends(
          {
            heading: "Start Date",
          },
          roleForm.fieldProps.startDate
        )
      ) /*#__PURE__*/,

      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Current Salary",
          },
          roleForm.fieldProps.salary
        )
      ) /*#__PURE__*/,

      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Target Salary",
          },
          roleForm.fieldProps.salaryTarget
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      TextInput,
      _extends({}, roleForm.fieldProps.skillTarget, {
        height: "auto",
        heading: "Skills",
      })
    ) /*#__PURE__*/,

    React.createElement(
      TextInput,
      _extends({}, roleForm.fieldProps.responsibilities, {
        height: "auto",
        heading: "Responsibilities",
      })
    )
  );
};

const ProfilePage = () => {
  const { currentEmployer, user, allEmployers } = usePageCtx();
  const [form, { mainProps, ...userForm }] = useFormWithStatus({
    initialValues: {
      displayName: user.displayName,
      email: user.email,
    },

    onSubmit: async (values) => {
      const user = auth.currentUser;

      if (values.displayName !== user.displayName) {
        await user.updateProfile({
          displayName: values.displayName,
        });
      }
      if (values.email !== user.email) {
        await user.updateEmail(values.email);
      }

      form.resetForm({ values, status: PageStatus.VIEW });
    },
  });

  return /*#__PURE__*/ React.createElement(
    MenuTemplate,
    _extends(
      {
        currentEmployer: currentEmployer,
        allEmployers: allEmployers,
        heading: "Profile",
      },
      mainProps
    ) /*#__PURE__*/,

    React.createElement(
      FieldTable,
      null /*#__PURE__*/,
      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Name",
          },
          userForm.fieldProps.displayName
        )
      ) /*#__PURE__*/,

      React.createElement(
        FieldInputRow,
        _extends(
          {
            heading: "Email",
          },
          userForm.fieldProps.email
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      "button",
      {
        className: "primary",
        onClick: () => {
          auth.signOut().then(() => {
            window.location.href = "/index.html";
          });
        },
      },
      "Logout"
    ) /*#__PURE__*/,

    React.createElement(
      "a",
      { href: "/getting-started.html", className: "primary" },
      "About"
    )
  );
};

const EditPage = () => {
  const { allEmployers, currentEmployer } = usePageCtx();
  return /*#__PURE__*/ React.createElement(
    MenuTemplate,
    {
      currentEmployer: currentEmployer,
      heading: "Edit",
      allEmployers: allEmployers,
    },
    "Not Implemented"
  );
};

const Environment = ({ children }) => {
  return /*#__PURE__*/ React.createElement(
    RouterProvider,
    {
      routes: [
        ["/", MainPage],
        ["/profile", ProfilePage],
        ["/rate/success", RateSuccessPage],
        ["/rate/issue", RateIssuePage],
        ["/edit", EditPage],
        ["/review", ReviewPage],
      ],
    } /*#__PURE__*/,

    React.createElement(PageCtxProvider, null, children)
  );
};

const App = () => {
  const { Component } = useRouter();
  return /*#__PURE__*/ React.createElement(Component, null);
};

const Main = () =>
  /*#__PURE__*/
  React.createElement(
    Environment,
    null /*#__PURE__*/,
    React.createElement(App, null)
  );

const initApp = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(
      (user) => {
        if (!user) {
          // User is signed out. Redirect to login
          window.location.href = "/";
        }
        resolve(user);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

window.addEventListener("load", function () {
  initApp()
    .then(() =>
      render(
        /*#__PURE__*/ React.createElement(Main, null),
        document.getElementById("root")
      )
    )
    .catch((e) => console.error(e));
});
