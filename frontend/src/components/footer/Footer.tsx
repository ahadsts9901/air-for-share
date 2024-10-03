import "./Footer.css"
import { facebookUrl, githubUrl, linkedinUrl, whatsappUrl, youtubeUrl } from "../../utils/core"
import { FaFacebook, FaLinkedinIn, FaWhatsapp, FaYoutube, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <>
            <div className="footer">
                <p>2024 - {new Date().getFullYear()} github.com/ahadsts9901</p>
                <p>Made by <a href={githubUrl}>Muhammad Ahad</a> with ❤️</p>
                <div className="social-links">
                    <a href={facebookUrl}><FaFacebook /></a>
                    <a href={linkedinUrl}><FaLinkedinIn /></a>
                    <a href={whatsappUrl}><FaWhatsapp /></a>
                    <a href={youtubeUrl}><FaYoutube /></a>
                    <a href={githubUrl}><FaGithub /></a>
                </div>
            </div>
        </>
    )
}

export default Footer