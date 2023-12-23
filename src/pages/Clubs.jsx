import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const JoinButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Clubs = () => {
  // Sample data for clubs
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userClub = JSON.parse(localStorage.getItem("userClub"));
  const [clubUser, setClubUser] = useState(new Set());

  useEffect(() => {
    const userID = user._id;
    console.log(userID);
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/getClubName/${userID}`,{
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        }); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setAdmins(data.formattedAdmins);
        setClubUser(new Set(data.userDetails));
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const showToastAndReload = () => {
    toast.success("Joined to the Club", {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        // Reload the page after the toast is closed
        window.location.reload();
      },
    });
  };

  async function handleJoinClick(clubID, clubName) {
    const userID = user._id;
    try {
      const response = await fetch("http://localhost:8000/user/join/club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          userID,
          clubID,
          clubName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data.message);
      toast.success("Joined to the Club", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => {
          // Reload the page after the toast is closed
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        },
      });
    } catch (error) {
      console.error("Error adding club:", error.message);
    }
  }

  return (
    <div>
      <h2>Clubs Page</h2>
      <Table>
        <thead>
          <tr>
            <Th>Sr. No.</Th>
            <Th>Club Name</Th>
            <Th>Admin</Th>
            <Th>Email</Th>
            <Th>Join</Th>
          </tr>
        </thead>
        <tbody>
          {admins.map((club, index) => (
            <tr key={club.srno}>
              <Td>{index + 1}</Td>
              <Td>{club.clubName}</Td>
              <Td>{club.admin}</Td>
              <Td>{club.email}</Td>
              <Td>
                {clubUser.has(club.id) ? (
                  <JoinButton
                    onClick={() => {
                      toast.warning("Already a Member", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                      });
                    }}
                  >
                    Joined
                  </JoinButton>
                ) : (
                  <JoinButton
                    onClick={() => handleJoinClick(club.id, club.clubName)}
                  >
                    Join
                  </JoinButton>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Clubs;
