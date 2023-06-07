import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { API_URL } from '../utils/const'

const useCoinData = () => {
  return useQuery(['cionData'], async () => {
    const { data } = await axios.get(`${API_URL}/api/coindata/`)

    return data
  })
}

export default useCoinData