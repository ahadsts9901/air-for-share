import axios from "axios";
import "./Body.css";
import { useEffect, useState } from "react";
import { BsTextLeft } from "react-icons/bs";
import { RxFileText } from "react-icons/rx";
import { _1gbSize, baseUrl } from "../../utils/core";
import { base64ToBlob, copyText, extractText, formatFileSize } from "../../utils/functions";
import { ImCross } from "react-icons/im";
import { FiDownload } from "react-icons/fi";
import { errorMessages } from "../../utils/errorMessages";

export const Sidebar = ({ isText, setIsText }: any) => {

    const sidebarOptions = [
        {
            label: <BsTextLeft className="sidebar-icons" />,
            fun: () => setIsText(true),
        },
        {
            label: <RxFileText className="sidebar-icons" />,
            fun: () => setIsText(false),
        },
    ];

    return (
        <>
            <ul className="sidebar">
                <h3>{isText ? "Text" : "File"}</h3>
                {sidebarOptions.map((opt, i) => (
                    <li
                        key={i}
                        onClick={opt.fun}
                        className={`${isText === (i === 0) ? "special" : ""}`}
                    >
                        {opt.label}
                    </li>
                ))}
            </ul>
        </>
    )

}

export const TextSection = ({ location, isText }: any) => {

    const [text, set_text] = useState("")
    const [button_content, set_button_content] = useState("Save")
    const [is_typed, set_is_typed] = useState(false)

    useEffect(() => {

        if ((!text || text?.trim() === "") && is_typed) {
            removeText()
        } else if (!text || text?.trim() === "" || is_typed) {
            set_button_content("Save")
        } else {
            set_button_content("Copy")
        }
    }, [text])

    useEffect(() => {
        if (!isText) return
        if (!is_typed) getText()
        saveText()
    }, [location, isText])

    const getText = async () => {
        if (!location) return
        if (!location?.latitude) return
        if (!location?.longitude) return

        try {
            const resp = await axios.get(`${baseUrl}/api/v1/text?latitude=${location?.latitude}&longitude=${location?.longitude}`, {
                withCredentials: true
            })
            set_button_content("Copy")
            set_text(resp?.data?.data?.textData?.text)
        } catch (error) {
            console.error(error)
        }
    }

    const clear = () => {
        removeText()
        set_text("")
        set_button_content("Save")
    }

    const handleClick = () => {
        switch (button_content) {
            case "Save":
                saveText()
                break;
            case "Copy":
                copyText(text)
                break;
            default:
                break;
        }
    }

    const saveText = async () => {
        if (!text || text?.trim() === "") return
        if (!location) return
        if (!location?.latitude) return
        if (!location?.longitude) return

        try {
            await axios.post(`${baseUrl}/api/v1/text`, {
                text: text,
                latitude: location?.latitude,
                longitude: location?.longitude,
            }, { withCredentials: true })
            set_is_typed(false)
            set_button_content("Copy")
            getText()
        } catch (error) {
            console.error(error)
        }
    }

    const removeText = async () => {
        if (!location) return
        if (!location?.latitude) return
        if (!location?.longitude) return

        try {
            await axios.delete(`${baseUrl}/api/v1/text?latitude=${location?.latitude}&longitude=${location?.longitude}`, { withCredentials: true })
            set_button_content("Save")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="text-section section">
                <h3>Text</h3>
                <textarea placeholder="Type something..." value={text} onChange={(e: any) => {
                    set_text(e?.target?.value)
                    set_is_typed(true)
                }}></textarea>
                <div className="buttons-cont">
                    <button className="clearButton" onClick={clear}>Clear</button>
                    <button className="saveButton" onClick={handleClick}>{button_content}</button>
                </div>
            </div>
        </>
    )
}

export const FileInstructions = ({ set_files }: any) => {

    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e?.dataTransfer?.files;
        if (files?.length) {
            set_files(files);
        }
    };

    return (
        <>
            <div
                className={`fileInstructions ${isDragging ? "dragging" : ""}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="files-sts"
                    hidden
                    multiple
                    onChange={(e: any) => set_files(e?.target?.files)}
                />
                <p>Drag and drop any files, or <label htmlFor="files-sts">browse</label>. The total size of all files must not exceed 1 GB.</p>
            </div>
        </>
    )
}

export const FilesCont = ({ data_files, location, getFiles }: any) => {

    return (
        <>
            <div className="files-container">
                {data_files?.map((file: any, i: number) => <SingleFile key={i} file={file} location={location} getFiles={getFiles} />)}
            </div>
        </>
    )
}

export const SingleFile = ({ file, location, getFiles }: any) => {
    const removeFile = async () => {
        if (!file) return
        if (!file?._id || file?._id?.trim() === "") return

        try {
            const query = `?latitude=${location?.latitude}&longitude=${location?.longitude}&path=${file?.fileData?.filePath}`
            await axios.delete(`${baseUrl}/api/v1/files/${file?._id}${query}`, {
                withCredentials: true
            })
            getFiles()
        } catch (error) {
            console.error(error)
        }
    }

    const downloadFile = async () => {
        if (!file) return
        if (!file?.fileData?.filePath || file?.fileData?.filePath?.trim() === "") return

        try {
            const resp = await axios.get(`${baseUrl}/api/v1/download?path=${file?.fileData?.filePath}&filename=${file?.fileData?.filename}`,
                { withCredentials: true })
            const { base64, filename } = resp?.data?.data
            const blob = base64ToBlob(base64)
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="single-file">
                <ImCross onClick={removeFile} />
                <div className="cont" onClick={downloadFile}>
                    <p>{extractText(file?.fileData?.filename, 8)}</p>
                    <h3>{formatFileSize(file?.fileData?.fileSize)}</h3>
                    <div><FiDownload /> <span>Click to download</span></div>
                </div>
            </div>
        </>
    )
}

export const Loading = () => {
    return (
        <>
            <div className="loading-cont">
                <div className="loader"></div>
            </div>
        </>
    )
}

export const FileSection = ({ location, isText }: any) => {

    const [files, set_files] = useState<any>(null)
    const [data_files, set_data_files] = useState<any[]>([])
    const [is_added, set_is_added] = useState(false)
    const [is_loading, set_is_loading] = useState(false)

    useEffect(() => {
        if (isText) return
        if (!is_added) getFiles()
        sendFiles()
    }, [location, files, isText])

    const getFiles = async () => {
        if (!location) return
        if (!location?.latitude) return
        if (!location?.longitude) return

        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/api/v1/files?latitude=${location?.latitude}&longitude=${location?.longitude}`, {
                withCredentials: true
            })
            set_data_files(resp?.data?.data)
            set_is_added(false)
            set_is_loading(false)
            set_is_loading(false)
        } catch (error) {
            console.error(error)
            set_is_loading(false)
        }
    }

    const sendFiles = async () => {
        if (!files) return
        if (!files?.length) return
        if (!files?.[0]) return
        if (!location) return
        if (!location?.latitude) return
        if (!location?.longitude) return

        let totalFileSize = 0;
        let sizeExceeded = false;

        for (let i = 0; i < files?.length; i++) {
            totalFileSize += files[i]?.size
            if (files[i].size > _1gbSize) {
                sizeExceeded = true
                break
            }
        }

        if (sizeExceeded) {
            alert(errorMessages?.oneFileSizeExceeds)
            return
        }

        if (totalFileSize > _1gbSize) {
            alert(errorMessages?.multipleFilesSizeExceeds)
            return
        }

        try {
            const formData = new FormData()
            for (let i = 0; i < files?.length; i++) { formData.append("files", files[i]) }
            formData.append("latitude", location?.latitude)
            formData.append("longitude", location?.longitude)

            await axios.post(`${baseUrl}/api/v1/files`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            })

            set_is_added(true)
            set_files(null)
            getFiles()
        } catch (error: any) {
            console.error(error)
            if (error.response.status == 403) {
                alert(errorMessages?.multipleFilesSizeExceeds)
                return
            }
        }
    }

    return (
        <>
            <div className="file-section section">
                <h3>File</h3>
                <div className="files-cont">
                    {
                        is_loading ? <Loading /> :
                            (files?.length || data_files?.length) ? <FilesCont location={location} data_files={data_files} getFiles={getFiles} /> : <FileInstructions files={files} set_files={set_files} />
                    }
                </div>
            </div>
        </>
    )
}

export const Main = ({ isText }: any) => {

    const [location, set_location] = useState<any>(null)

    useEffect(() => {
        const intervalId = setInterval(() => {
            getCurrentLocation();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const getCurrentLocation = () => {
        if (navigator?.geolocation) {
            navigator.geolocation.getCurrentPosition
                (
                    (position) => { set_location({ latitude: position.coords.latitude, longitude: position.coords.longitude }) },
                    (error) => { console.error(error) }
                );
        } else {
            console.error("geolocation is not supported by this browser.");
        }
    };

    return (
        <>
            <div className="_main">
                {isText ? <TextSection location={location} isText={isText} /> : <FileSection location={location} isText={isText} />}
            </div>
        </>
    )

}

const Body = () => {

    const [isText, setIsText] = useState(true);

    return (
        <div className="air-body">
            <Sidebar isText={isText} setIsText={setIsText} />
            <Main isText={isText} setIsText={setIsText} />
        </div>
    );
};

export default Body;