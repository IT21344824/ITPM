import { useContext, useState , useEffect } from "react";
import "./login.scss";
import { getDoc, collection, query, doc, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth , db } from "../../../firebase"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {

  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);



  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;    
       

        const docRef = doc(db, "Users", user.uid);
        const unsubscribe = onSnapshot(
          docRef,
          async (doc) => {
            if (doc.exists()) {         
                dispatch({ type: "LOGIN", payload: user });
                navigate("/", { state: { userId: user.uid } });      
            } else {
              console.log("No such document!");
            }
          },
          (error) => {
            console.log("Error getting document:", error);
          }
        );

        return () => unsubscribe();
      })
      .catch((error) => {
        setError(true);
      });
  };

  const handleClick = (e) => {
    e.preventDefault();

    navigate("/SignUp");

  };


  return (
    <div className="login">
      <form className="loginform" action="" onSubmit={handleLogin}>
        <h3 className="login_h">Admin Login </h3>
        <input className="loginInput" type="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input className="loginInput" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />

        <button className="loginbtn" type="submit"> Login </button>
        <div className="login-container">
              <span>Don't have an account?</span>
              <button onClick={handleClick} className="login-button" >
                Sign Up
              </button>
            </div>
        {error && <span> Wrong email or password ! </span>}
      </form>
    </div>
  )
}

export default Login
