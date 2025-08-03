import Together from 'together-ai'
import 'dotenv/config'

const together = new Together({apiKey:process.env.TOGETHER_API_KEY})

export default together;