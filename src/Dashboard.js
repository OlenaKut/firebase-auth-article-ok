import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  return (
    <>
       <Button variant="primary" onClick={handleShow}>
        LogOut
      </Button>
      {user && ` Hello, ${name}`}
      <Modal show={show} onHide={handleClose}>
        <div className="">
          <div className="dashboard__container">
            Logged in as
            <div>{name}</div>
            <div>{user?.email}</div>
            <button className="dashboard__btn" onClick={logout}>
              Logout
            </button>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Dashboard;
