export const copyText = (text: string, fun?: any) => {
    if (!text || text.trim() === "") return
    navigator.clipboard.writeText(text).then(() => {
        if (fun) fun()
    }).catch((err) => console.error(err))
}

export const extractText = (text: string, length: number) => {
    if (text?.length <= length * 2) return text
    const words = text.split('');
    const start = words.slice(0, length).join('');
    const end = words.slice(-length).join('');
    return `${start}...${end}`
}

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};