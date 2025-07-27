import {create} from "zustand";
import axios from "../lib/axios"; 
import {toast} from "react-hot-toast"
//toast is a function that displays notifications to the user

export const useUserStore = create((set, get)=>({
    user:null,
    loading:false,
    checkingAuth:true,
    //signup is a method (function property) of the object.
    signup: async ({name, email, password, confirmPassword})=>{
        set({loading:true});

        if(password!==confirmPassword){
            set({loading:false});
            return toast.error("Passwords do not match");
        }
        try{
            const res= await axios.post("/auth/signup",{name, email, password} )
            //res.data is the user object returned from the backend
            //res.data,status   // HTTP status code ,statusText  // HTTP status message ,headers   // Response headers ,config    // Axios request config ,request  // The request object
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

    refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);