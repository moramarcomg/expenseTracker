import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  //Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profilePicUrl = "";

    if(!fullName){
      setError("Please enter your full name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please enter your password");
      return;
    }

    setError(null);

    // Sign Up API Call

  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>

          <div className="flex justify-center">
            <ProfilePhotoSelector image={profilePic} onImageSelect={setProfilePic} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={fullName}
                onChange={({target}) => setFullName(target.value)}
                label="Full Name"
                placeholder="Marco Mora"
                type="text"
              />
            </div>
            <div className="flex-1">
              <Input
                value={email}
                onChange={({target}) => setEmail(target.value)}
                label="Email Address"
                placeholder="marco@example.com"
                type="text"
              />
            </div>
          </div>
          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold cursor-pointer mt-8"
          >
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp