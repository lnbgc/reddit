import { useAuth } from "@contexts/AuthContext"
import { db } from "@utils/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Bookmark } from "lucide-react"
import { useEffect, useState } from "react";

export const SavePost = ({ postID }) => {

    const { userData } = useAuth();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(userData?.saved_posts.includes(postID));
    }, [postID, userData]);

    const toggleSave = async () => {
        try {
            if (saved) {
                await updateDoc(doc(db, "users", userData.uid), {
                    saved_posts: arrayRemove(postID),
                });
            } else {
                await updateDoc(doc(db, "users", userData.uid), {
                    saved_posts: arrayUnion(postID),
                })
            }
            setSaved(!saved);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex items-center gap-1 text-sm cursor-pointer" onClick={toggleSave}>
            <Bookmark className={`icon-sm ${saved ? "fill-accent stroke-accent" : ""}`} />
            <span className="hidden md:block">
                {saved ? "Saved" : "Save"}
            </span>
        </div>
    )
}
