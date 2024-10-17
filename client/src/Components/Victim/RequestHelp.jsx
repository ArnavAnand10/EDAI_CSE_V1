import { Alert, Button, Snackbar, TextField, CircularProgress, LinearProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useRequest } from '../../Contexts/RequestContext';
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import url from '../../apiConfig';



// Set default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const steps = [
  'Describe Your Problem',
  'Select the Location',
  'Preview and Publish',
];

function RequestHelp() {

  const [loginEmail, setLoginEmail ]= useState();

  

  useEffect(()=>{

    if(localStorage.getItem("victimLoginEmail")){
      setLoginEmail(localStorage.getItem('victimLoginEmail'))
    }else{
      window.location.replace("http://localhost:3000/victim-login")
    }
  },[])

  const minLength = 5; // Minimum length requirement
  const keywords = [
    "urgent medical needs",
    "food donations",
    "shelter request",
    "clothing for children",
    "transport to hospital",
    "psychological counseling",
    "medical supplies needed",
    "temporary housing assistance",
    "clean drinking water",
    "first aid kits",
    "baby supplies needed",
    "warm clothing",
    "emergency shelter",
    "fuel assistance",
    "volunteer support",
    "financial aid request",
    "housing relocation help",
    "counseling for trauma"
  ];

  const [activeScreen, setActiveScreen] = useState(0); // Start with description screen
  const [loading, setLoading] = useState(false); // Loading state
  const { description, setDescription,imageUrl,setImageUrl } = useRequest();

  const WriteDescription = () => {
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false); // Loading state
    // Loading state
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    const [currentDescription, setCurrentDescription] = useState(description);

    const selectLocation = () => {
      setDescription(currentDescription);
      setActiveScreen(1); // Move to select location
    };

    const uploadImage = async (event) => {
      setImageLoading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'sjehvyh0'); // Replace with your upload preset

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dfzt40dlv/image/upload', formData); // Replace with your Cloudinary cloud name
        setImageUrl(response.data.secure_url);
        setSnackbarOpen(true);
        setSnackbarMessage("Image Uploaded") // Store the uploaded image URL
      } catch (error) {
        console.error('Error uploading image:', error);
        alert("Failed to upload image. Please try again."); // Optional: Notify the user
      }finally{
        setImageLoading(false);
      }
    };
    return (
      <div className='bg-white rounded-lg shadow-lg p-4 mx-8'>
        <TextField
          label="Describe Your Problem"
          multiline
          rows={7}
          variant="outlined"
          fullWidth
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
        />
        <p className='p-2 mt-4'>Example Keywords to highlight your request</p>
        <div className='flex flex-wrap p-4 gap-4'>
          {keywords.map((k, index) => (
            <div key={index} className='border border-gray-400 rounded-sm p-2'>
              <p className='text-xs'>{k}</p>
            </div>
          ))}
      

        </div>
          {/* Upload Image Button */}
          <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-image"
          type="file"
          onChange={uploadImage}
        />
        <label htmlFor="upload-image">
          <Button variant="contained" component="span" fullWidth sx={{ mb: 2 }}>
            {imageLoading ? <CircularProgress color='' /> : 'Upload Image'}
          </Button>
        </label>

          {/* Image Preview */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          style={{ height: '300px', width: '100%', objectFit: 'cover', borderRadius: '4px' }} // Adjust height and width as needed
        />
      )}

    
        <br />
        <Button
          onClick={selectLocation}
          fullWidth
          variant='contained'
          sx={{ textTransform: "capitalize" }}
          disableElevation
          disabled={currentDescription.trim().length < minLength}
        >
          Next: Select Location
        </Button>
      </div>
    );
  };


  const PreviewPublish = () => {

    const { description, setDescription, location, setLocation, categories, setCategories, severity, setSeverity, urgency, setUrgency } = useRequest();

    const email = localStorage.getItem("victimLoginEmail");
    const getUrgencyClass = (urgency) => {
      switch (urgency) {
        case 'High':
          return 'text-red-500';
        case 'Medium':
          return 'text-yellow-300';
        case 'Low':
          return 'text-green-600';
        default:
          return 'bg-gray-200'; // fallback
      }
    };

    const publishPost =  async ()=>{
      console.log({ problemStatement:description,
        email,
        problemUrgency:urgency,
        problemCategory:categories,
        problemSeverity:severity,
        problemLocation:location,
        imageUrl : imageUrl})
      try{
        const response = await axios.post(url + "publish-post",{
            problemStatement:description,
            problemUrgency:urgency,
            problemCategory:categories,
            problemSeverity:severity,
            problemLocation:location,
            imageUrl : imageUrl,
            email
        })
        window.alert("Post Published Successfully")
      }catch(e){
        console.log(e);
        window.alert("Internal Server Error")

      }
    }

    return (<div className=''>


      <div className=' bg-white py-6 px-6 mx-10 shadow-lg flex flex-col gap-8 rounded-lg'>


        <div>
          <h1 className='  text-3xl mb-4 font-medium'>
            Problem Statement
          </h1>


          <p>
            {description}
          </p>

        </div>


        <hr />

        <div>
          <p className='text-xl font-medium'>
            Assigned Categories
          </p>
          <div className='flex flex-row gap-2 my-3'>
            {categories.map((k, index) => {
              return (<div key={index} className='border border-gray-400 rounded-sm p-2'>
                <p className='text-xs'>{k}</p>
              </div>)
            })}

          </div>


        </div>

        <hr />
        {/* severity and urgency */}




        <div className='flex flex-row gap-10'>


          <div>
            <p className='text-xl font-medium'>
              Urgency
            </p>
            <div className='flex flex-row gap-2 my-3'>
              <div >
                <p className={`text-xl font-medium ${getUrgencyClass(urgency)}`}>{urgency}</p>
              </div>
            </div>
          </div>


          <div>
            <p className='text-xl font-medium'>
              Severity
            </p>
            <div className='flex flex-row gap-2 my-3'>
              <div >
                <p className={`text-xl font-medium ${getUrgencyClass(severity)}`}>{severity}</p>
              </div>
            </div>




          </div>



        </div>

        <div>

          <Button onClick={publishPost} disableElevation sx={{
            textTransform: "capitalize"
          }} fullWidth variant='contained' >Publish</Button>
          <Button onClick={()=>{setActiveScreen(1)}} fullWidth >Back</Button>
        </div>

      </div>
    </div>)

  }

  const SelectLocation = () => {
    const [isFetchCategoryLoading, setIsFetchCategoryLoading] = useState(false);
    const [position, setPosition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const { description, setLocation, setCategories, setSeverity, setUrgency } = useRequest();

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
          },
          () => {
            showSnackbar("Unable to retrieve your location", "error");
            setPosition([51.505, -0.09]); // Default location
          }
        );
      } else {
        showSnackbar("Geolocation is not supported by this browser.", "error");
        setPosition([51.505, -0.09]); // Default location
      }
    }, []);

    const showSnackbar = (message, severity) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };

    const handleSearch = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
              q: searchTerm,
              format: 'json',
              limit: 5,
            },
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching location:', error);
          showSnackbar('Failed to fetch location results. Please try again.', 'error');
        }
      }
    };

    const handleResultClick = (result) => {
      const newPosition = [result.lat, result.lon];
      setPosition(newPosition);
      setSearchResults([]);
      setSearchTerm('');
    };

    const MapClick = () => {
      const map = useMap();
      useMapEvents({
        click: (event) => {
          const newPosition = [event.latlng.lat, event.latlng.lng];
          setPosition(newPosition);
          map.setView(newPosition, map.getZoom());
        },
      });
      return null;
    };



    const handleNext = async () => {
      setIsFetchCategoryLoading(true);
      if (!description) {
        showSnackbar('Please provide a problem description before proceeding.', 'warning');
        return;
      }
      if (!position) {
        showSnackbar('Please select a location before proceeding.', 'warning');
        return;
      }
      try {
        // setLoading(true); // Start loading
        const response = await axios.post(url + 'gemini-model', {
          userProblem: description,
        });
        console.log(response);
        setSeverity(response.data.severity);
        setUrgency(response.data.urgency);
        const catArr = response.data.category.split(',').map(topic => topic.trim());
        setCategories(catArr);
        setLocation(position);

        setActiveScreen(2)
      } catch (error) {
        console.error('Error fetching category:', error);
        if (error.response) {
          // Handle the case where the response is returned but there's an error status
          switch (error.response.status) {
            case 400:
              showSnackbar('Please provide a relevant problem statement', 'error');
              break;
            case 404:
              showSnackbar('Category not found', 'error');
              break;
            case 500:
              showSnackbar('Internal server error. Please try again later.', 'error');
              break;
            default:
              showSnackbar('An unexpected error occurred', 'error');
          }
        } else {
          // Handle network errors or other unexpected issues
          showSnackbar('Network error. Please check your connection.', 'error');
        }
        setIsFetchCategoryLoading(false)
      }
    }
    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
    };

    if (!position) return <div><LinearProgress color='inherit' /></div>;

    return (
      <div className='bg-white px-8 py-6 rounded-lg'>
        <TextField
          label="Search for a location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          fullWidth
        />
        <Button onClick={handleSearch} variant="contained" sx={{ mt: 2 }} >
          Search
        </Button>

        {searchResults.length > 0 && (
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
            {searchResults.map((result) => (
              <div
                key={result.place_id}
                onClick={() => handleResultClick(result)}
                style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc' }}
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}

        <MapContainer key={position.join(',')} center={position} zoom={13} style={{ height: '400px', width: '100%', marginTop: '20px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
          <MapClick />
        </MapContainer>

        <br />
        <Button 
        sx={{
          textTransform:"capitalize"
        }}
          onClick={handleNext}
          fullWidth
          variant='contained'
        >
          {isFetchCategoryLoading ? <CircularProgress color='inherit' size={24} /> : 'Next: Preview & Publish'}
        </Button>

        <Button  onClick={() => {
          setActiveScreen(0)
        }} fullWidth>
          Back
        </Button>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  };

  return (
    <div style={{
      background: 'rgb(238,174,202)',
      background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
      width: '100%',
      minHeight: "100vh",


    }}>
      <div className='flex flex-col w-full gap-10 p-12'>
        <h1 className='text-white text-4xl mx-10 font-medium'>Request for Help</h1>


        <div className='bg-white p-2 py-6 mx-9 rounded-lg'>
          <Stepper sx={{
            color: "white"
          }} activeStep={activeScreen} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        {activeScreen === 0 ? <WriteDescription /> : activeScreen == 1 ? <SelectLocation /> : <PreviewPublish />}
      </div>
    </div>
  );
}

export default RequestHelp;
