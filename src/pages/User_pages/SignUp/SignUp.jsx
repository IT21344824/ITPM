
import { useEffect, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { useHistory } from 'react-router-dom'
import "./SignUp.scss";
import { ToastContainer, toast } from 'react-toastify';


const SignUp = () => {

  //nofify--
  const notifyStyle = {
    whiteSpace: 'pre-line'
  }
  const progressStyle = {
    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
  }

  const [data, setData] = useState({});

  //const history = useHistory();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors] = useState({});


  const handleSubmit = async (event) => {
    event.preventDefault();
    // your registration logic here
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Add a new document in collection "users"
      await setDoc(doc(db, "Users", res.user.uid), {
        ...data,
        name: "",
        role: "Admins",
        timeStamp: serverTimestamp()
      });



      //navigate(-1)
      console.log("Document written with ID: ", res.user.uid);
      // navigate("/login");

      // Reset the input fields
      setEmail('');
      setPassword('');
      //nofity

      toast.success(`Account Successful `, {
        background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

      });

    } catch (error) {
      console.log(error);
      toast.error('Account is already in use or invalid input!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };




  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setData({ ...data, [name]: value });
  };

  // --------------------------------------------------------------------------------------
  const handleClick = (e) => {
    e.preventDefault();

    navigate("/login");

  };




  return (
    <div className="sigup_back">

      <div className='signup'>
        <div className="register-container">

          <form className="register-form" onSubmit={handleSubmit}>
            <h1 className="register-title">Register</h1>


            <div className="form-group">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">

              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"

                value={password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <button type="submit" className="submit-button">Sign up</button>

            <div className="login-container">
              <span>Already have an account?</span>
              <button onClick={handleClick} className="login-button" >
                Login
              </button>
            </div>

            {/* <div className="divider-container">
              
              <span className="divider-text">OR</span>
            </div>

            <button className="google-button" onClick={() => alert('sign in with google')}>
              Sign in with Google
            </button> */}
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={6} //-
        hideProgressBar={false}
        newestOnTop={false} //-
        closeOnClick
        rtl={false} //--
        pauseOnFocusLoss //--
        draggable
        pauseOnHover
        theme="colored"

        style={notifyStyle}

      // progressStyle={progressStyle}

      />
    </div>

  )
}

export default SignUp
