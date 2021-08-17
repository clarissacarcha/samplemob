
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

const useAsyncStorage = (
  key: string,
  initialValue: any,
): [any, (value: any) => Promise<void>, boolean] => {
  const [data, setData] = useState(initialValue)
  const [fromStorage, setFromStorage] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const value = await AsyncStorage.getItem(key)

        setData(JSON.parse(value) || initialValue)
      } catch (error) {
        console.error('useAsyncStorage getItem error:', error)
      } finally {
        setFromStorage(true)
      }
    })()
  }, [key, initialValue])

  const setNewData = async (value) => {
    try {
      setData(value)
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('useAsyncStorage setItem error:', error)
    }
  }

  return [data, setNewData, fromStorage]
}
export default useAsyncStorage