import { Filter } from "lucide-react"

export const Filters = () => {
    return (
        <div className="text-sm font-medium flex items-center gap-3 pb-4">
            <div className="flex items-center gap-2">
                <Filter className="icon-sm" />
                Filter by:
            </div>
            <span className="underline hover:underline underline-offset-2 cursor-pointer">New</span>
            <span className="hover:underline underline-offset-2 cursor-pointer">Top</span>
        </div>
    )
}
