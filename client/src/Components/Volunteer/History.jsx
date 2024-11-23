import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, IconButton, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router";
import url from "../../apiConfig";
import axios from "axios";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return (c * r).toFixed(2); // Distance in kilometers
};

function History() {
  const [userLocation, setUserLocation] = useState(null);

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCloseLoading, setIsCloseLoading] = useState(false);
  const [statusType, setStatusType] = useState("open");

  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            console.log("User Location:", latitude, longitude);
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            // Optional: Handle specific errors
            if (error.code === error.PERMISSION_DENIED) {
              console.error("User denied the request for Geolocation.");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              console.error("Location information is unavailable.");
            } else if (error.code === error.TIMEOUT) {
              console.error("The request to get user location timed out.");
            } else if (error.code === error.UNKNOWN_ERROR) {
              console.error("An unknown error occurred.");
            }
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchUserLocation();

    if (!localStorage.getItem("volunteerLoginEmail")) {
      navigate("/volunteer-login");
    }

    const fetchVolunteeredProblems = async () => {
      try {
        const response = await axios.get(
          url +
            `fetch-volunteer-history?email=${localStorage.getItem(
              "volunteerLoginEmail"
            )}&status=${statusType}`
        );
        setRequests(response.data.historicalData);
      } catch (e) {
        console.log(e);
      }
    };

    fetchVolunteeredProblems();
  }, [statusType]);

  const formatDateToIndia = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        background:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div className="bg-white p-2 py-5 flex items-center shadow-md rounded-md justify-between">
        <IconButton
          onClick={() => {
            navigate("/volunteer");
          }}
        >
          <ArrowBackIcon style={{ marginLeft: "1rem" }} />
        </IconButton>
        <p className="font-medium text-2xl flex-grow text-center">History</p>
        <span style={{ width: "24px", marginRight: "1rem" }}></span>{" "}
        {/* Empty space for balance */}
      </div>

      <div className="px-5 py-3 flex flex-row bg-white mx-5 my-3 rounded-lg">
        <p className="text-xl font-medium"> Problem Status </p>
        <div>
          <Button onClick={() => setStatusType("open")}>
            {" "}
            <p className={statusType == "open" && "font-medium"}>Open</p>{" "}
          </Button>
          <Button onClick={() => setStatusType("closed")}>Closed</Button>
        </div>
      </div>

      <div className="flex flex-col p-5 gap-4">
        {isLoading ? (
          <LinearProgress />
        ) : requests.length > 0 ? (
          requests.map((req) => {
            if (req.createdAt.length > 11) {
              req.createdAt = formatDateToIndia(req.createdAt);
            }

            return (
              <div
                key={Math.random()}
                className="flex flex-col gap-3 bg-white p-5 rounded-md shadow-md"
              >
                <p>{req.description}</p>

                <hr />

                <div className="mt-3 w-full rounded-lg overflow-hidden">
                  <img
                    src={req.imageUrl}
                    alt="Beautiful Scenery"
                    className="w-full h-[200px] object-cover"
                  />
                </div>

                <p className="font-medium text-lg">
                  Category:
                  <div className="flex flex-row gap-3">
                    {req.category.map((cat) => (
                      <p className="font-normal">{cat}</p>
                    ))}
                  </div>
                </p>

                <hr />

                <div className="flex flex-row justify-between">
                  <p className="font-medium text-lg">
                    {" "}
                    Urgency
                    <p className="font-normal">{req.priority}</p>
                  </p>
                  <p className="font-medium text-lg">
                    Severity
                    <p className="font-normal">{req.severity}</p>
                  </p>
                </div>

                <hr />
                <p className="font-medium text-lg">
                  Total Volunteer Assigned
                  <p className="font-normal">{req.volunteersAssigned.length}</p>
                </p>

                <p className="font-medium text-lg">
                  Current Status
                  <p className="font-normal capitalize">{req.status}</p>
                </p>

                <hr />

                <div className="flex flex-row justify-between">
                  <p className="font-medium text-lg">Dated: {req.createdAt} </p>
                </div>

                <div className="flex flex-row items-center justify-between gap-5">
                  <Button
                    fullWidth
                    variant="outlined"
                    disableElevation
                    onClick={() => {
                      navigate("/chat-volunteer");
                    }}
                  >
                    Contact Victim
                  </Button>
                  <IconButton
                    onClick={() => {
                      const lat = req.geoLocation[0];
                      const lng = req.geoLocation[1];
                      window.open(
                        `https://www.google.com/maps?q=${lat},${lng}`
                      );
                    }}
                  >
                    <FmdGoodIcon fontSize="large" />
                  </IconButton>
                </div>
              </div>
            );
          })
        ) : (
          <p className="bg-white p-3 rounded-lg">
            {" "}
            Currently there are no {statusType} problem statements
          </p>
        )}
      </div>
    </div>
  );
}

export default History;
