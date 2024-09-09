import axios from "axios";
import {useState,useContext} from "react"
import { useWeb3Context } from "../contexts/useWeb3Context";
import{useNavigate} from "react-router-dom"
import toast from "react-hot-toast";

const UploadUserInfo =()=>{
    const[name, setName]= useState('');
    const[age, setAge]= useState('');
    const[height, setHeight]= useState('');
    const[bloodGroup, setBloodGroup]= useState('');
    const[image, setImage]= useState('');
    const [loading,setLoading] = useState(false);

    const {web3State}=useWeb3Context();
    
    const{selectedAccount,contractInstance}=web3State;
    const navigate= useNavigate();

    const uploadBasicInfoHash=async(basicInfoHash)=>{
        try {
           await toast.promise(contractInstance.registerUsersBasicInfo(basicInfoHash),{
               loading:"Transaction is pending",
               success:"Transaction is successful",
               error:"Transaction failed"
           });
        } catch (error) {
           console.error("error uploadin the basic info hash:", error);
        }
       };

    const handleImageChange = (e)=>{
        setImage(e.target.files[0]);
    };
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const formData= new FormData();
        formData.append('name',name);
        formData.append('age',age);
        formData.append('height',height);
        formData.append('bloodGroup',bloodGroup);
        formData.append('image',image);
        formData.append('selectedAccount',selectedAccount);

        try {
            const url=`http://localhost:3000/api/UploadBasicInfo`
            //const token=localStorage.getItem("token")
            const config={
                headers:{
                    'content-Type': 'multipart/form-data',
       
                //"x-access-token":token,
            }
        }
            const res = await axios.post(url,formData,config);
            console.log("ipfs:",res.data);
            toast.success("file uploaded")
           await uploadBasicInfoHash(res.data.ipfsHash)
            setLoading(false)
            // reloadEffect()

             
             
             //navigate("/basic-info");
            } catch (error) {
            console.error('Error uploading data:', error);
           }

    }

    
   





    return (  <div>
        <h1>Upload Basic Info</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type='text' value={name} onChange={(e)=> setName(e.target.value)} required/>
             </div>
             <div>
                <label>Age:</label>
                <input type="number" value={age} onChange={(e)=>setAge(e.target.value)} required/>
             </div>
             <div>
                <label>Height</label>
                <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} required/>
            
             </div>
             <div>
                <label>Blood Group</label>
                <input type="text" value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)} required/>
             </div>
             <div>
                <label>Image:</label>
                <input type="file" onChange={handleImageChange} required/>
             </div>
             <button type="submit">Submit</button>


        </form>
    </div>);
};
 
export default UploadUserInfo; 








