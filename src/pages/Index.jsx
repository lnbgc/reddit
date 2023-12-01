import { Post } from "@components/posts/Post";
import { Button } from "@components/ui/Button";
import { useAuth } from "@contexts/AuthContext";
import { CREATECOMMUNITY } from "@routes/routes";
import { db } from "@utils/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Index = () => {
  const { userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const fetchPosts = async () => {
    try {
      const posts = collection(db, "posts");
      const q = query(posts, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map((doc) => doc.data()));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchFavorites = async () => {
    try {
      if (userData && userData.favorite_communities && userData.favorite_communities.length > 0) {
        const q = query(collection(db, "communities"), where("id", "in", userData.favorite_communities));
        const querySnapshot = await getDocs(q);
        const communityData = querySnapshot.docs.map((doc) => doc.data());
        setFavorites(communityData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userData]);

  return (
    <div className="min-headerless grid grid-cols-12 gap-6">
      <div className="hidden lg:flex lg:col-span-3">
        <div className="h-fit w-full sticky top-[78px]">
          <div className="border border-border rounded-md p-4 flex flex-col gap-4">
            <span className="text-xs uppercase font-medium text-faint">Favorite communities</span>
            <ul>
              {favorites.map((community) => (
                <li className="hover:bg-secondary rounded-md  p-2">
                  <Link to={`/r/${community.url}`} key={community.id} className="text-sm font-medium flex items-center gap-2">
                    <img src={community.avatar} className="avatar-sm" alt={community.url} />
                    <p>{community.url}</p>
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
      <div className="col-span-full md:col-span-8 lg:col-span-6 divide-y divide-border">
        {posts.map((post) => (
          <Post key={post.id} post={post} type="preview" />
        ))}
      </div>

      <div className="hidden md:flex md:col-span-4 lg:col-span-3">
        <div className="w-full h-fit sticky top-[78px] flex flex-col gap-4">
          <div className="border border-border rounded-md p-4 flex flex-col gap-4">
            <p className="text-sm font-bold">Home</p>
            <p className="text-sm font-medium">Your personal Reddit frontpage. Come here to check in with your favorite communities.</p>
            <Link to={CREATECOMMUNITY}>
              <Button type="primary" width="full">
                Create a community
              </Button>
            </Link>
          </div>
          <div className="border border-border rounded-md p-4 flex flex-col gap-4">
            <p className="text-sm font-bold">Reddit Premium</p>
            <p className="text-sm font-medium">Just added this card to fill up some empty space. Please ignore it, that button won't do anything.</p>
            <Button type="secondary">
              Try Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
