import "./Header.css"
import logo from "/logo.svg"

const Logo = () => {

    // const navbarOptions = [
    //     {
    //         label: "How it works",
    //         path: "/",
    //     },
    //     {
    //         label: "Download",
    //         path: "/",
    //     },
    //     {
    //         label: "Upgrade",
    //         path: "/",
    //     },
    //     {
    //         label: "Feedback",
    //         path: "/"
    //     }
    // ]

    return (
        <>
            <div className="header">
                <img src={logo} alt="logo" />
            </div>
        </>
    )
}

export default Logo