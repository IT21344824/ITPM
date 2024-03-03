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

  const [data, setData] = useState({});
  const [user, setUser] = useState(null); 

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;    
        setUser(user);

        const docRef = doc(db, "Users", user.uid);
        const unsubscribe = onSnapshot(
          docRef,
          async (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setData(data);
              if (data.role === "Admins") {
                dispatch({ type: "LOGIN", payload: user });
                navigate("/");
              } else {
                alert("User is not an Admin. Login not allowed.");
                console.log("User is not an Admin. Login not allowed.");
              }
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

  


  return (
    <div className="login">
      <form className="loginform" action="" onSubmit={handleLogin}>
        <h3 className="login_h">Admin Login </h3>
        <input className="loginInput" type="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input className="loginInput" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />

        <button className="loginbtn" type="submit"> Login </button>

        {error && <span> Wrong email or password ! </span>}
      </form>
    </div>
  )
}

export default Login
