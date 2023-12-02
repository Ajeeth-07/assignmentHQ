import React, { useState, useEffect } from "react";
import { Table, Pagination, Button, Input, Checkbox } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const TableComponent = () => {
  const [tabledata, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchquery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setTableData(data);
      });
  }, []);

  //search query
  const filteredTableData = tabledata.filter((row) => {
    const searchText = searchquery.toLowerCase();
    return (
      row.name.toLowerCase().includes(searchText) ||
      row.email.toLowerCase().includes(searchText) ||
      row.role.toLowerCase().includes(searchText)
    );
  });

  //pagination
  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };

  //search query
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  //selection
  const handleSelect = (rows) => {
    if (!Array.isArray(rows)) {
      rows = [rows];
    }

    const newSelectedRows = [...selectedRows];
    for (const row of rows) {
      if (newSelectedRows.includes(row)) {
        newSelectedRows.splice(newSelectedRows.indexOf(row), 1);
      } else {
        newSelectedRows.push(row);
      }
    }
    setSelectedRows(newSelectedRows);
  };

  //bulk delete
  const handlebulkDelete = () => {
    //deleting selected rows
    const newTableData = tabledata.filter((row) => !selectedRows.includes(row));
    setTableData(newTableData);

    //clearing selection
    setSelectedRows([]);
  };

  //edit
  const handleEdit = (row) => {
    //open a dialog box to edit the row
    setEditRowId(row.id);
    setEditRowData(row);
  };

  //handle delete
  const handleDelete = (rowToDelete) => {
    //delete the row
    const newTableData = tabledata.filter((row) => row.id !== rowToDelete.id);
    setTableData(newTableData);
  };

  const handleSave = () => {
    const newTableData = tabledata.map((row) =>
      row.id === editRowId ? editRowData : row
    );
    setTableData(newTableData);
    setEditRowId(null);
  };

  const handleInputChange = (event, field) => {
    setEditRowData({ ...editRowData, [field]: event.target.value });
  };

  // rows per page
  const paginatedTableData = filteredTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <div className="header">
        <Input
          type="text"
          placeholder="Search..."
          value={searchquery}
          onChange={handleSearch}
          className="search-box"
        />
        <Button className="bulk-delete" onClick={() => handlebulkDelete()}>
          <FontAwesomeIcon
            className="icon"
            icon={faTrash}
            style={{ color: "#cf3a3a", fontSize: "20px" }}
          />
        </Button>
      </div>

      <Table>
        <thead>
          <tr>
            <Checkbox
              checked={selectedRows.length === paginatedTableData.length}
              onChange={() => handleSelect(paginatedTableData)}
            />
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTableData.map((row) => {
            const isSelected = selectedRows.includes(row);
            const isEditing = row.id === editRowId;
            return (
              <tr key={row.id} className={isSelected ? "selected" : ""}>
                <td>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleSelect(row)}
                  />
                </td>
                <td>
                  {isEditing ? (
                    <Input
                      value={editRowData.name}
                      onChange={(event) => handleInputChange(event, "name")}
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <Input
                      value={editRowData.email}
                      onChange={(event) => handleInputChange(event, "email")}
                    />
                  ) : (
                    row.email
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <Input
                      value={editRowData.role}
                      onChange={(event) => handleInputChange(event, "role")}
                    />
                  ) : (
                    row.role
                  )}
                </td>
                {/* <td>{row.Action}</td> */}
                <td>
                  {isEditing ? (
                    <Button className="save" onClick={handleSave}>
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button className="edit" onClick={() => handleEdit(row)}>
                        <FontAwesomeIcon
                          className="icon"
                          icon={faEdit}
                          style={{ color: "#4a4a4a" }}
                        />
                      </Button>
                      <Button
                        className="delete"
                        onClick={() => handleDelete(row)}
                      >
                        <FontAwesomeIcon
                          className="icon"
                          icon={faTrash}
                          style={{ color: "#cf3a3a" }}
                        />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination
        count={Math.ceil(filteredTableData.length / rowsPerPage)}
        page={currentPage}
        onChange={handleChangePage}
      />
    </div>
  );
};

export default TableComponent;
