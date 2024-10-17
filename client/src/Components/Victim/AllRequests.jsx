import React, { useEffect, useState } from 'react'
import VictimHeader from './VictimHeader'
import { Button, LinearProgress } from '@mui/material'
import axios from 'axios'
import url from '../../apiConfig'
import { useNavigate } from "react-router";

function AllRequests() {

    const formatDateToIndia = (isoDate) => {
        const date = new Date(isoDate);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      };

    const navigate = useNavigate();

    const [requests, setRequests] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {


        if (!localStorage.getItem("victimLoginEmail")) {
            navigate("/")

        }

       


        const getVictimPosts = async () => {

            setIsLoading(true);

            try {

                const response = await axios.get(url + `/get-victim-history?email=${localStorage.getItem("victimLoginEmail")}`);
                setRequests(response.data.problemStatements);
              
                
            }
            catch (e) {
                console.log(e);

            }
            finally {
                setIsLoading(false);
            }

        }

        getVictimPosts()

    }, [])


    return (


        <div style={{
            background: 'rgb(238,174,202)',
            background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
            width: '100%',
            minHeigh: '100vh'
        }} >

            <VictimHeader />

            <div className='flex flex-col p-5 gap-2'>


                {isLoading ? <LinearProgress /> :

                    requests.map((req) => {

                        req.createdAt = formatDateToIndia(req.createdAt)

                        return (
                            <div key={Math.random()} className='flex flex-col gap-3 bg-white p-5 rounded-md shadow-md'>
                                <p>
                                    {req.description}

                                </p>

                               <hr />

                                <div className="mt-3 w-full rounded-lg overflow-hidden">
                                    <img
                                        src={req.imageUrl}
                                        alt="Beautiful Scenery"
                                        className="w-full h-[200px] object-cover"
                                    />
                                </div>


                                <p className='font-medium text-lg'>
                                    Category:
                                    <div className='flex flex-row gap-3'>
                                    {req.category.map((cat)=> <p className='font-normal'>{cat}</p>)}
                                    </div>
                                </p>

                                <hr />

                                <div className='flex flex-row justify-between'>
                                    <p className='font-medium text-lg'> Urgency
                                        <p className='font-normal'>{req.priority}</p>
                                    </p>
                                    <p className='font-medium text-lg'>Severity

                                    <p className='font-normal'>{req.severity}</p>

                                    </p>

                                </div>

                                    <hr />
                                <p className='font-medium text-lg'>
                                    Total Volunteer Assigned 
                                    <p className='font-normal'>{req.volunteersAssigned.length}</p>

                                </p>

                                <p className='font-medium text-lg'>
                                    Current Status
                                    <p className='font-normal capitalize'>{req.status}</p>

                                </p>

                                <hr />

                                <div className='flex flex-row justify-between'>
                                    <p className='font-medium text-lg'>Dated: {req.createdAt} </p>
                                    <Button>Close Problem</Button>
                                </div>

                            </div>
                        )
                    })

                }





            </div>


        </div >
    )
}

export default AllRequests