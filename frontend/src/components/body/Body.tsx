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

export const FileSection = () => {
    return (
        <>
            <div className="text-section section">
                <h3>File</h3>
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