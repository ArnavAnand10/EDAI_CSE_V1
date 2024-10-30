import { Avatar, Button, IconButton } from "@mui/material";
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import AddCommentIcon from '@mui/icons-material/AddComment';




const PostsCards = ({props})=>{
    

    return (

        

        

        <div  style={{
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.2)', 
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
           }} key={Math.random()} className="bg-white p-7 flex flex-col gap-4 rounded-md border border-gray-300">
                <div className="flex justify-between  gap-2">
                <div className='flex gap-2 '>
                <Avatar sx={{ width: 30, height: 30, fontSize: 15 }}>{props.victimName && props.victimName.slice(0,1)}</Avatar>
           
                <div className="flex flex-col">
                    <p className="font-poppins font-medium text-xs">{props.victimName}</p>
                    <p className="font-montserrat text-xs">{props.createdAt}</p>
                  </div>
                </div>
                
                  <MoreVertIcon/>
                </div>
           
                <hr  className="border-t border-gray-300 mb-3 w-full" />
              
                <div className="description">
                  <p className="font-poppins text-xs">
                {props.description}
                  </p>
                  <div className="mt-3 w-full rounded-lg overflow-hidden">
                    <img
                      src={props.imageUrl}
                      alt="Beautiful Scenery"
                      className="w-full h-[200px] object-cover"
                    />
                  </div>
           
                </div>
                
                <div className='buttons-area flex flex-row justify-between'>
                  <div className='flex gap-7 flex-row'>
             <IconButton sx={{padding:0}}><FavoriteBorderIcon/></IconButton> 
             <IconButton sx={{padding:0}}><AddCommentIcon/></IconButton> 
             <IconButton sx={{padding:0}}>      <ShareIcon/></IconButton> 
                  </div>
                  <IconButton sx={{padding:0}}>   <TurnedInNotIcon/> </IconButton> 
                </div>
           
           
                <div className='flex flex-row justify-between'>
           
             <div>
             <h1 className='font-medium'>
               Category
             </h1>
            <div className="flex flex-row gap-4">
             {props.category.map((c)=><p>{c}</p> )}

             </div>
             </div>
           
             <div className='flex flex-row gap-5 '>
             <div className='text-right'>
             <h1 className='font-medium'>
              Severity
             </h1>
             <p>
             {props.severity}
             </p>
             </div>
           
             <div className='text-right'>
             <h1 className='font-medium'>
               Urgency
             </h1>
             <p>
             {props.priority}
             </p>
             </div>
           
             </div>
             </div>
           
             <div className='flex flex-row justify-between'>
               <h1 className='font-medium'>
                 Distance: {props.distance} Km
               </h1>
               <h1 style={{cursor:'pointer'}} onClick={()=>{
                const lat = props.geoLocation[0];
                const lng = props.geoLocation[1];
                window.open(`https://www.google.com/maps?q=${lat},${lng}`)}} className='font-medium'>
                 Locate
               </h1>
             </div>
           
                <Button 
           variant="outlined" 
           size="small" 
           fullWidth
           sx={{
            fontFamily: 'Montserrat',
            fontWeight: '500',
            color: '#fff', 
            backgroundColor: '#4452D9', 
            borderColor: '#fff', 
            borderWidth: '1px',
            textTransform: 'none', 
            '&:hover': {
              backgroundColor: '#3b4cbb', 
              borderColor: '#fff',
            },
           }}
           >
           Volunteer
           </Button> 
           
           
             
           
            </div>
    )

}

export default  PostsCards;