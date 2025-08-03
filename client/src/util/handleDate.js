export const handleDate=(rawDate)=>{
    const date = new Date(rawDate).toLocaleString();
    return date;
}