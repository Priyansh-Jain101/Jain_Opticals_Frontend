// format date function
export function formatedDate(dateString) {
    console.log("Formatting date:", dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: "numeric", minute: "2-digit",second: "2-digit",hour12: true};
    return new Date(dateString).toLocaleDateString("en-US", options);
}