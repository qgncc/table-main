import { FC, ReactNode, MouseEvent, useMemo, useState, useCallback} from "react";
import "./Table.scss"
import { FilterForm } from "../Sort/FilterForm";

type Condition = {name: ConditionName, text?: string}
export type ConditionName = "has"|"equal"|"more"|"less";
export type TableModel = string[][]
export type ColType = "number"|"string"|"date"
export type Column = {
    name: string, 
    colType: ColType, 
    text?: string, 
    filters?: Condition[]
};
type SortStatus = {
    type:"ascending"|"descending",
    column: string,
    colType: ColType
};
type FilterStatus =  {
    isApplied: boolean,
    column: string|null, 
    value: string|null, 
    type: ConditionName|null
}
interface TableProps{
    columns: Column[];
    table: TableModel;
    sortedColumnNumber?: number;
    sortFunc:(table:TableModel, column: number, type: "ascending"|"descending", colType: ColType)=> TableModel,
    filterFunc:(table:TableModel, column: number|null, type: ConditionName, value: string|null)=> TableModel,
}



export const Table: FC<TableProps> = ({table, columns, sortFunc, filterFunc,sortedColumnNumber})=>{
    const firstFiltrableColumn = columns.find((column)=>column.filters !== undefined);
    const [sortStatus, setSortStatus] = useState<SortStatus>({
        type: "ascending", 
        column: columns[sortedColumnNumber || 0].name,
        colType: columns[sortedColumnNumber || 0].colType
    });
    const [filterStatus, setFilterStatus] = useState<FilterStatus>({
        isApplied: false,
        type: (firstFiltrableColumn?.filters && firstFiltrableColumn.filters[0].name) || null, 
        column: firstFiltrableColumn?.name || null,
        value: null
    })
    function handleClick(event: MouseEvent<HTMLElement>) {
        if(event.target === event.currentTarget) return;
        const target = event.target as HTMLElement
        const id = target.id;
        setSortStatus((oldState)=>{
            const newState = {...oldState};
            if(oldState.column === id){
                newState.type = oldState.type === "ascending"? "descending": "ascending"
                return newState
            }else{
                const column = columns.find((col)=>col.name === id);
                newState.type = "ascending";
                newState.column = id;
                newState.colType = column?.colType || "string"
                return newState;
            }
        });

    }


    //Каждый раз когда меняется состояние сортировки, состяние фильрации
    // или сама таблица, компонент ререндерится.

    function getTable(
        table: TableModel,
        sortStatus: SortStatus,
        filterStatus: FilterStatus
    ){
        if(!table) {
            console.log("No table")
            return [];
        };
        // ищем номер колонки по которой будет отсортирована таблица
        const numOfColumnForSort = columns.findIndex((col)=>col.name === sortStatus.column);
        //ище номер колнки по который будет отфильтрована таблица
        const numOfColumnForFilter = columns.findIndex((col)=>col.name === filterStatus.column);
        let filtred;
        // Если нажата кнопка применить фильтр, 
        // а также найдина колонка по которой будет происходить фильтрация...
        if(filterStatus.isApplied 
            && filterStatus.type 
            && numOfColumnForFilter !== -1
        ) {
        // ...фильтруем таблицу и возвращаем новый объект
            filtred =  filterFunc(table, numOfColumnForFilter, filterStatus.type, filterStatus.value);
        }
        else filtred = table;

        let sortred = numOfColumnForSort !== -1? sortFunc(filtred,numOfColumnForSort, sortStatus.type, sortStatus.colType): filtred;
        return sortred;
    }
    const getTableSaved = useCallback(getTable,[columns, filterFunc, sortFunc])
    const currentTable = useMemo(()=>getTableSaved(table, sortStatus, filterStatus), [table, sortStatus, filterStatus, getTableSaved]);

    // создаем компоненты ячеек таблицы по модели
    function buildTable(table: TableModel) {
        const tableInners: ReactNode[] = [];
        for (let i = 0; i < table.length; i++) {
            const row: ReactNode[] = []
            let allCells = table[i][0];
            for (let j = 0; j < table[0].length; j++) {
                const cell = table[i][j];
                allCells+=cell;
                const element = <td key={cell}>{cell}</td>
                row.push(element);
            }
            tableInners.push(<tr key={allCells}><td>{i+1}</td>{row}</tr>)
        }
        return tableInners;
    }
    // создаем компоненты заголовков колонок по модели
    function buildColumns(columns: Column[]) {
        const row = columns.map((cell)=>{
            return <th id={cell.name} key={cell.name}>{cell.text}</th>
        });
        return (<tr onClick={handleClick}>
                <th>№</th>
                    {row}
                </tr>
        )
    }

    function filter(isApplied: boolean, column: string, type: ConditionName, value: string) {
        setFilterStatus({isApplied,type,column,value});
    }

    return(
        <div className="table-wrapper">
        {table && <FilterForm columns={columns} filterFunc={filter}/>}
        <table className="table">
            <thead className="table__header">
                {buildColumns(columns)}
            </thead>
            <tbody className="table__body">
                {buildTable(currentTable)}
            </tbody>
        </table>
        </div>
    );
}