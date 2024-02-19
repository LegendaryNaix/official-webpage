import clsx from 'clsx'

interface Header {
  key: string
  label: string
}

interface Item {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface TableHeaderProps {
  headers: Header[]
}

interface TableRowProps {
  item: Item
  columnKeys: string[]
}

interface TableProps {
  items: Item[]
  headers: Header[]
}

export default function Table({ items, headers }: TableProps) {
  const columnKeys = headers.map((header) => header.key)

  return (
    <div className="mt-8 flow-root rounded-lg bg-zinc-800">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-zinc-700">
            <TableHeader headers={headers} />
            <tbody className="divide-y divide-zinc-700">
              {items.map((item) => (
                <TableRow key={item.id} item={item} columnKeys={columnKeys} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TableHeader({ headers }: TableHeaderProps) {
  return (
    <thead>
      <tr>
        {headers.map((header, index, arr) => (
          <th
            key={header.key}
            scope="col"
            className={clsx(
              'py-3.5 text-left text-sm font-semibold text-gray-50',
              {
                'pl-4 pr-3 sm:pl-6': index === 0,
                'px-3': index > 0,
                'sm:pr-6': index === arr.length - 1
              }
            )}
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function TableRow({ item, columnKeys }: TableRowProps) {
  return (
    <tr>
      {columnKeys.map((key, index, arr) => (
        <td
          key={key}
          className={clsx('whitespace-nowrap py-4 text-sm text-slate-300', {
            'pl-4 pr-3 sm:pl-6': index === 0,
            'px-3': index > 0,
            'relative sm:pr-6': index === arr.length - 1
          })}
        >
          {item[key]}
        </td>
      ))}
    </tr>
  )
}
