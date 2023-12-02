import { Button } from "@components/ui/Button";
import { Textarea } from "@components/ui/Textarea";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { MessageSquare } from "lucide-react"
import { useState } from "react"

export const ReplyButton = ({ setShow }) => {
    return (
        <div className=" flex font-medium text-sm items-center gap-1 cursor-pointer w-fit select-none" onClick={() => setShow((show) => !show)}>
            <MessageSquare className="icon-sm" />
            Reply
        </div>
    )
}

export const ReplyForm = ({ commentID, postID, show, setShow }) => {
    const { userData } = useAuth();
    const [content, setContent] = useState("");

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

    return (
        <div className={`flex flex-col gap-2 ${show ? "" : "hidden"}`}>
            <Textarea
                value={content}
                onChange={handleContent}
                placeholder="What are your thoughts?"
            />
            <div className="space-x-2">
                <Button type="secondary" onClick={() => setShow(false)}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit}>Reply</Button>
            </div>
        </div>
    )
}