import { Dexie, type EntityTable } from 'dexie'

export interface Gridnote {
  id: string
  data: string[]
  fileName: string
  cover: string
  date: string
  pages: number
}

const db = new Dexie('dyslexia') as Dexie & {
  gridnotes: EntityTable<Gridnote, 'id'>
}

const fields = [
  '&id',
  'date',
  'pages'
]

db.version(1).stores({ gridnotes: fields.join(',') })

const useGridnotes = () => {
  return { gridnotes: db.gridnotes }
}

export default useGridnotes
