import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react";

export const Vote = ({ type, id, upvotes, downvotes }) => {
    const { userData } = useAuth();
    const [totalVotes, setTotalVotes] = useState(upvotes.length - downvotes.length);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        const docPath = () => {
            return type === "post" ? "posts"
                : type === "comment"
                    ? "comments"
                    : "replies"
        }
        const docRef = doc(db, docPath(), id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            const updatedUpvotes = doc.data()?.upvotes || [];
            const updatedDownvotes = doc.data()?.downvotes || [];
            setTotalVotes(updatedUpvotes.length - updatedDownvotes.length);

            if (userData) {
                const hasUpvoted = updatedUpvotes.includes(userData.uid);
                const hasDownvoted = updatedDownvotes.includes(userData.uid);

                if (hasUpvoted) {
                    setUserVote("upvote");
                } else if (hasDownvoted) {
                    setUserVote("downvote");
                } else {
                    setUserVote(null);
                }
            }
        });
        return () => unsubscribe();
    }, [type, id, userData])

    const handleVote = async (action) => {
        const docRef = doc(
            db,
            type === "post" ? "posts" : type === "comment" ? "comments" : "replies",
            id
        );

        let updatedData = {};

        if (action === "upvote") {
            updatedData = {
                upvotes: userVote === "upvote" ? upvotes.filter(vote => vote !== userData.uid) : [...upvotes, userData.uid],
                downvotes: downvotes.filter(vote => vote !== userData.uid),
            };

            if (type === "post") {
                await updateDoc(doc(db, "users", userData.uid), {
                    upvoted: userVote === "upvote" ? userData.upvoted.filter(prevId => prevId !== id) : [...userData.upvoted, id],
                    downvoted: userData.downvoted.filter(prevId => prevId !== id),
                });
            }
        } else if (action === "downvote") {
            updatedData = {
                downvotes: userVote === "downvote" ? downvotes.filter(vote => vote !== userData.uid) : [...downvotes, userData.uid],
                upvotes: upvotes.filter(vote => vote !== userData.uid),
            };

            if (type === "post") {
                await updateDoc(doc(db, "users", userData.uid), {
                    downvoted: userVote === "downvote" ? userData.downvoted.filter(prevId => prevId !== id) : [...userData.downvoted, id],
                    upvoted: userData.upvoted.filter(prevId => prevId !== id),
                });
            }
        }
        await updateDoc(docRef, updatedData);
    };


    const handleUpvote = () => {
        handleVote("upvote");
    };

    const handleDownvote = () => {
        handleVote("downvote");
    };

    return (
        <div className="flex items-center gap-1 font-medium text-sm">
            <div
                onClick={handleUpvote}
                className={`rounded-md flex items-center gap-1 py-1 pl-2 pr-3 ${userVote === "upvote" ? "bg-accent text-white dark:text-primary" : "bg-secondary "}`}
            >
                <ChevronUp className="icon-sm" />
                {totalVotes}
            </div>
            <div
                onClick={handleDownvote}
                className={`rounded-md p-1 ${userVote === "downvote" ? "bg-accent text-white dark:text-primary" : "bg-secondary "}`}
            >
                <ChevronDown className="icon-sm" />
            </div>
        </div>
    )
}