import "./Header.css"
import logo from "/logo.svg"

const Logo = () => {

    const navbarOptions = [
        {
            label: "How it works",
            path: "/",
        },
        {
            label: "Download",
            path: "/",
        },
        {
            label: "Upgrade",
            path: "/",
        },
        {
            label: "Feedback",
            path: "/"
        }
    ]

    return (
        <>
            <div className="header">
                <img src={logo} alt="logo" onClick={() => window.location.reload()} />
                <ul>
                    {navbarOptions.map((opt: any, i: number) => <li key={i} onClick={() => window.location.href = "#"}>{opt?.label}</li>)}
                    <li className="login-register">Login/Register</li>
                </ul>
            </div>
        </>
    )
}

export default Logo