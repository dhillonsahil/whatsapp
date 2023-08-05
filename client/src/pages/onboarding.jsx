import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { reducerCases } from "@/context/constants";

function onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser },dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState();
  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);
  const [image, setImage] = useState("/default_avatar.png");
  const onboardUserhandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });
        if (data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id:data.user.id,
              name,
              email,
              profileImage : image,
              status: about,
            },
          });
          console.log("hhahaha")
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };
  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image src={"/whatsapp.gif"} alt="Whatsapp" height={300} width={300} />
        <span className="text-4xl">Whatsapp</span>
      </div>
      <h1 className="text-2xl">Create Account</h1>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name={"Display Name"} state={name} setState={setName} label />
          <Input name={"About"} state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
              onClick={onboardUserhandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <Avatar type={"xl"} image={image} setImage={setImage} />
      </div>
    </div>
  );
}

export default onboarding;
