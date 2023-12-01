import { Button } from "@components/ui/Button";
import { Textarea } from "@components/ui/Textarea";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react"

export const CreateComment = ({ postID }) => {
    const [content, setContent] = useState("");
    const { userData } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === "") {
            return;
        }
        try {
            const comments = collection(db, "comments");
            const commentDoc = await addDoc(comments, {
                content,
                createdBy: userData.uid,
                createdAt: serverTimestamp(),
                upvotes: [],
                downvotes: [],
                post_id: postID,
            })
            const commentID = commentDoc.id;
            await updateDoc(commentDoc, { id: commentID });

            const userDoc = doc(db, "users", userData.uid);
            await updateDoc(userDoc, {
                comments: arrayUnion(commentID)
            });

            const postDoc = doc(db, "posts", postID);
            await updateDoc(postDoc, {
                comments: arrayUnion(commentID)
            });
            setContent("");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Could not create comment:", error);
        }
    }

    const handleContent = (value) => {
        setContent(value);
    };
    return (
        <div className="flex flex-col gap-1">
            <Textarea
                placeholder="What are your thoughts?"
                value={content}
                onChange={handleContent}
            />
            <div className="bg-secondary p-2 rounded-lg">
                <div className="flex justify-end w-full">
                    <Button onClick={handleSubmit} type="primary">Comment</Button>
                </div>
            </div>
        </div>
    )
}