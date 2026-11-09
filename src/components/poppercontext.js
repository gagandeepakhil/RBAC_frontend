import React, { createContext, useContext, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const PopperContext = createContext();

export const PopperProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: "",
    resolve: null,
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({ open: true, message, resolve });
    });
  }, []);

  const handleClose = (result) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState({ open: false, message: "", resolve: null });
  };

  return (
    <PopperContext.Provider value={{ confirm }}>
      {children}
      {/* A centered, anchor-less confirm dialog is what MUI's Dialog is built for.
          The previous implementation used Popper without an `anchorEl`, which MUI
          warns about on every open since Popper expects to be anchored to an
          element - Dialog needs no anchor and handles the backdrop/focus trap
          correctly out of the box. */}
      <Dialog open={confirmState.open} onClose={() => handleClose(false)}>
        <DialogContent>
          <Typography variant="body1">{confirmState.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleClose(true)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </PopperContext.Provider>
  );
};

export const usePopper = () => useContext(PopperContext);
