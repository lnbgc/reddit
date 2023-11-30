import { Button } from "@components/ui/Button";
import { Textarea } from "@components/ui/Textarea";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { MessageCircle } from "lucide-react"
import { useState } from "react"

export const CreateReply = ({ postID, commentID }) => {

    const { userData } = useAuth();
    const [content, setContent] = useState("");
    const [show, setShow] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === "") {
            return;
        }
        try {
            const replies = collection(db, "replies");
            const replyDoc = await addDoc(replies, {
                content,
                createdBy: userData.uid,
                createdAt: serverTimestamp(),
                upvotes: [],
                downvotes: [],
                post_id: postID,
                parent_id: commentID
            });
            const replyID = replyDoc.id;
            await updateDoc(replyDoc, { id: replyID });

            const userDoc = doc(db, "users", userData.uid);
            await updateDoc(userDoc, {
                comments: arrayUnion(replyID)
            });
            const postDoc = doc(db, "posts", postID);
            await updateDoc(postDoc, {
                comments: arrayUnion(replyID)
            });
            setContent("");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Could not create reply:", error);
        }
    }

    const handleContent = (value) => {
        setContent(value);
    };

    const showReply = () => {
        setShow(!show);
    };

    return (
        <div>
            <div className="flex font-medium text-sm items-center gap-1 cursor-pointer bg-secondary w-fit p-2 rounded-md select-none" onClick={showReply}>
                <MessageCircle className="icon-sm" />
                Reply
            </div>
            {show && (
                <div className="mt-3 flex flex-col gap-2">
                    <Textarea
                        value={content}
                        onChange={handleContent}
                        placeholder="What are your thoughts?"
                    />
                    <div className="space-x-2">
                        <Button type="secondary" onClick={showReply}>Cancel</Button>
                        <Button type="primary" onClick={handleSubmit}>Reply</Button>
                    </div>
                </div>
            )}
        </div>
    )
}