import { Skeleton } from '@/components/ui/skeleton.tsx'

export default function DataTableSkeleton({
  columns
}: {
  columns: string[]
}) {
  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 py-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-50 cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[150px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[200px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[250px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[100px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Skeleton className="h-4 w-[100px]" />
            </td>
          </tr>
          <tr className="hover:bg-gray-50 cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[150px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[200px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[250px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-[100px]" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Skeleton className="h-4 w-[100px]" />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}