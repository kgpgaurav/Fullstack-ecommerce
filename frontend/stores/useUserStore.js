import {create} from "zustand";
import axios from "../lib/axios"; 
import {toast} from "react-hot-toast"
//toast is a function that displays notifications to the user

export const useUserStore = create((set, get)=>({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async ({name, email, password, confirmPassword})=>{
        set({loading:true});

        if(password!==confirmPassword){
            set({loading:false});
            return toast.error("Passwords do not match");
        }
        try{
            const res= await axios.post("/auth/signup",{name, email, password} )
            set({user:res.data,loading:false});
        }catch(err){
            set({loading:false});
            toast.error(err.response.data.message || "An error occurred, try again");
        }
    },
    login: async ({email, password})=>{
        set({loading:true});
        try{
            // the try fails on getting response other than 200 or 201 from backend and receive backend errors in error block here, backend should send valid json
            const res= await axios.post("/auth/login",{email, password} )
            set({user:res.data, loading:false});
        }catch(err){
            set({loading:false});
            toast.error(err.response.data.message || "An error occurred, try again"); //axios sends err.response.data then messgae or status whatever
        }
    },

    logout: async ()=>{
        try{
            await axios.post("/auth/logout");
            set({user:null});
        }catch(error){
            toast.error(error.response?.data?.message || "An error occurred during logout, try again");
        }
        
    },

    checkAuth : async ()=>{
        set({ checkingAuth:true });
        try{
            const response = await axios.get("/auth/profile");
            set({user: response.data, checkingAuth: false})
        }catch(error){
            console.log(error.message);
            set({ checkingAuth:false, user:null });
        }
    },
}));

// todo: implement the axios interceptors for refreshing access token