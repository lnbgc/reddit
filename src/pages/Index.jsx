import { Filters } from "@components/posts/Filters";
import { Post } from "@components/posts/Post";
import { Button } from "@components/ui/Button";
import { Logo } from "@components/ui/Logo";
import { useAuth } from "@contexts/AuthContext";
import { CREATECOMMUNITY, REGISTER } from "@routes/routes";
import { db } from "@utils/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const Index = () => {
  const { userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);

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

  const fetchFollowing = async () => {
    try {
      if (userData && userData.following_communities && userData.following_communities.length > 0) {
        const q = query(collection(db, "communities"), where("id", "in", userData.following_communities));
        const querySnapshot = await getDocs(q);
        const communityData = querySnapshot.docs.map((doc) => doc.data());
        setFollowing(communityData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFollowing();
    fetchFavorites();
  }, [userData]);

  return (
    <>
    <Helmet>
      <title>Reddit - Dive into anything</title>
    </Helmet>
      <div className="min-headerless pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12 grid grid-cols-12 gap-3 min-[1152px]:gap-6">
        <div className="hidden lg:flex lg:col-span-3">

          {userData ? (
            <div className="h-fit w-full sticky flex flex-col gap-4 top-[62px] min-[1152px]:top-[78px]">
              {favorites.length > 0 ? (
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
              ) : (
                <div className="border border-border rounded-md p-4 flex flex-col gap-4">
                  <span className="text-xs uppercase font-medium text-faint">About the project</span>
                  <p className="text-sm font-medium">Thank you for downloading my repository! If you haven't yet make sure to read the project details <a className="underline" href="https://github.com/lnbgc/reddit#readme">right here</a>.</p>
                </div>
              )}

              {following.length > 0 ? (
                <div className="border border-border rounded-md p-4 flex flex-col gap-4">
                  <span className="text-xs uppercase font-medium text-faint">Following communities</span>
                  <ul>
                    {following.map((community) => (
                      <li className="hover:bg-secondary rounded-md  p-2">
                        <Link to={`/r/${community.url}`} key={community.id} className="text-sm font-medium flex items-center gap-2">
                          <img src={community.avatar} className="avatar-sm" alt={community.url} />
                          <p>{community.url}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="border border-border rounded-md p-4 flex flex-col gap-4 mt-4">
                  <span className="text-xs uppercase font-medium text-faint">Let's get in touch</span>
                  <p className="text-sm font-medium">If by any chance you're interested in working with me, here are some links where you can contact me.</p>
                  <div className="flex flex-col gap-2">
                    <Button><Mail className="icon-sm" />Email</Button>
                    <a href="https://www.linkedin.com/in/lena-bageac/">
                      <Button width="full"><Linkedin className="icon-sm" />LinkedIn</Button>
                    </a>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-fit w-full sticky top-[62px] min-[1152px]:top-[78px]">
              <div className="border border-border rounded-md p-4 flex flex-col gap-4">
                <span className="text-xs uppercase font-medium text-faint">About the project</span>
                <p className="text-sm font-medium">Thank you for downloading my repository! If you haven't yet make sure to read the project details <a className="underline" href="https://github.com/lnbgc/reddit#readme">right here</a>.</p>
              </div>
              <div className="border border-border rounded-md p-4 flex flex-col gap-4 mt-4">
                <span className="text-xs uppercase font-medium text-faint">Let's get in touch</span>
                <p className="text-sm font-medium">If by any chance you're interested in working with me, here are some links where you can contact me.</p>
                <div className="flex flex-col gap-2">
                  <Button><Mail className="icon-sm" />Email</Button>
                  <a href="https://www.linkedin.com/in/lena-bageac/">
                    <Button width="full"><Linkedin className="icon-sm" />LinkedIn</Button>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {posts.length > 0 ? (
          <div className="col-span-full md:col-span-8 lg:col-span-6 divide-y divide-border">
            <Filters />
            {posts.map(post => (
              <Post type="preview" key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center col-span-full md:col-span-8 lg:col-span-6">
            <div className="flex flex-col w-full h-fit items-center gap-6">
              <h1 className="font-bold">This is only the beggining.</h1>
              <p className="text-center text-sm">Create your first community and start making posts to engage conversation. Everything will stay right here.</p>
              <Logo type="small" className="h-10" />
            </div>
          </div>
        )}

        <div className="hidden md:flex md:col-span-4 lg:col-span-3">
          <div className="w-full h-fit sticky top-[62px] min-[1152px]:top-[78px] flex flex-col gap-4">

            {userData ? (
              <div className="border border-border rounded-md p-4 flex flex-col gap-4">
                <p className="text-sm font-bold">Home</p>
                <p className="text-sm font-medium">Your personal Reddit frontpage. Come here to check in with your favorite communities.</p>
                <Link to={CREATECOMMUNITY}>
                  <Button type="primary" width="full">
                    Create a community
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="border border-border rounded-md p-4 flex flex-col gap-4">
                <p className="text-sm font-bold">Welcome!</p>
                <p className="text-sm font-medium">Create your Reddit account and join communities to discuss with other redditors.</p>
                <Link to={REGISTER}>
                  <Button type="primary" width="full">
                    Create an account
                  </Button>
                </Link>
              </div>
            )}

            <div className="border border-border rounded-md p-4 flex flex-col gap-4">
              <p className="text-sm font-bold">Reddit Premium</p>
              <p className="text-sm font-medium">Just added this card to fill up some empty space. Please ignore it, that button won't do anything.</p>
              <Button type="secondary">
                Try Now
              </Button>
            </div>
          </div>

        </div >
      </div >
    </>
  );
};
