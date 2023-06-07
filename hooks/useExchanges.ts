import { useCallback } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { API_URL } from '../utils/const'

const useExchanges = () => {
  const fetchExchanges = useCallback(async () => {
    const { data } = await axios.get(`${API_URL}/api/exchanges/`)

    return data
  }, [])

  return useQuery(['exchanges'], fetchExchanges)
}

export default useExchanges