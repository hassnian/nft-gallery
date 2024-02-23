import { LoadDirection } from './useListInfiniteScroll'

export default <T = any>() => {
  const loadedPages = ref([] as number[])
  const items = ref<T[]>([])

  const addItems = ({
    page,
    entities,
    loadDirection,
  }: {
    entities: T[]
    loadDirection: LoadDirection
    page: number
  }) => {
    if (!loadedPages.value.includes(page)) {
      if (loadDirection === 'up') {
        items.value = [...entities, ...items.value]
      } else {
        items.value = [...items.value, ...entities]
      }
      loadedPages.value.push(page)
    }
  }

  function clearFetchResults() {
    items.value = []
    loadedPages.value = []
  }

  return { items, addItems, clearFetchResults }
}
