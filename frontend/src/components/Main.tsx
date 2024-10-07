import './Main.css'
import axios from 'axios'
import Body from './body/Body'
import Footer from './footer/Footer'
import Header from './header/Header'
import { baseUrl } from '../utils/core'
import { useEffect } from 'react'

const Main = () => {

    useEffect(() => {
        deleteFilesCronJob()
    }, [])

    const deleteFilesCronJob = async () => {
        try {
            await axios.delete(`${baseUrl}/api/v1/files`, {
                withCredentials: true
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="body">
            <Header />
            <Body />
            <Footer />
        </div>
    )
}

export default Main