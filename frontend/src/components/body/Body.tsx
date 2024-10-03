import { useState } from "react";
import "./Body.css";
import { BsTextLeft } from "react-icons/bs";
import { RxFileText } from "react-icons/rx";

const Body = () => {
    const [isText, setIsText] = useState(true);

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
        <div className="air-body">
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
        </div>
    );
};

export default Body;