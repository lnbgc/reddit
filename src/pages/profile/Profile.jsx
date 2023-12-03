import { db, storage } from "@utils/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { PostsTab } from "./tabs/PostsTab";
import { Cake, ChevronRight, Cog, Loader2, Pen, UserCircle2 } from "lucide-react";
import moment from "moment";
import { FollowUser } from "./FollowUser";
import { FollowersTab } from "./tabs/FollowersTab";
import { useAuth } from "@contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SavedTab } from "./tabs/SavedTab";
import { DownvotedTab } from "./tabs/DownvotedTab";
import { UpvotedTab } from "./tabs/UpvotedTab";
import { CommentsTab } from "./tabs/CommentsTab";
import { Filters } from "@components/posts/Filters";
import { Button } from "@components/ui/Button";
import { Modal, ModalBody, ModalHeader } from "@components/ui/Modal";
import { Textarea } from "@components/ui/Textarea";
import { Input } from "@components/ui/Input";
import { Dropdown } from "@components/ui/Dropdown";

export const Profile = () => {

    const { username } = useParams();
    const { userData } = useAuth();

    const [profile, setProfile] = useState(null);

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [bio, setBio] = useState("");
    const [bioLimit, setBioLimit] = useState(150 - bio.length);
    const [social, setSocial] = useState("");

    const [error, setError] = useState("");

    const [moderating, setModerating] = useState([]);

    const [activeTab, setActiveTab] = useState("Posts");

    const [showBioModal, setShowBioModal] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);

    const fetchUser = async () => {
        try {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.error("User not found");
                // navigate to 404 page
                return;
            }
            const userDoc = querySnapshot.docs[0];
            const profileData = userDoc?.data();
            setProfile(profileData);
        } catch (error) {
            console.error("Could not fetch community data:", error);
        }
    }

    const fetchModerating = async () => {
        try {
            const q = query(collection(db, "communities"), where("id", "in", profile.moderating));
            const querySnapshot = await getDocs(q);
            const communityData = querySnapshot.docs.map((doc) => doc.data());
            setModerating(communityData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [username]);

    useEffect(() => {
        if (profile && profile.moderating && profile.moderating.length > 0) {
            fetchModerating();
        }
    }, [profile]);


    const tabContent = () => {
        switch (activeTab) {
            case "Posts":
                return <PostsTab profile={profile} />;
            case "Upvoted":
                return <UpvotedTab profile={profile} />;
            case "Saved":
                return <SavedTab profile={profile} />;
            case "Downvoted":
                return <DownvotedTab profile={profile} />;
            case "Followers":
                return <FollowersTab profile={profile} />;
            case "Comments":
                return <CommentsTab profile={profile} />
            default:
                return null;
        }
    };

    useEffect(() => {
        if (avatar) {
            updateAvatar();
        }
    }, [avatar]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewURL = e.target.result;
                setAvatarPreview(previewURL);
            };

            reader.readAsDataURL(file);
        }
    };

    const updateAvatar = async () => {
        try {
            const userDoc = doc(db, "users", userData.uid);
            if (avatar) {
                const avatarRef = ref(storage, `users_avatars/${userData.uid}`);
                await uploadBytes(avatarRef, avatar);
                const avatarURL = await getDownloadURL(avatarRef);
                await updateDoc(userDoc, { avatar: avatarURL });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center headerless justify-center w-full">
                <Loader2 className="animate-spin h-10 w-10" />
            </div>
        )
    }

    const followersCount = profile.followers.length;

    const userIsProfile = userData?.uid === profile.uid;

    const handleBio = (value) => {
        setBio(value);
        setBioLimit(150 - value.length)
    };

    const updateBio = async (e) => {
        e.preventDefault();
        try {
            const userDoc = doc(db, "users", profile.uid);
            await updateDoc(userDoc, {
                bio,
            });
            setBio("");
            setError("");
            setShowBioModal(false);
            window.location.reload();
        } catch (error) {
            setError("Something went wrong. Please try again.")
            console.error(error);
        }
    }

    const updateSocial = async (e) => {
        e.preventDefault();
        try {
            const userDoc = doc(db, "users", profile.uid);
            await updateDoc(userDoc, {
                social_link: social,
            });
            setSocial("");
            setError("");
            setShowSocialModal(false);
            window.location.reload();
        } catch (error) {
            setError("Something went wrong. Please try again.")
            console.error(error);
        }
    }


    return (
        <>
            <div className="min-headerless pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12">
                <div className="grid grid-cols-12 gap-3 min-[1152px]:gap-6">
                    <div className="col-span-full md:col-span-8">
                        <ul className="flex font-medium gap-6 text-[0.925rem] pb-1 overflow-auto scrollbar-tabs">
                            <li onClick={() => setActiveTab("Posts")} className={`cursor-pointer ${activeTab === "Posts" ? "font-bold text-normal" : "font-medium text-muted"
                                }`}>
                                <span>Posts</span>
                            </li>
                            <li onClick={() => setActiveTab("Comments")} className={`cursor-pointer ${activeTab === "Comments" ? "font-bold text-normal" : "font-medium text-muted"
                                }`}>
                                <span>Comments</span>
                            </li>
                            {userIsProfile && (
                                <li onClick={() => setActiveTab("Saved")} className={`cursor-pointer ${activeTab === "Saved" ? "font-bold text-normal" : "font-medium text-muted"
                                    }`}>
                                    <span>Saved</span>
                                </li>
                            )}
                            <li onClick={() => setActiveTab("Upvoted")} className={`cursor-pointer ${activeTab === "Upvoted" ? "font-bold text-normal" : "font-medium text-muted"
                                }`}>
                                <span>Upvoted</span>
                            </li>
                            <li onClick={() => setActiveTab("Downvoted")} className={`cursor-pointer ${activeTab === "Downvoted" ? "font-bold text-normal" : "font-medium text-muted"
                                }`}>
                                <span>Downvoted</span>
                            </li>
                        </ul>
                        <div className="mt-4">
                            <Filters />
                        </div>
                        <div >
                            <div>
                                {tabContent()}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:col-span-4 md:flex flex-col gap-4">
                        <div className="border border-border rounded-md font-medium text-sm shadow-sm flex flex-col gap-4 p-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div className="relative w-fit">
                                        <img
                                            src={avatarPreview || profile.avatar}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        {userIsProfile && (
                                            <div className="absolute bg-primary rounded-full p-1 -right-3 -bottom-1 border border-border shadow-sm">
                                                <label className="cursor-pointer">
                                                    <Pen className="w-3 h-3" />
                                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {userIsProfile && (profile.bio !== "" || profile.social_link !== "") && (
                                        <Dropdown trigger={<Cog className="icon-sm" />} chevron={false} top="top-10">
                                            <ul className="w-24 text-right flex flex-col">
                                                <li className="hover:bg-secondary rounded-md py-1 pr-2 cursor-pointer" onClick={() => setShowBioModal(true)}>Edit Bio</li>
                                                <li className="hover:bg-secondary rounded-md py-1 pr-2 cursor-pointer" onClick={() => setShowSocialModal(true)}>Edit Social</li>
                                            </ul>
                                        </Dropdown>
                                    )}
                                </div>
                                <span>u/{profile.username}</span>
                                {profile.bio ? (
                                    <p className="text-muted font-normal">{profile.bio}</p>
                                ) : (
                                    <>
                                        {userIsProfile && (
                                            <Button type="primary" onClick={() => setShowBioModal(true)}>Add bio</Button>
                                        )}
                                    </>
                                )}

                                {profile.social_link ? (
                                    <a href={profile.social_link} className="text-muted">{profile.social_link}</a>
                                ) : (
                                    <>
                                        {userIsProfile && (
                                            <Button type="secondary" onClick={() => setShowSocialModal(true)}>Add social link</Button>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-bold">Followers</span>
                                    <div className="flex items-center gap-2">
                                        <UserCircle2 className="icon-sm" />
                                        <p>{followersCount}</p>
                                        {userIsProfile && (
                                            <>
                                                {profile.followers.length > 0 && (
                                                    <ChevronRight className="icon-sm cursor-pointer" onClick={() => setActiveTab("Followers")} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold">Cake Day</span>
                                    <div className="flex items-center gap-2">
                                        <Cake className="icon-sm" />
                                        <p>{moment(profile.createdAt.toDate()).format('MMM D, YYYY')}.</p>
                                    </div>
                                </div>
                            </div>
                            <FollowUser profileID={profile.uid} />
                        </div>

                        {moderating.length > 0 && (
                            <div className="border border-border rounded-md font-medium text-sm shadow-sm flex flex-col gap-4 p-6">
                                <span className="uppercase text-faint text-xs">{userIsProfile ? "You are" : `u/${profile.username} is`} moderating these communities</span>
                                <ul className="space-y-1">
                                    {moderating.map(community => (
                                        <li key={community.id}>
                                            <Link to={`/r/${community.url}`} className="flex items-center gap-2 hover:bg-secondary p-1 rounded-md">
                                                <img src={community.avatar} className="avatar-sm" alt="" />
                                                {community.url}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {userIsProfile && (
                <Modal show={showBioModal} setShow={setShowBioModal}>
                    <ModalHeader>
                        Add a bio to your profile
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-8 w-80">
                            <p className="text-sm font-medium">Describe yourself in a few words to introduce yourself to fellow redditors.</p>
                            <Textarea
                                label="Enter your bio"
                                value={bio}
                                onChange={handleBio}
                                maxLength={150}
                                error={error}
                                description={`${bioLimit} characters remaining.`}
                            />
                            <Button type="primary" onClick={updateBio}>Save</Button>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {userIsProfile && (
                <Modal show={showSocialModal} setShow={setShowSocialModal}>
                    <ModalHeader>
                        Add a social link to your profile
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-8 w-80">
                            <p className="text-sm font-medium">Add a social so people can reach you outside of Reddit.</p>
                            <Input
                                label="Enter your social link"
                                value={social}
                                error={error}
                                onChange={(e) => setSocial(e.target.value)}
                            />
                            <Button type="primary" onClick={updateSocial}>Save</Button>
                        </div>
                    </ModalBody>
                </Modal>
            )}
        </>
    )
}
