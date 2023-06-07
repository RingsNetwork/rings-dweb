import { useCallback } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { API_URL } from '../utils/const'

const useNfts = () => {
  const fetchNfts = useCallback(async () => {
    const { data } = await axios.get(`${API_URL}/api/nfts/`)

    return data
  }, [])

  return useQuery(['nfts'], fetchNfts)
}

export default useNfts