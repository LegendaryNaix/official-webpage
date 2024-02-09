interface Header {
  key: string
  label: string
}

interface Item {
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
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-700">
            <TableHeader headers={headers} />
            <tbody className="divide-y divide-gray-800">
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
        {headers.map((header) => (
          <th
            key={header.key}
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
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
      {columnKeys.map((key) => (
        <td
          key={key}
          className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
        >
          {item[key]}
        </td>
      ))}
    </tr>
  )
}
