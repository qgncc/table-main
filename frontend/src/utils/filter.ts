import { TableModel } from "../components/Table/Table";
export function filterTable(table: TableModel, column: number|null, type:"has"|"equal"|"more"|"less"|null ,value: string|null): TableModel {
    if(!table || !value || !column || !type) return table;

    const has = function has() {
        return table.filter((row)=>row[column].includes(value));
    }
    const greaterThan = function greaterThan() {
        const sample = parseFloat(value)
        return table.filter((row)=>{
            const cellValue = parseFloat(row[column]);
            return cellValue>sample
        });
    }
    const lessThan = function lessThan() {
        const sample = parseFloat(value)
        return table.filter((row)=>{
            const cellValue = parseFloat(row[column]);
            return cellValue<sample
        });
    }
    const equalsTo = function equalsTo() {
        const sample = parseFloat(value)
        return table.filter((row)=>{
            const cellValue = parseFloat(row[column]);
            return cellValue===sample
        });
    }
    switch (type){
        case "has":
            return has();
        case "equal":
            return equalsTo();
        case "less":
            return lessThan();
        case "more":
            return greaterThan();
    }
}