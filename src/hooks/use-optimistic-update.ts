import { useState, useCallback } from 'react'

export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData)
  const [optimisticData, setOptimisticData] = useState<T>(initialData)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateOptimistically = useCallback(
    async (newData: T) => {
      // Immediately update UI
      setOptimisticData(newData)
      setIsUpdating(true)
      setError(null)

      try {
        // Perform actual update
        const result = await updateFn(newData)
        setData(result)
        setOptimisticData(result)
      } catch (err) {
        // Revert on error
        setOptimisticData(data)
        setError(err instanceof Error ? err : new Error('Update failed'))
      } finally {
        setIsUpdating(false)
      }
    },
    [data, updateFn]
  )

  return [optimisticData, updateOptimistically, isUpdating, error] as const
}
