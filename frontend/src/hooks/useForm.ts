import { ChangeEvent, useState } from "react";


export function useForm<T>(inputs: T, onChangeFunc?:(event: ChangeEvent<any>, state: T)=>T): [T, (event: ChangeEvent<any>) => void]{
    
    const [inputsState, setInputsState] = useState<T>(inputs)
    function onChange(event: ChangeEvent<any>) {
        
        setInputsState((oldState)=>{
            const newState: T = onChangeFunc? onChangeFunc(event, oldState):{...oldState}
            newState[event.target.name as keyof T] = event.target.value;
            return newState;
        })    
    }

    return [inputsState, onChange];
}