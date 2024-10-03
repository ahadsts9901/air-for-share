import "./Body.css";
import { useState } from "react";
import { BsTextLeft } from "react-icons/bs";
import { RxFileText } from "react-icons/rx";

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

export const TextSection = () => {

    const [text, set_text] = useState("")
    const [button_content, set_button_content] = useState("Save")

    console.log(text, set_button_content)

    const clear = () => {
        console.log("clear");
    }

    const handleClick = () => {
        console.log("handle click")
    }

    return (
        <>
            <div className="text-section section">
                <h3>Text</h3>
                <textarea placeholder="Type something..." onChange={(e: any) => set_text(e?.target?.value)}></textarea>
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

export const FileSection = () => {

    const [files, set_files] = useState<any>(null)

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

    return (
        <>
            <div className="_main">
                {isText ? <TextSection /> : <FileSection />}
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