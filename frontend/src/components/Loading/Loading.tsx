import { useEffect, useState } from "react";
import "./Loading.scss";

export function Loading() {
    const [loading, setLoading] = useState("Loading");

    function createCounter() {
        let index = 0
        return function counter(){
            if(index>2){
                index = 0
                setLoading("Loading")
            }else{
                index++;
                setLoading((l)=>l+=".");
            }
        }
    }
    useEffect(()=>{
        let interval = setInterval(createCounter(), 800);
        return ()=>{
            clearInterval(interval);
        }
    },[])
    return(
        <div className="loading">{loading}</div>
    );
}