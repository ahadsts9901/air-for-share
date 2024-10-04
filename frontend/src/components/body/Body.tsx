import axios from "axios";
import "./Body.css";
import { useEffect, useState } from "react";
import { BsTextLeft } from "react-icons/bs";
import { RxFileText } from "react-icons/rx";
import { baseUrl } from "../../utils/core";
import { copyText } from "../../utils/functions";

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

export const TextSection = ({ location }: any) => {

    const [text, set_text] = useState("")
    const [button_content, set_button_content] = useState("Save")
    const [is_typed, set_is_typed] = useState(false)
    const [data, set_data] = useState<any>(null)

    console.log("data", data)

    useEffect(() => {
        if (!text || text?.trim() === "" || is_typed) {
            removeText()
        } else {
            set_button_content("Copy")
        }
    }, [text])

    useEffect(() => {
        if (!is_typed) getText()
        saveText()
    }, [location])

    const getText = async () => {
        if (!location) return
        if (!location?.latitude) return
        if (!location?.longitude) return

        try {
            const resp = await axios.get(`${baseUrl}/api/v1/text?latitude=${location?.latitude}&longitude=${location?.longitude}`, {
                withCredentials: true
            })
            set_button_content("Copy")
            set_data(resp?.data?.data)
            set_text(resp?.data?.data?.textData?.text)
        } catch (error) {
            console.error(error)
        }
    }

    const clear = () => {
        console.log("clear");
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
        try {
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
        const files = e.dataTransfer.files;
        if (files.length) {
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
                <p>Drag and drop any files, or <label htmlFor="files-sts">Browse</label></p>
            </div>
        </>
    )
}

export const FileSection = ({ location }: any) => {

    const [files, set_files] = useState<any>(null)
    console.log(location)

    return (
        <>
            <div className="file-section section">
                <h3>File</h3>
                <div className="files-cont">
                    <FileInstructions files={files} set_files={set_files} />
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
            console.log("geolocation is not supported by this browser.");
        }
    };

    return (
        <>
            <div className="_main">
                {isText ? <TextSection location={location} /> : <FileSection location={location} />}
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