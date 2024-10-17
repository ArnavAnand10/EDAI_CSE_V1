
import Avatar from '@mui/material/Avatar'
import '../../App.css';
import { Button, CircularProgress, IconButton, Input } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { useDebugValue, useEffect } from 'react';
import axios from 'axios';
import url from '../../apiConfig';
import { useState } from 'react';
import PostsCards from './PostsCards';


const calculateDistance = (lat1, lon1, lat2, lon2) => {

  console.log(lat1, lon1, lat2, lon2);
  

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance.toFixed(2);  // Distance in kilometers
};



const VolunteerScreen = () => {

  const [allPosts, setAllPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const [postLoading, setPostLoading] = useState(false);
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


    const fetchAllPosts = async () => {
      setPostLoading(true);
      try {
        const response = await axios.get(url + '/get-posts');
        setAllPosts(response.data.allPosts);
        console.log(response.data.allPosts);
      }
      catch (e) {
        console.log('error in fetching all posts', e);
      }finally{
        setPostLoading(false);
      }
    }
    fetchAllPosts();
   
  }, [])

  return <div
    style={{
      background: 'rgb(238,174,202)',
      background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
      width: '100%',
      height: '100vh'
    }}

    className='victim-post pb-8   overflow-y-hidden'  >



    <div
      className=" flex h-full mr-4 ml-4 mt-4 flex-row gap-2">


      {/*left component */}
      <div className="side-bar basis-1/3 gap-5  flex flex-col" >

        {/* profile component */}
        <div
          className='basis-1/2 border border-gray-300 flex flex-col p-4 rounded-md'
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="profile-component flex flex-col justify-center items-center gap-2 basis-1/2 rounded-md">
            <Avatar />
            <p className='font-semibold font-montserrat '>Ridham Anand</p>
            <p className='font-light text-sm font-montserrat'>ridhamanand31@gmail.com</p>
          </div>

          {/* Buttons */}
          <Button
            fullWidth
            size='small'
            variant="outlined"
            sx={{
              textAlign: 'left',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: '#BFC4D7',
              borderLeft: 'none',
              color: 'black',
              borderRight: 'none',
              borderRadius: 0,
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            View Profile
          </Button>

          <Button
            fullWidth
            size='small'
            variant="outlined"
            sx={{
              textAlign: 'left',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: '#BFC4D7',
              borderLeft: 'none',
              color: 'black',
              borderRight: 'none',
              borderRadius: 0,
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            Edit Profile
          </Button>

          <Button
            fullWidth
            size='small'
            variant="outlined"
            sx={{
              textAlign: 'left',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: '#BFC4D7',
              borderLeft: 'none',
              color: 'black',
              borderRight: 'none',
              borderRadius: 0,
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            Logout
          </Button>
        </div>



        <div
          className="profile-component border border-gray-300  bg-white flex flex-col justify-start p-4 basis-1/2 rounded-md"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
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
                  <td className="p-2">5</td>
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
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }} className="disaster-news-component border border-gray-300 ml-2 mr-2 -mb-4 basis-1/4  bg-white rounded-md">

        </div>

        {/* Scrollable Posts Component */}
       { postLoading ? <CircularProgress/> :  <div className="posts-area flex-grow p-3 basis-full flex-col rounded-md overflow-y-scroll space-y-5    scrollbar-hide">

          {/* Post Component */}
          {allPosts && allPosts.map((post) => {

            post.distance = calculateDistance(userLocation.latitude,userLocation.longitude,post.geoLocation[0],post.geoLocation[1])

            return (
              <PostsCards props={post} />)
          })}

        </div> }

      </div>



      {/* right component */}

      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }} className="chat-area border border-gray-300 bg-white basis-1/3 p-2 h-full flex flex-col rounded-md">

        {/* Chat Side */}
        <div className='flex flex-row mb- items-center justify-between'>
          <div className="flex justify-start  gap-2 ">
            <Avatar sx={{ width: 24, height: 23, fontSize: 10 }}>C</Avatar>
            <div className="flex flex-col justify-center">
              <p className="font-poppins font-normal text-xs">Arnav Anand</p>

            </div>
          </div>
          <IconButton sx={{ padding: 0 }}><PhoneEnabledIcon sx={{ width: 18, height: 18 }} /></IconButton>

        </div>

        <hr className="border-t border-gray-300 mb-3 w-full" />


        {/* Chat Messages Area */}

        {/* User Message */}
        <div className="message mb-2 flex justify-end">
          <div style={{
            backgroundColor: '#96BAE8'
          }} className=" text-white rounded-lg p-2 max-w-xs">
            <p className="font-montserrat text-xs">Hello. I saw your recent post regarding medical emergency. What kind of medical supplies do you need exactly?</p>
          </div>

        </div>
        <div className="chat-messages flex-grow overflow-y-auto  border-b border-gray-300">
          {/* Chatbot Message */}
          <div className="message mb-2 flex">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-2 max-w-xs">
              <p className="font-montserrat text-xs">I need supplies for a third degree burn injury. My medical supplies are exhausting soon.</p>
            </div>
          </div>

          {/* Add more messages as needed */}
        </div>

        {/* Message Input Area */}
        <div className='flex m-2 align-bottom gap-2 rounded-md border pt-1 pb-2 pl-3  pr-3 border-gray-300 items-end justify-start'>
          <Input fullWidth sx={{
            fontFamily: 'Montserrat',
            fontSize: "12px"

          }} placeholder='Start Typing...'></Input>

          <IconButton sx={{ padding: 0 }}>    <SendIcon sx={{ width: 20 }} />
          </IconButton>
        </div>

      </div>

    </div></div>
}

export default VolunteerScreen;