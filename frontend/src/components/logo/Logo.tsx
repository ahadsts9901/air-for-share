import "./Logo.css"
import logo from "/logo.svg"

const Logo = () => {
    return (
        <>
            <div className="header">
                <img src={logo} alt="logo" />
            </div>
        </>
    )
}

export default Logo