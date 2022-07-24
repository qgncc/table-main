import { ChangeEvent, FC, FormEvent, useCallback } from "react"
import { useForm } from "../../hooks/useForm"
import { Props } from "../../types"
import { Column, ConditionName } from "../Table/Table"
import "./FilterForm.scss"

interface FilterProps extends Omit<Props, "children">{
    columns: Column[],
    filterFunc:(isApplied: boolean,column: string, type: ConditionName, value: string)=> void;
}

export const FilterForm: FC<FilterProps> = ({columns, filterFunc}) =>{
    // Функция для передачи в useForm
    const onChangeFunc = useCallback(
        function (
            event: ChangeEvent<any>,
            state: {
                    column: string|null,
                    condition: ConditionName| null,
                    value: string
                }
        ){
            // если в select колонок поменяли колнку, то меня select условий фильтрации в соответсвии с выбранной колонкой
            if(event.target.name === "column"){
                const newState = {...state}
                const column = columns.find((elem)=> elem.name === event.target.value)
                newState.condition = (column && column.filters && column.filters[0].name )|| null;
                return newState;
            }
            else return {...state};
        },[columns]);
    
    function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const target = (e.nativeEvent as SubmitEvent).submitter as HTMLInputElement
        if(!state.column || !state.condition || !state.value) return;
        if(target.name === "apply"){
            filterFunc(true, state.column, state.condition, state.value);
        }
        if(target.name === "cancel"){
            filterFunc(false, state.column, state.condition, state.value);
        }
    }
    // Первая по счету колонка, которой доступна фильтрация...
    const firstColumn = columns.find((column)=>column.filters !== undefined);
    // ...её имя 
    const firsColumnName = firstColumn?.name || null;
    // ...её фильтры
    const filters = firstColumn?.filters;
    // ...имя первого по счету фильтра
    const filterName = (filters && filters[0].name) || null
    
    const [state, onChange] = useForm({column: firsColumnName,condition: filterName, value: ""}, onChangeFunc);
    // создаем компоненты option для select колонок
    const columnsElem = columns.filter((column=>column.filters!==undefined)).map((col)=>{

        const text = col.text? col.text: col.name;
        const name = col.name;
        return( 
            <option key={name} value={name}>
                {text}
            </option>
        );
    })
    // текущая выбранная колонка
    const currentColumn = columns.find((column)=>column.name === state.column);

    // создаем компоненты option для select фильтров
    const conditionsElem = currentColumn && currentColumn.filters!.map((condition)=>{
        const text = condition.text? condition.text:condition.name;
        const name = condition.name;
        return( 
            <option key={name} value={name}>
                {text}
            </option>
        );
    })



    return(
        <form className="filterForm" onSubmit={handleSubmit}>
            <select className="filterForm__select" name="column" value={state.column || ""} onChange={onChange}>
                {columnsElem}
            </select>
            <select className="filterForm__select" name="condition" value={state.condition || ""} onChange={onChange}>
                {conditionsElem}
            </select>  
            <input className="filterForm__input" name="value" type="text" value={state.value} onChange={onChange}/>
            <div className="buttonGroup filterForm__buttonGroup">
                <input className="button filterForm__button button--hover--green" type="submit" name="apply" value="Применить фильтр"/>
                <input className="button filterForm__button button--hover--red" type="submit" name="cancel" value="Сбросить фильтр"/>
            </div>
        </form>
    )
}