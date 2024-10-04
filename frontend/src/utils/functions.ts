export const copyText = (text: string, fun?: any) => {
    if (!text || text.trim() === "") return
    navigator.clipboard.writeText(text).then(() => {
        if (fun) fun()
    }).catch((err) => console.error(err))
}