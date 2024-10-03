import "./Footer.css"
import { facebookUrl, githubUrl, linkedinUrl, whatsappUrl, youtubeUrl } from "../../utils/core"
import { FaFacebook, FaLinkedinIn, FaWhatsapp, FaYoutube, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <>
            <div className="footer">
                <p>2024 - {new Date().getFullYear()} github.com/ahadsts9901</p>
                <p>Made by <a target="_blank" href={githubUrl}>Muhammad Ahad</a> with ❤️</p>
                <div className="social-links">
                    <a target="_blank" href={facebookUrl}><FaFacebook /></a>
                    <a target="_blank" href={linkedinUrl}><FaLinkedinIn /></a>
                    <a target="_blank" href={whatsappUrl}><FaWhatsapp /></a>
                    <a target="_blank" href={youtubeUrl}><FaYoutube /></a>
                    <a target="_blank" href={githubUrl}><FaGithub /></a>
                </div>
            </div>
        </>
    )
}

export default Footer