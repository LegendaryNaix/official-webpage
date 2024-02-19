import Table from '@/components/Table'

const headers = [
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'gender',
    label: 'Gender'
  },
  {
    key: 'age',
    label: 'Age'
  }
]

const items = [
  {
    name: 'Michael',
    gender: 'male',
    age: '23'
  },
  {
    name: 'Michael',
    gender: 'male',
    age: '23'
  },
  {
    name: 'Michael',
    gender: 'male',
    age: '23'
  }
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Table headers={headers} items={items} />
      </div>
    </main>
  )
}
