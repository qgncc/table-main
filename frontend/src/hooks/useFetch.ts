import { ChangeEvent, useState,useCallback, useEffect } from "react";

export function useFetch(url: RequestInfo|URL, options?: RequestInit): [...ReturnType<typeof useState<any>>, null|string, boolean]{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    useEffect(()=>{
        fetch(url, options)
            .then(response=>{
                if(!response.ok) throw new Error("HTTP Error: " + response.status);
                return response.json()
            })
            .then(data=>{
                setData(data);
                setLoading(false);
            })
            .catch(err=>{
                setLoading(false);
                setErr(err)
                console.log(err.message)
            });
    },[]);
    return [data,setData, err,loading];
}