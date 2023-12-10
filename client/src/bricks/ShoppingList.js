import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faXmark,
  faArrowAltCircleRight,
  faFilterCircleXmark,
  faUsers,
  faListCheck,
  faCirclePlus,
  faSave,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { DataView } from "primereact/dataview";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Menubar } from "primereact/menubar";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ItemInput from "./ItemInput";
import { useNavigate } from "react-router-dom";

const mongoose = require("mongoose");
const newObjectId = new mongoose.Types.ObjectId();

const mockShoppingList = [
  {
    id: "657201251e3802c94b981ysw",
    name: "Sobotní párty",
    owner: "657201251e3802c94b981zip",
    members: [],
    items: [
      {
        name: "pivo",
        isSolved: false,
        id: "657201251e3802c94b981cet",
      },
      {
        name: "džus",
        isSolved: false,
        id: "657201251e3802c94b981bzm",
      },
    ],
    isArchived: false,
  },
  {
    id: "657201251e3802c94b981xse",
    name: "Nákup na středeční trénink",
    owner: "657201251e3802c94b981jiu",
    members: [],
    items: [
      {
        name: "pivo",
        isSolved: false,
        id: "657201251e3802c94b981vru",
      },
      {
        name: "džus",
        isSolved: false,
        id: "657201251e3802c94b981dgj",
      },
    ],
    isArchived: false,
  },
  {
    id: "657201251e3802c94b981mov",
    name: "Páteční oslava",
    owner: "657201251e3802c94b981bni",
    members: [],
    items: [
      {
        name: "pivo",
        isSolved: false,
        id: "657201251e3802c94b981sbzu",
      },
      {
        name: "džus",
        isSolved: false,
        id: "657201251e3802c94b981si",
      },
    ],
    isArchived: true,
  },
];

const mockUsers = [
  {
    email: "owner1@gmail.com",
    name: "Vémola Jon",
    id: "657201251e3802c94b981rvi",
  },
  {
    email: "member2@email.com",
    name: "Venca Potok",
    id: "657201251e3802c94b981nud",
  },
  {
    email: "member3@seznam.com",
    name: "Karel",
    id: "657201251e3802c94b981aft",
  },
];

let emptyMember = {
  email: "",
  name: "",
  id: "",
};

let emptyList = {
  id: "",
  name: "",
  owner: "",
  items: [],
  members: [],
  isArchived: "",
};

function ShoppingList() {
  const navigate = useNavigate();

  const [shoppingLists, setShoppingLists] = useState([]);
  const [originalShoppingLists, setOriginalShoppingLists] = useState([]);

  const [shoppingList, setShoppingList] = useState(emptyList);
  const [status, setStatus] = useState(null);

  const [users, setUsers] = useState(mockUsers);
  const [user, setUser] = useState(emptyMember);

  const [deleteShoppingListDialog, setDeleteShoppingListDialog] =
    useState(false);
  const [archiveShoppingListDialog, setArchiveShoppingListDialog] =
    useState(false);
  const [addShoppingListDialog, setAddShoppingListDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toast = useRef(null);
  const states = [
    { name: "All", code: "all" },
    { name: "Archived", code: "archived" },
  ];

  useEffect(() => {
    let _lists = mockShoppingList;
    setShoppingLists(_lists);
    setOriginalShoppingLists(_lists);
  }, []);

  const updateFilteredLists = (selectedStatus) => {
    if (selectedStatus === "all") {
      setShoppingLists(originalShoppingLists);
    } else if (selectedStatus === "archived") {
      const archivedLists = originalShoppingLists.filter(
        (list) => list.isArchived === true
      );
      setShoppingLists(archivedLists);
    }
  };

  const saveList = (values) => {
    if (user || user.id !== "") {
      setSubmitted(true);
      let _lists = [...shoppingLists];

      let _list = {
        id: newObjectId,
        name: values.name,
        isArchived: false,
        owner: user.id,
      };
      _lists.push(_list);

      toast.current.show({
        severity: "success",
        summary: "Úspěch",
        detail: `Seznam ${values.name} byl přidán`,
        life: 3000,
      });

      setShoppingLists(_lists);
      setOriginalShoppingLists(_lists); // Update originalShoppingLists when a new list is added
      setAddShoppingListDialog(false);
    } else {
      toast.current.show({
        severity: "danger",
        summary: "Chyba",
        detail: `Nejste přihlášen`,
        life: 3000,
      });
    }
  };

  const deleteShoppingList = () => {
    if (user.id !== shoppingList.owner) {
      // Display an error message
      toast.current.show({
        severity: "danger",
        summary: "Chyba",
        detail: `Nemáte oprávnění smazat položku: ${shoppingList.title}`,
        life: 3000,
      });
    } else {
      // Filter out the deleted list from both shoppingLists and originalShoppingLists
      let _lists = shoppingLists.filter((e) => e.id !== shoppingList.id);
      let _originalLists = originalShoppingLists.filter(
        (e) => e.id !== shoppingList.id
      );

      setShoppingLists(_lists);
      setOriginalShoppingLists(_originalLists);

      setDeleteShoppingListDialog(false);
      setShoppingList(emptyList);

      toast.current.show({
        severity: "success",
        summary: "Úspěch",
        detail: `Shoppist list ${shoppingList.name} was deleted`,
        life: 3000,
      });
    }
  };

  const archiveShoppingList = () => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === shoppingList.id ? { ...list, isArchived: true } : list
    );
    setShoppingLists(updatedLists);
    setArchiveShoppingListDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Úspěch",
      detail: `Shoppist list ${shoppingList.name} was archived`,
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => {
    if (user && user.id !== "") {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            label="New shopping list"
            severity="success"
            onClick={() => setAddShoppingListDialog(true)}
          />
        </div>
      );
    }
  };

  // pravý All/Archived filter
  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Dropdown
          placeholder="Filter"
          name="filter"
          inputId="filter"
          options={states}
          optionLabel="name"
          optionValue="code"
          value={status}
          onChange={(e) => {
            const selectedStatus = e.value;
            setStatus(selectedStatus);
            updateFilteredLists(selectedStatus);
          }}
        />
      </div>
    );
  };

  const confirmDeleteShoppingList = (l) => {
    setShoppingList(l);
    setDeleteShoppingListDialog(true);
  };

  const hideDeleteShoppingListDialog = () => {
    setDeleteShoppingListDialog(false);
  };

  const hideArchiveSchoppingListDialog = () => {
    setArchiveShoppingListDialog(false);
  };

  const hideAddShoppingListDialog = () => {
    setSubmitted(false);
    setAddShoppingListDialog(false);
  };

  const start = () => <p>Vývojový pomocný bar</p>;

  const end = () => (
    <Dropdown
      icon={<FontAwesomeIcon icon={faUsers} className="mr-1" />}
      value={user}
      onChange={(e) => {
        setUser(e.value);
      }}
      options={users}
      optionLabel="email"
      placeholder="Log in"
      className="w-full md:w-14rem"
    />
  );

  const deleteShoppingListDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={() => setDeleteShoppingListDialog(false)}
      />
      <Button
        label="Yes"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteShoppingList}
      />
    </React.Fragment>
  );

  const archiveShoppingListDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={() => setArchiveShoppingListDialog(false)}
      />
      <Button
        label="Yes"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={archiveShoppingList}
      />
    </React.Fragment>
  );
  const header = (l) => (
    <div className="flex flex-wrap justify-content-end gap-2 ml-3 mt-1 mr-3">
      <Button
        icon={<FontAwesomeIcon icon={faFolderOpen} />}
        rounded
        text
        severity="secondary"
        onClick={() => setArchiveShoppingListDialog(true)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faTrash} />}
        rounded
        text
        severity="danger"
        onClick={() => confirmDeleteShoppingList(l)}
      />
    </div>
  );

  //  ZDE BUDE REDIRECT NA DETAIL
  const footer = (l) => (
    <div className="flex flex-wrap  gap-2">
      <Button
        label="Open"
        severity="info"
        onClick={() => {
          // Redirect to the detail page with the list id
          navigate(`/${l.id}`);
        }}
      />
    </div>
  );

  // const getOwner = (owner) => {
  //   const index = users.findIndex((e) => e.id === owner);
  ////    return users[index].email;
  // };

  const getShoppingList = (list) => {
    return (
      <div className="card flex justify-content-center m-3">
        <Card
          title={list.name}
          footer={footer(list)}
          header={header(list)}
          className="md:w-20rem"
        ></Card>
      </div>
    );
  };

  return (
    <div className="card">
      <Menubar title="Shopping List" start={start} end={end} />
      <div className="flex grid m-5 justify-content-center grid">
        <Toast ref={toast} />
        <br />
        <div className="col-12">
          <Toolbar
            className="mb-4"
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          />
        </div>
        <DataView
          value={shoppingLists} // Update to use filtered shoppingLists
          layout="grid"
          itemTemplate={getShoppingList}
        />
      </div>

      <Dialog
        visible={addShoppingListDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="New shopping list"
        modal
        className="p-fluid"
        onHide={hideAddShoppingListDialog}
      >
        <Formik
          initialValues={{
            owner: user.owner,
            members: [],
            items: [],
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, "Must contain atleast 3 characters")
              .required("Required"),
            items: Yup.string("Required").min(3, "Required").required(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              saveList(values);
              setSubmitted(false);
              setSubmitting(false);
            }, 500);
          }}
        >
          {(formik) => (
            <div className="flex card justify-content-center">
              <Form className="flex flex-column gap-2">
                <ItemInput id="name" name="name" label="Name" />
                <ItemInput id="items" name="items" label="Items" />

                <MultiSelect
                  id="user"
                  name="user"
                  value={formik.values.members}
                  onChange={(e) => {
                    formik.setFieldValue("members", e.value);
                  }}
                  options={users}
                  optionLabel="email"
                  display="chip"
                  placeholder="Choose members"
                  maxSelectedLabels={50}
                  className="w-full md:w-20rem"
                />
                <Button
                  type="submit"
                  severity="success"
                  icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
                  label="Save"
                />
              </Form>
            </div>
          )}
        </Formik>
      </Dialog>

      <Dialog
        visible={archiveShoppingListDialog}
        style={{ width: "36rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmation"
        modal
        footer={archiveShoppingListDialogFooter}
        onHide={hideArchiveSchoppingListDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {shoppingList && (
            <span>
              Are you sure you wanna archive a shopping list{" "}
              <b>{shoppingList.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteShoppingListDialog}
        style={{ width: "36rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmation"
        modal
        footer={deleteShoppingListDialogFooter}
        onHide={hideDeleteShoppingListDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {shoppingList && (
            <span>
              Are you sure you wanna delete a shopping list{" "}
              <b>{shoppingList.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default ShoppingList;
