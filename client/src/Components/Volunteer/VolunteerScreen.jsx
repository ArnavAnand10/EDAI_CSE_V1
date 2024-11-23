import Avatar from "@mui/material/Avatar";
import "../../App.css";
import {
  Grid,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import axios from "axios";
import url from "../../apiConfig";
import { useEffect, useState } from "react";
import PostsCards from "./PostsCards";
import { useNavigate } from "react-router";

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

const formatDateToIndia = (dateString) => {
  const date = new Date(dateString);
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
  const istDate = new Date(date.getTime() + istOffset);

  // Get the day, month, and year
  const day = String(istDate.getDate()).padStart(2, "0"); // Pad single digits with a leading zero
  const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = istDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const VolunteerScreen = () => {
  useEffect(() => {
    if (!localStorage.getItem("volunteerLoginEmail")) {
      navigate("/volunteer-login");
    }

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

    const fetchAllPosts = async () => {
      setPostLoading(true);
      try {
        const response = await axios.get(
          url + `get-posts?email=${localStorage.getItem("volunteerLoginEmail")}`
        );
        const categoryResponse = await axios.post(url + "get-categories");
        setAllCategories(categoryResponse.data);
        console.log("Categories", categoryResponse.data);

        setAllPosts(response.data.allPosts);
      } catch (e) {
        console.log("error in fetching all posts", e);
      } finally {
        setPostLoading(false);
      }
    };
    fetchAllPosts();
  }, []);

  const [allCategories, setAllCategories] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [postLoading, setPostLoading] = useState(false);

  const handleUrgencySort = async (e, type) => {
    setPostLoading(true);
    const filter =
      e.target.value == "low-to-high"
        ? e.target.value.substring(0, 3)
        : e.target.value.substring(0, 4);
    console.log(filter);
    try {
      const response = await axios.get(
        url +
          `sort-posts?sortBy=${type}&filter=${filter}&email=${localStorage.getItem(
            "volunteerLoginEmail"
          )}`
      );
      setAllPosts(response.data.allPosts);
      console.log(response.data.allPosts);
    } catch (e) {
      console.log("error in fetching sorted posts", e);
    } finally {
      setPostLoading(false);
    }
  };

  const handleDistanceSort = async (e, type) => {
    setPostLoading(true); // Set loading state to true

    // Determine the filter type based on the selected option
    const filter = e.target.value === "low-to-high" ? "low" : "high";
    console.log(filter);

    // Create a new array to avoid mutating the original one
    const sortedPosts = [...allPosts].sort((a, b) => {
      if (filter === "low") {
        return a.distance - b.distance; // Ascending order
      } else {
        return b.distance - a.distance; // Descending order
      }
    });

    console.log(sortedPosts);

    setAllPosts(sortedPosts); // Update state with the new sorted array
    setPostLoading(false); // Set loading state to false after sorting
  };

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prevSelected) => {
      // Check if the category is already selected
      if (prevSelected.includes(category)) {
        // If it's checked, remove it from the selected categories
        return prevSelected.filter((cat) => cat !== category);
      } else {
        // If it's unchecked, add it to the selected categories
        return [...prevSelected, category];
      }
    });
  };

  const handleCategoryApply = async () => {
    console.log(selectedCategories);

    if (!selectedCategories) {
      window.alert("Please Select Atleast one Category");
      return;
    }

    try {
      const response = await axios.post(url + "get-query-posts-by-category", {
        query: selectedCategories,
        email: localStorage.getItem("volunteerLoginEmail"),
      });
      setAllPosts(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
      setSelectedCategories([]);
    }
  };

  return (
    <div
      style={{
        background: "rgb(238,174,202)",
        background:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        width: "100%",
        height: "100vh",
      }}
      className="victim-post pb-8   overflow-y-hidden"
    >
      {/* Modal */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex flex-col h-full  justify-center items-center ">
          <div className="bg-white   mx-20 p-10 rounded-lg">
            <h1 className=" text-center text-2xl font-medium my-5">
              Apply Categories
            </h1>
            <Grid container spacing={2}>
              {allCategories.map((cat) => (
                <Grid item xs={12} sm={6} md={3} key={cat.category}>
                  <FormControlLabel
                    defaultChecked={false}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(cat._id)}
                        onChange={() => handleCheckboxChange(cat._id)} // Call the function on change
                      />
                    }
                    label={`${cat.category} (${cat.count})`}
                  />
                </Grid>
              ))}
            </Grid>
            <div className="flex flex-col gap-3 mt-8">
              <Button
                variant="contained"
                disableElevation
                fullWidth
                onClick={handleCategoryApply}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <div className=" flex h-full mr-4 ml-4 mt-4 flex-row gap-2">
        {/*left component */}
        <div className="side-bar basis-1/3 gap-5  flex flex-col">
          {/* profile component */}
          <div
            className="basis-1/2 border border-gray-300 flex flex-col p-4 rounded-md"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="profile-component flex flex-col justify-center items-center gap-2 basis-1/2 rounded-md">
              <Avatar />
              <p className="font-semibold font-montserrat ">
                {localStorage
                  .getItem("volunteerLoginEmail")
                  .split(".")[0]
                  .toUpperCase()}
              </p>
              <p className="font-light text-sm font-montserrat">
                {localStorage.getItem("volunteerLoginEmail")}
              </p>
            </div>

            {/* Buttons */}
            <Button
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                textAlign: "left",
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "#BFC4D7",
                borderLeft: "none",
                color: "black",
                borderRight: "none",
                borderRadius: 0,
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              View Profile
            </Button>

            <Button
              onClick={() => {
                navigate("/history");
              }}
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                textAlign: "left",
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "#BFC4D7",
                borderLeft: "none",
                color: "black",
                borderRight: "none",
                borderRadius: 0,
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              History
            </Button>

            <Button
              onClick={() => {
                localStorage.removeItem("volunteerLoginEmail");
                navigate("/volunteer-login");
              }}
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                textAlign: "left",
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "#BFC4D7",
                borderLeft: "none",
                color: "black",
                borderRight: "none",
                borderRadius: 0,
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              Logout
            </Button>
          </div>

          <div
            className="profile-component border border-gray-300  bg-white flex flex-col justify-start p-4 basis-1/2 rounded-md"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Leaderboard Title */}
            <div className="flex justify-between gap-2  border-gray-300">
              <h2 className="text-lg font-bold text-wh mb-4">Leaderboard</h2>
              <LeaderboardIcon />
            </div>

            {/* Table Container with Bottom Border */}
            <div className="border-t border-gray-300">
              <table className="table-auto w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="font-bold p-2 text-left">Rank</th>
                    <th className="font-bold p-2 text-left">Name</th>
                    <th className="font-bold p-2 text-left">Volunteered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-2">1</td>
                    <td className="p-2">Ridham</td>
                    <td className="p-2">15</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2">2</td>
                    <td className="p-2">Shivani</td>
                    <td className="p-2">8</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2">3</td>
                    <td className="p-2">Vansh</td>
                    <td className="p-2">7</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2">4</td>
                    <td className="p-2">Vinit</td>
                    <td className="p-2">4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* middle component */}
        <div className="middle-componet gap-5 basis-full flex flex-col h-screen ">
          {/* Disaster News Component */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            className="disaster-news-component border border-gray-300 ml-2 mr-2 -mb-4 basis-1/4  bg-white rounded-md"
          >
            <div className="flex flex-row gap-5 justify-around p-5">
              <div className="flex gap-3 flex-col">
                <p className="text-lg font-medium">Sort By Urgency</p>
                <Select
                  onChange={(e) => handleUrgencySort(e, "Urgency")} // Use onChange to get the selected value
                  label="Urgency"
                >
                  <MenuItem value={"high-to-low"}>High To Low</MenuItem>
                  <MenuItem value={"low-to-high"}>Low To High</MenuItem>
                </Select>
              </div>
              <div className="flex gap-3 flex-col">
                <p className="text-lg font-medium">Sort By Severity</p>
                <Select
                  onChange={(e) => handleUrgencySort(e, "severity")} // Use onChange to get the selected value
                  label="Urgency"
                >
                  <MenuItem value={"high-to-low"}>High To Low</MenuItem>
                  <MenuItem value={"low-to-high"}>Low To High</MenuItem>
                </Select>
              </div>

              <div className="flex gap-3 flex-col">
                <p className="text-lg font-medium">Sort By Distance</p>
                <Select
                  onChange={(e) => handleDistanceSort(e, "severity")} // Use onChange to get the selected value
                  label="Distance"
                >
                  <MenuItem value={"high-to-low"}>High To Low</MenuItem>
                  <MenuItem value={"low-to-high"}>Low To High</MenuItem>
                </Select>
              </div>

              <div className="flex gap-3 justify-center items-center flex-col">
                <p className="text-lg font-medium">Select Categories</p>
                <Button onClick={() => setOpen(!open)} variant="outlined">
                  Select Categories
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Posts Component */}
          {postLoading ? (
            <CircularProgress />
          ) : (
            <div className="posts-area flex-grow p-3 basis-full flex-col rounded-md overflow-y-scroll space-y-5    scrollbar-hide">
              {/* Post Component */}
              {allPosts.length > 0 && userLocation ? (
                allPosts.map((post) => {
                  post.distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    post.geoLocation[0],
                    post.geoLocation[1]
                  );

                  if (post.createdAt.length > 11) {
                    post.createdAt = formatDateToIndia(post.createdAt);
                  }

                  return <PostsCards props={post} />;
                })
              ) : (
                <p className="p-2 bg-white text-center rounded-lg">
                  Currently There are not any recent problems
                </p>
              )}
            </div>
          )}
        </div>

        {/* right component */}
      </div>
    </div>
  );
};

export default VolunteerScreen;
