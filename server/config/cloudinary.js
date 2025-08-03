import {v2 as Cloudinary} from 'cloudinary'
import 'dotenv/config'

Cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
})

export default Cloudinary;