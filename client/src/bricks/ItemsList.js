import React, { useState, useEffect, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { PickList } from "primereact/picklist";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { v4 as uuidv4 } from "uuid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faRotateBack,
  faPencil,
  faUsers,
  faUsersSlash,
  faSave,
  faTrashCan,
  faXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ShoppingListService } from "../Service";
import ItemInput from "./ItemInput";
import { Dropdown } from "primereact/dropdown";
import { Outlet } from "react-router-dom";

const mongoose = require("mongoose");
const newObjectId = new mongoose.Types.ObjectId();

//možná zbytené...?
const mockItems = [
  {
    name: "Párek",
    isSolved: false,
    id: "657201251e3802c94b981seg",
  },
  {
    name: "Okurka",
    isSolved: false,
    id: "657201251e3802c94b981swn",
  },
  {
    name: "Mouka",
    isSolved: false,
    id: "657201251e3802c94b981dri",
  },
  {
    name: "Pexeso",
    isSolved: false,
    id: "657201251e3802c94b981wip",
  },
];

const mockMembers = [
  {
    email: "member0@gmail.com",
    name: "karel omáčka",
    id: "657201251e3802c94b981ysw",
  },
  {
    email: "member4@gmail.com",
    name: "Anna Kloboučková",
    id: "657201251e3802c94b981evt",
  },
];

const mockUsers = [
  {
    email: "member1@gmail.com",
    name: "Arnold Klob",
    id: "657201251e3802c94b981hpy",
  },
  {
    email: "member2@gmail.com",
    name: "Anna Kloboučková",
    id: "657201251e3802c94b981sgr",
  },
  {
    email: "member3@gmail.com",
    name: "Klára Kloboučková",
    id: "657201251e3802c94b981bko",
  },
];

function ItemsList() {
  let emptyList = {
    id: "",
    name: "",
    isArchived: false,
    owner: "",
    items: [],
    members: [],
  };

  let emptyItem = {
    id: "",
    name: "",
    isSolved: false,
  };

  let emptyMember = {
    email: "",
    name: "",
    id: "",
  };

  const [items, setItems] = useState(mockItems);
  const [item, setItem] = useState(emptyItem);
  const [list, setList] = useState(emptyList);
  const [members, setMembers] = useState(mockMembers);
  const [users, setUsers] = useState(mockUsers);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [user, setUser] = useState(emptyMember);
  const [owner, setOwner] = useState(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [deleteMemberDialog, setDeleteMemberDialog] = useState(false);
  const [listTitleDialog, setListTitleDialog] = useState(false);
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [membersDialog, setMembersDialog] = useState(false);
  const [member, setMember] = useState(emptyMember);
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    setList(ShoppingListService.getShoppingList());
  }, []);

  useEffect(() => {
    setAvailableUsers(
      users.filter((obj) => !members.some(({ id }) => obj.id === id))
    );
  }, []);

  const deleteItem = () => {
    if (user.id !== item.owner) {
      toast.current.show({
        severity: "danger",
        summary: "Chyba",
        detail: `Nemáte oprávnění smazat položku: ${item.title}`,
        life: 3000,
      });
    } else {
      let _items = items.filter((e) => e.id !== item.id);
      setItems(_items);
      setDeleteItemDialog(false);
      setItem(emptyItem);
      toast.current.show({
        severity: "success",
        summary: "Úspěch",
        detail: `Položka ${item.title} byla smazána`,
        life: 3000,
      });
    }
  };

  const deleteMember = () => {
    let _members = members.filter((e) => e.id !== member.id);
    setMembers(_members);
    setDeleteMemberDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Úspěch",
      detail: `Byl jste odstraněn jako člen`,
      life: 3000,
    });
  };

  const saveListTitle = (values) => {
    setSubmitted(true);
    if (user.id !== list.owner) {
      toast.current.show({
        severity: "danger",
        summary: "Chyba",
        detail: `Nemáte oprávnění editovat název`,
        life: 3000,
      });
    } else {
      let _list = list;
      _list.title = values.title;
      setList(_list);
      toast.current.show({
        severity: "success",
        summary: "Úspěch",
        detail: `Nový název byl uložen.`,
        life: 3000,
      });
    }
    setListTitleDialog(false);
  };

  const saveItem = (values) => {
    setSubmitted(true);
    let _items = [...items];
    let _item = {
      id: newObjectId,
      name: values.name,
      owner: user.id,
    };
    _items.push(_item);
    toast.current.show({
      severity: "success",
      summary: "Úspěch",
      detail: `Položka ${values.name} byla přidána na seznam`,
      life: 3000,
    });

    setItems(_items);
    setAddItemDialog(false);
  };

  const confirmDeleteItem = (i) => {
    setItem(i);
    setDeleteItemDialog(true);
  };

  const confirmDeleteMember = (m) => {
    setMember(m);
    setDeleteMemberDialog(true);
  };

  const hideListTitleDialog = () => {
    setSubmitted(false);
    setListTitleDialog(false);
  };

  const hideAddItemDialog = () => {
    setSubmitted(false);
    setAddItemDialog(false);
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };

  const hideDeleteMemberDialog = () => {
    setDeleteMemberDialog(false);
  };

  const hideMembersDialog = () => {
    setMembersDialog(false);
  };

  const leftToolbarTemplate = () => {
    if (owner || members.find((member) => member.id === user.id))
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            label="New Item"
            severity="success"
            onClick={() => setAddItemDialog(true)}
          />
        </div>
      );
  };

  const rightToolbarTemplate = () => {
    if (owner) {
      return (
        <Button
          label="Členové"
          icon={<FontAwesomeIcon icon={faUsers} className="mr-1" />}
          className="p-button-help"
          onClick={() => setMembersDialog(true)}
        />
      );
    } else if (members.find((member) => member.id === user.id)) {
      return (
        <Button
          label="Odstranit se jako člen"
          icon={<FontAwesomeIcon icon={faUsersSlash} className="mr-1" />}
          className="p-button-help"
          onClick={() => confirmDeleteMember(user)}
        />
      );
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon={<FontAwesomeIcon icon={faRotateBack} />}
          rounded
          outlined
          className="mr-3"
          severity="warning"
        />
        <Button
          icon={<FontAwesomeIcon icon={faCheck} />}
          rounded
          outlined
          className="mr-3"
          severity="success"
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          rounded
          outlined
          visible={user.id === rowData.owner || owner}
          onClick={() => confirmDeleteItem(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="flex flex-wrap gap-2 align-items-center justify-content-start">
        <h4 className="m-0">{list.title}</h4>
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          rounded
          outlined
          className="m-0"
          severity="info"
          visible={owner}
          onClick={() => setListTitleDialog(true)}
        />
      </div>
      <div className="flex flex-wrap gap-2 align-items-center justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Hledat..."
          />
        </span>
      </div>
    </div>
  );

  const itemUserTemplate = (user) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-1">
        <FontAwesomeIcon
          className="w-1rem shadow-2 flex-shrink-0 border-round"
          icon={faUser}
        />
        <div className="flex-1 flex flex-column gap-1">
          <span>{user.email}</span>
        </div>
      </div>
    );
  };

  const deleteItemDialogFooter = (
    <React.Fragment>
      <Button
        label="Ne"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={() => setDeleteItemDialog(false)}
      />
      <Button
        label="Ano"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteItem}
      />
    </React.Fragment>
  );

  const deleteMemberDialogFooter = (
    <React.Fragment>
      <Button
        label="Ne"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={() => setDeleteMemberDialog(false)}
      />
      <Button
        label="Ano"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteMember}
      />
    </React.Fragment>
  );

  const onMemberChange = (event) => {
    setAvailableUsers(event.source);
    setMembers(event.target);
  };

  const statusBodyTemplate = (item) => {
    return (
      <Tag
        value={item.status}
        rounded
        severity={getSeverity(item.status)}
      ></Tag>
    );
  };

  const getSeverity = (item) => {
    switch (item) {
      case "done":
        return "success";

      case "new":
        return "info";

      case "cancelled":
        return "danger";

      default:
        return null;
    }
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} rounded severity={getSeverity(option)} />;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Vyberte..."
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div>
      <Outlet />
      <Toast ref={toast} />
      <br />
      <div className="card m-3 justify-content-center">
        <Toolbar
          className="mb-4"
          start={leftToolbarTemplate}
          end={rightToolbarTemplate}
        />

        <DataTable
          ref={dt}
          value={items}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          // paginator
          // rows={10}
          // rowsPerPageOptions={[5, 10, 25]}
          // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          // currentPageReportTemplate="Ukázka od {first} do {last} z celkem {totalRecords} položek"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="status"
            header="Stav"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
            filter
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            filterElement={statusRowFilterTemplate}
          ></Column>
          <Column
            field="title"
            header="Název"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="note"
            header="Poznámka"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="created_at"
            header="Datum"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={listTitleDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Změna názvu seznamu"
        placeholder={list.title}
        modal
        className="p-fluid"
        onHide={hideListTitleDialog}
      >
        <Formik
          initialValues={{
            id: list.id,
            title: list.title,
          }}
          validationSchema={Yup.object({
            title: Yup.string()
              .min(3, "Musí obsahovat alespoň 3 znaky")
              .required("Povinné pole"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              saveListTitle(values);
              setSubmitted(false);
              setSubmitting(false);
            }, 500);
          }}
        >
          {(formik) => (
            <div className="flex card justify-content-center">
              <Form className="flex flex-column gap-2">
                <ItemInput id="title" name="title" label="Název" />
                <Button
                  type="submit"
                  severity="secondary"
                  icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
                  label="Uložit"
                />
              </Form>
            </div>
          )}
        </Formik>
      </Dialog>

      <Dialog
        visible={addItemDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Nová položka"
        modal
        className="p-fluid"
        onHide={hideAddItemDialog}
      >
        <Formik
          initialValues={{
            id: item.id,
            owner: item.owner,
          }}
          validationSchema={Yup.object({
            title: Yup.string()
              .min(3, "Musí obsahovat alespoň 3 znaky")
              .required("Povinné pole"),
            note: Yup.string().max(255, "Musí obsahovat maximálně 255 znaků"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              saveItem(values);
              setSubmitted(false);
              setSubmitting(false);
            }, 500);
          }}
        >
          {(formik) => (
            <div className="flex card justify-content-center">
              <Form className="flex flex-column gap-2">
                <ItemInput id="title" name="title" label="Název" />
                <ItemInput id="note" name="note" label="Poznámka" />
                <Button
                  type="submit"
                  severity="secondary"
                  icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
                  label="Uložit"
                />
              </Form>
            </div>
          )}
        </Formik>
      </Dialog>

      <Dialog
        visible={deleteItemDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Potvrzení"
        modal
        footer={deleteItemDialogFooter}
        onHide={hideDeleteItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {item && (
            <span>
              Opravdu chcete smazat položku <b>{item.title}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteMemberDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Potvrzení"
        modal
        footer={deleteMemberDialogFooter}
        onHide={hideDeleteMemberDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {item && <span>Opravdu se chcete odstranit jako člen?</span>}
        </div>
      </Dialog>

      <Dialog
        visible={membersDialog}
        style={{ width: "50rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Správa členů"
        modal
        onHide={hideMembersDialog}
      >
        <div className="flex card justify-content-center">
          <PickList
            source={availableUsers}
            target={members}
            onChange={onMemberChange}
            itemTemplate={itemUserTemplate}
            breakpoint="1400px"
            sourceHeader="Uživatelé"
            targetHeader="Členi"
            sourceStyle={{ height: "30rem" }}
            targetStyle={{ height: "30rem" }}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default ItemsList;
