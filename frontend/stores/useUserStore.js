import {create} from "zustand";
import axios from "../lib/axios"; 
import {toast} from "react-hot-toast"

export const useUserStore= create((set, get)=>({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async ({name, email, password, confirmpassword})=>{
        set({loading:true});

        if(password!==confirmpassword){
            set({loading:false});
            return toast.error("Passwords do not match");
        }
        try{
            const res= await axios.post("auth/signup",{name, email, password} )
            set({user:res.data,loading:false});
        }catch(err){
            console.log(err);
            toast.error(error.response.data.message || "An error occurred, try again");
        }
    },
    login: async (email, password)=>{
        set({loading:true});
        try{
            const res= await axios.post("/auth/login",{email, password} )
            set({user:res.data, loading:false});
        }catch(err){
            console.log(err);
            toast.error(err.response.data.message || "An error occurred, try again");
        }
    },

    logout: async()=>{
        try{
            await axios.post("/auth/logout");
            set({user:null});
        }catch(error){
            toast.error(error.response?.data?.message || "An error occurred during logout, try again");
        }
        
    },

    checkAuth : async()=>{
        set({checkingAuth:true});
        try{
            const response =await axios.get("/auth/profile");
            set({user: response.data, checkingAuth: false})
        }catch(error){
            set({checkingAuth:false, user:null});
        }
    },
}))

// todo: implement the axios interceptors for refreshing access token