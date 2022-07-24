import { ColType, TableModel } from "../components/Table/Table";

export function sortTable(table: TableModel, column: number, type:"ascending"|"descending", colType: ColType) {
    const newTable = [...table];
    
    function compare(a: string, b:string, type: ColType) {
        if(type === "number"){
            const [A, B] = [parseFloat(a), parseFloat(b)];
            if(A<B){
                return -1
            }
            if(A>B){
                return 1
            }
            return 0
        }
        if(type === "date"){
            const [A,B] = [new Date(a).getTime(), new Date(b).getTime()];
            if(A<B){
                return -1
            }
            if(A>B){
                return 1
            }
            return 0
        }
        if(type === "string"){
            return a.localeCompare(b);
        }
        throw new Error("Wront column type "+type);
    }


    newTable.sort((a,b)=>{
        if(type ==="ascending"){
            return compare(a[column],b[column], colType);
        }
        else {
            return -compare(a[column],b[column], colType);
        }
    });
    return newTable
}