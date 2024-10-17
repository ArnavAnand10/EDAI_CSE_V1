import { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import url from "../../apiConfig";
import { useNavigate } from "react-router";

const VictimLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {

    try {
      const response = await axios.post(url + "auth/login-victim", {
        email: formData.email,
        password: formData.password
      });

      console.log("Login successful:", response.data.victim);
      setFormData({ email: "", password: "" });
      console.log(response.data)
      localStorage.setItem("victimLoginEmail", response.data.victim.email)
      navigate("/victim-help")
    } catch (error) {
      console.error("Login failed", error.response && error.response.data && error.response.data.error || error.message);
      window.alert(error.response.data.error);
    }
  };

  return (
    <div
      style={{
        background: "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        width: "100%",
        height: "100vh"
      }}
      className="w-full h-screen flex justify-center items-center"
    >

      <div className="flex h-screen  w-screen flex-row">

        <div className="flex flex-col px-10 basis-1/2 text-center bg-[#F7EFF6] shadow-md  gap-6 justify-center p-6 rounded-md">

        <h1 className="text-3xl font-bold">Login As Victim</h1>

          <TextField
            size="small"
            type="email"
            label="Email Address"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            size="small"
            type="password"
            label="Password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            sx={{ backgroundColor: "#4452D9", color: "white" }}
            fullWidth
            disableElevation
            size="small"
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>

          <p>New to AssistMatrix? <b onClick={()=>{navigate("/victim-register")}}>Register as Victim</b> </p>
        </div>

        <div className="h-full">
          <img className="h-full" src="https://img.freepik.com/free-photo/paramedic-rear-ambulance-getting-ready-respond-emergancy-call_657921-1435.jpg?t=st=1729153430~exp=1729157030~hmac=7438ae754245e363595f222c1a354d13b1cb6b4632821eeb7224fe570f036f45&w=996" alt="" />
        </div>
      </div>
    </div>
  );
};

export default VictimLogin;
