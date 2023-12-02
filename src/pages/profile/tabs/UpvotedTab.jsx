import { useAuth } from "@contexts/AuthContext"
import { ArrowBigDown, ArrowBigUp, FileText, MessageSquare } from "lucide-react"
import moment from "moment"

export const UpvotedTab = ({ upvoted, username }) => {

    const { userData } = useAuth();
    
    return (
        <ul className="flex flex-col gap-3">
            {upvoted.map((post) => (
                <li key={post.id} className="border border-border rounded-md p-2 flex gap-4">
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center justify-between font-medium">
                            <ArrowBigUp className={`stroke-[1.5px] ${userData && post.upvotes.includes(userData.uid) ? "fill-accent stroke-accent" : ""}`} />
                            {post.upvotes.length - post.downvotes.length}
                            <ArrowBigDown className={`stroke-[1.5px] ${userData && post.downvotes.includes(userData.uid) ? "fill-accent stroke-accent" : ''}`} />
                        </div>
                        {post.image ? (
                            <img src={post.image} className="rounded-md object-cover w-28 h-24" />

                        ) : (
                            <div className="rounded-md border border-border flex justify-center items-center w-28 h-24">
                                <FileText className="text-faint" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="font-bold text-muted hover:underline">
                                {post.title}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="font-bold hover:underline">r/</div>
                                <p>posted by u/{username}</p>
                                <span className="w-1 h-1 bg-faint block rounded-full" />
                                <p>{moment(post.createdAt.toDate()).fromNow()}</p>
                            </div>
                        </div>
                        <div className="text-sm font-medium">
                            <div className="flex items-center gap-1">
                                <MessageSquare className="icon-sm" />
                                {post.comments.length} comments
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
