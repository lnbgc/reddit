import { Button } from '@components/ui/Button'
import { useAuth } from '@contexts/AuthContext'
import { db } from '@utils/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export const FollowUser = ({ profileID }) => {

    const { userData } = useAuth();
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        setFollowing(userData?.following_users.includes(profileID));
    }, [profileID, userData]);

    const toggleFollow = async () => {
        try {
            if (following) {
                await updateDoc(doc(db, "users", userData.uid), {
                    following_users: arrayRemove(profileID),
                });
                await updateDoc(doc(db, "users", profileID), {
                    followers: arrayRemove(userData.uid),
                });
            } else {
                await updateDoc(doc(db, "users", userData.uid), {
                    following_users: arrayUnion(profileID),
                });
                await updateDoc(doc(db, "users", profileID), {
                    followers: arrayUnion(userData.uid),
                });
            }
            setFollowing(!following)
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button type={following ? "secondary" : "primary"} width="full" onClick={toggleFollow}>
            {following ? "Unfollow" : "Follow"}
        </Button>
    )
}
