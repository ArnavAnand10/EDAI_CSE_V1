import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "rgb(238,174,202)",
        background:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        width: "100%",
        height: "100vh",
      }}
      className="flex flex-row justify-around items-center gap-10 p-20"
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        className=" h-2/3 w-1/2 flex flex-col justify-center items-center gap-10 px-10"
      >
        <h1 className="text-4xl font-bold">Victim Login</h1>
        <p className="text-xl p-3">
          If you're seeking help or support, login here. Our platform provides
          resources and assistance for those in need. We offer a safe space for
          victims to connect with trained professionals and access vital
          information.
        </p>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={(e) => {
            e.preventDefault();
            navigate("/victim-login");
          }}
        >
          Get Started
        </Button>
      </div>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        className=" h-2/3 w-1/2 flex flex-col justify-center items-center gap-10 px-10"
      >
        <h1 className="text-4xl font-bold">Volunteer Login</h1>
        <p className="text-xl ">
          Ready to make a difference? Login here to start helping those in need
          and contribute to our supportive community. As a volunteer, you'll
          have the opportunity to provide valuable assistance and support to
          individuals facing challenging situations.
        </p>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={(e) => {
            e.preventDefault();
            navigate("/volunteer-login");
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;
