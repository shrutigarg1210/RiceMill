import { useState } from "react";

import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { authAPI } from "../../Api/API";
import { useAuth } from "../../context/AuthContext";

export default function AuthDialog({ open, onClose }) {

  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const textFieldStyle = {
    mt: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: "#ffffffdd",

      "& fieldset": {
        borderColor: "#d6c08a",
      },

      "&:hover fieldset": {
        borderColor: "#B8860B",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#B8860B",
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8B6B2F",
    },
  };

  const primaryButton = {
    mt: 3,
    py: 1.6,
    borderRadius: "14px",
    fontWeight: 700,
    fontSize: 16,

    background:
      "linear-gradient(135deg,#B8860B,#F0C24B)",

    color: "#241A0D",

    textTransform: "none",

    "&:hover": {
      background:
        "linear-gradient(135deg,#9A4E1C,#B8860B)",
    },
  };

  const secondaryButton = {
    mt: 2,

    borderRadius: "14px",

    borderColor: "#B8860B",

    color: "#9A4E1C",

    fontWeight: 600,

    textTransform: "none",

    "&:hover": {
      borderColor: "#9A4E1C",
      background: "#FFF7E7",
    },
  };

  const reset = () => {

    setLoading(false);

    setError("");

    setSuccess("");

    setLoginForm({
      email: "",
      password: "",
    });

    setRegisterForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  };

  const handleClose = () => {

    reset();

    setMode("login");

    onClose();

  };

  const switchToLogin = () => {

    setError("");

    setSuccess("");

    setMode("login");

  };

  const switchToRegister = () => {

    setError("");

    setSuccess("");

    setMode("register");

  };

  const handleLoginChange = (e) => {

    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });

  };

  const handleRegisterChange = (e) => {

    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });

  };

  const validateRegister = () => {

    if (!registerForm.name.trim())
      return "Name is required";

    if (!registerForm.email.trim())
      return "Email is required";

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(registerForm.email))
      return "Invalid Email";

    if (registerForm.password.length < 6)
      return "Password must be at least 6 characters";

    if (
      registerForm.password !==
      registerForm.confirmPassword
    )
      return "Passwords do not match";

    return null;

  };

  const handleLogin = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await authAPI.login(loginForm);

      login(response);

      handleClose();

    } catch (e) {

      setError(e.message || "Login Failed");

    } finally {

      setLoading(false);

    }

  };

  const handleRegister = async () => {

    const validation = validateRegister();

    if (validation) {

      setError(validation);

      return;

    }

    try {

      setLoading(true);

      setError("");

      await authAPI.register({

        name: registerForm.name,

        email: registerForm.email,

        password: registerForm.password,

      });

      setSuccess(
        "Registration Successful. Please login."
      );

      setTimeout(() => {

        switchToLogin();

      }, 1200);

    } catch (e) {

      setError(e.message || "Registration Failed");

    } finally {

      setLoading(false);

    }

  };
  return (
  <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    maxWidth="xs"
    PaperProps={{
      sx: {
        borderRadius: "24px",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#FFFDF8 0%,#F5EEDC 50%,#ECDCB4 100%)",
        boxShadow: "0 25px 60px rgba(0,0,0,.25)",
      },
    }}
  >
    <DialogContent
      sx={{
        p: 5,
        position: "relative",
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          color: "#8B6B2F",

          "&:hover": {
            background: "#F5EEDC",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box textAlign="center" mb={3}>
        <img
          src="/logo.png"
          alt="MBRG"
          width={90}
          style={{
            marginBottom: 10,
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#8B6B2F",
            fontFamily: "Georgia, serif",
          }}
        >
          {mode === "login"
            ? "Welcome Back"
            : "Create Account"}
        </Typography>

        <Typography
          sx={{
            color: "#6B5B3E",
            mt: 1,
            fontSize: 15,
          }}
        >
          Maa Bhagwati Rice Group
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "12px",
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: "12px",
          }}
        >
          {success}
        </Alert>
      )}

      {mode === "login" ? (
        <>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={loginForm.email}
            onChange={handleLoginChange}
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            sx={textFieldStyle}
          />

          <Button
            fullWidth
            variant="contained"
            sx={primaryButton}
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Login"
            )}
          </Button>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Typography
            align="center"
            sx={{
              color: "#6B5B3E",
            }}
          >
            Don't have an account?
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={secondaryButton}
            onClick={switchToRegister}
          >
            Create Account
          </Button>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={registerForm.name}
            onChange={handleRegisterChange}
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={registerForm.email}
            onChange={handleRegisterChange}
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
            sx={textFieldStyle}
          />

          <Button
            fullWidth
            variant="contained"
            sx={primaryButton}
            disabled={loading}
            onClick={handleRegister}
          >
            {loading ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Create Account"
            )}
          </Button>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Typography
            align="center"
            sx={{
              color: "#6B5B3E",
            }}
          >
            Already have an account?
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={secondaryButton}
            onClick={switchToLogin}
          >
            Login Instead
          </Button>
        </>
      )}
    </DialogContent>
  </Dialog>
);
}