import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { API_URL } from '../utils/const'

const useTopCurrency = () => {
  return useQuery(['top10'], async () => {
    const { data } = await axios.get(`${API_URL}/api/top10/`)

    return data
  })
}

export default useTopCurrency