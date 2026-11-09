import React from "react";
import API from "../../../constants";
import { Box, CircularProgress, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import UserTable from "./usertable";
import { useSnackbar } from "../../snackbar";

const UserManagement = () => {
  const [usersData, setUsersData] = React.useState([]);
  const [rolesList, setRolesList] = React.useState([]);
  const [roleMap, setRoleMap] = React.useState({});
  const [currentPermissions, setCurrentPermissions] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const showSnackbar = useSnackbar();

  const editableFields = ["name", "email", "roleName", "status"];
  const columns = [
    {
      columnName: "name",
      type: "text",
      displayName: "Name",
    },
    {
      columnName: "email",
      type: "email",
      displayName: "Email",
    },
    {
      columnName: "roleName",
      type: "select",
      options: rolesList,
      displayName: "Role",
    },
    {
      columnName: "status",
      type: "select",
      options: ["Active", "Inactive"],
      displayName: "Status",
    },
    {
      columnName: "createdAt",
      type: "date",
      displayName: "Created At",
    },
  ];
  const getAllUsers = async () => {
    try {
      const response = await fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.getAllUsers}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getAllRoles = async () => {
    try {
      const response = await fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.getAllRoles}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentPermissions = async () => {
    const roleId = JSON.parse(localStorage.getItem("user"))?.roleId;
    try {
      const response = await fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.getRoleById}${roleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setCurrentPermissions(data.role?.permissions || {});
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load your permissions.", 3000, "error");
    }
  };

  const handleRefrehsh = () => {
    setIsLoading(true);
    showSnackbar("Loading data", 3000, "info");
    getAllUsers().then((data) => {
      if (data?.error) {
        showSnackbar(data?.error, 3000, "error");
        setIsLoading(false);
        return;
      }
      //create users data
      const usersData = [];
      data?.users?.forEach((user) => {
        usersData.push({
          id: user._id,
          name: user.name,
          email: user.email,
          roleName: user.roleId?.roleName,
          status: user.status,
          createdAt: user.createdAt,
        });
      });

      setUsersData(usersData);
      setIsLoading(false);
    });
    getAllRoles()
      .then((data) => {
        if (data?.error) {
          showSnackbar(data?.error, 3000, "error");
          return;
        }
        //map role Name to id
        const roleMap = {};
        data?.roles?.forEach((role) => {
          roleMap[role?.roleName] = role._id;
        });
        setRoleMap(roleMap);
        setRolesList(data?.roles?.map((role) => role?.roleName));
      })
      .catch((error) => {
        console.error(error);
        showSnackbar(error?.message, 3000, "error");
      });
    getCurrentPermissions();
  };

  React.useEffect(() => {
    handleRefrehsh();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Loading users...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {usersData.length > 0 ? (
        <UserTable
          editableFields={editableFields}
          columns={columns}
          rolesList={rolesList}
          data={usersData}
          roleMap={roleMap}
          currentPermissions={currentPermissions}
          handleRefresh={handleRefrehsh}
        />
      ) : (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No users found.
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default UserManagement;
