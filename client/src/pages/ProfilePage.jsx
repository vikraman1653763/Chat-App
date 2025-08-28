import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
const ProfilePage = () => {
  const { authUser, updatedProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updatedProfile({ fullName: name, bio });
      navigate("/");
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updatedProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };
  return (
    <div className=" min-h-screen bg-cover bg-no-repeat flex items-center justify-center ">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className=" text-lg">Profile details</h3>
          <label
            htmlFor="avatar"
            className=" flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .webp, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
            />
            upload profile image
          </label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your Name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="bio..."
            required
          ></textarea>
          <button
            type="submit"
            className=" p-2 text-lg bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:from-purple-300 hover:to-violet-500 "
          >
            Save
          </button>
        </form>
        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && "rounded-full"}`}
            src={authUser.profilePic||assets.logo_icon}
          alt="LOGO"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
