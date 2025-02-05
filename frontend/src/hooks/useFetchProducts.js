import {useState, useEffect} from "react";
import api from "../api/config";

const useFetchProducts = (storeId) =>{
    const [products, setProducts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{
        const fetchProducts = async ()=>{
            if(!storeId || storeId.length !== 24){
                setError("Invalid storeid");
                setLoading(false);
                return;
            }

            try{
                const response = await api.get(`/product/getProducts/${storeId}`);
                if(response.data){
                    setProducts(response.data);
                }

            }catch(error){
                setError(error.message);
            }finally{
                setLoading(false);
            }
        };
        fetchProducts();

    },[storeId]);
    return {products,loading,error};
}

export default useFetchProducts;
